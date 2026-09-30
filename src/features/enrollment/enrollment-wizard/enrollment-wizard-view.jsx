import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useLmsUser, useLmsActions, useLmsPrograms, useLmsEnrollments } from 'src/hooks/use-lms';

import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

import { StepExamPayment } from './components/steps/step-exam-payment';
import { useEnrollmentFormOptions } from './use-enrollment-form-options';
import { StepReviewSubmit } from './components/steps/step-review-submit';
import { EnrollmentStepErrors } from './components/enrollment-step-errors';
import { StepPackageConsent } from './components/steps/step-package-consent';
import { StepEnrollmentSetup } from './components/steps/step-enrollment-setup';
import { enrollmentWizardSchema, enrollmentWizardDefaultValues } from './schema';
import { EnrollmentWizardProgress } from './components/enrollment-wizard-progress';
import { StepDocumentsDiscounts } from './components/steps/step-documents-discounts';
import { StepPersonalInformation } from './components/steps/step-personal-information';
import { STEP_FIELD_GROUPS, findFirstErrorStep, getFirstErrorMessage, ENROLLMENT_WIZARD_STEPS } from './constants';
import {
  findOptionLabel,
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  buildFormDataPayload,
  clearEnrollmentDraft,
  mergeEnrollmentInitialValues,
  findLatestEnrollmentWithFormData,
} from './utils';

export function EnrollmentWizardView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('programId') ?? '';
  const { programs } = useLmsPrograms();
  const { submitEnrollment } = useLmsActions();
  const { user: authUser, loading: authLoading } = useAuthContext();
  const { user: lmsUser, isLoading: profileLoading } = useLmsUser();
  const { enrollments, isLoading: enrollmentsLoading } = useLmsEnrollments(Boolean(programId));
  const { options, isLoading, error } = useEnrollmentFormOptions(programId);
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const programTitle = useMemo(
    () => programs.find((item) => item.id === programId)?.title ?? 'Selected program',
    [programId, programs]
  );

  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: zodResolver(enrollmentWizardSchema),
    defaultValues: enrollmentWizardDefaultValues,
  });

  const { handleSubmit, trigger, watch, reset } = methods;

  useEffect(() => {
    if (formInitialized || authLoading || profileLoading || enrollmentsLoading) {
      return;
    }

    const draft = loadEnrollmentDraft();
    const profileUser = lmsUser ?? authUser;
    const previousApplication = findLatestEnrollmentWithFormData(enrollments);
    reset(
      mergeEnrollmentInitialValues({
        draft,
        user: profileUser,
        previousApplication,
      })
    );

    if (draft) {
      let step = Number.isFinite(draft.activeStep)
        ? Math.min(Math.max(0, draft.activeStep), ENROLLMENT_WIZARD_STEPS.length - 1)
        : 0;

      if (step >= ENROLLMENT_WIZARD_STEPS.length - 1) {
        step = ENROLLMENT_WIZARD_STEPS.length - 2;
      }

      setActiveStep(step);
      toast.info('Draft restored. Re-upload required files before submitting.');
    }

    setFormInitialized(true);
  }, [
    authLoading,
    authUser,
    enrollments,
    enrollmentsLoading,
    formInitialized,
    lmsUser,
    profileLoading,
    reset,
  ]);

  const handleNext = useCallback(async () => {
    const fields = STEP_FIELD_GROUPS[activeStep] ?? [];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) {
      toast.error('Some required fields are not filled out. See the list above.');
      return;
    }
    setActiveStep((step) => Math.min(step + 1, ENROLLMENT_WIZARD_STEPS.length - 1));
  }, [activeStep, trigger]);

  const handleBack = useCallback(() => {
    setActiveStep((step) => Math.max(step - 1, 0));
  }, []);

  const handleSaveDraft = useCallback(() => {
    saveEnrollmentDraft(watch(), activeStep);
    toast.success('Draft saved.');
  }, [activeStep, watch]);

  const onSubmit = handleSubmit(
    async (values) => {
      if (!programId) {
        toast.error('Please start enrollment from a program page.');
        return;
      }

      setSubmitting(true);
      try {
        const labels = {
          batchEnroll: findOptionLabel(options.batchEnrolls, values.batchEnrollId),
          learningMode: findOptionLabel(options.learningModes, values.learningModeId),
          branchEnroll: findOptionLabel(options.branchEnrolls, values.branchEnrollId),
          reviewSchedule: findOptionLabel(options.reviewSchedules, values.reviewScheduleId),
          honorAwardDiscount: findOptionLabel(options.honorAwardDiscounts, values.honorAwardDiscountId),
          packageEnroll: findOptionLabel(options.packageEnrolls, values.packageEnrollId),
          programTitle,
        };

        await submitEnrollment({
          programId,
          formData: buildFormDataPayload({ programId, values, labels }),
        });

        clearEnrollmentDraft();
        setSubmitted(true);
        toast.success('Enrollment application submitted successfully.');
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.message ?? 'Could not submit enrollment.';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    (errors) => {
      const step = findFirstErrorStep(errors);
      setActiveStep(step);
      toast.error(getFirstErrorMessage(errors));
    }
  );

  if (submitted) {
    return (
      <StudentWorkspaceShell>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h4">Application submitted</Typography>
          <Typography variant="body1" color="text.secondary">
            You are now officially enrolled at EERC. We will send further instructions a few days
            before the start of class. Welcome to EERC Learning Center!
          </Typography>
          <Button variant="contained" onClick={() => navigate(paths.dashboard.availablePrograms)}>
            Back to programs
          </Button>
        </Stack>
      </StudentWorkspaceShell>
    );
  }

  return (
    <StudentWorkspaceShell>
      <Stack spacing={3.25} sx={{ width: 1, minWidth: 0 }}>
        <EnrollmentWizardProgress activeStep={activeStep} />

        {!programId ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Open this form from a program to continue. Choose a program first, then start enrollment.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Applying for: <strong>{programTitle}</strong>
          </Alert>
        )}

        {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

        {isLoading || !formInitialized ? (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <EnrollmentStepErrors stepIndex={activeStep} />

              {activeStep === 0 ? <StepEnrollmentSetup options={options} programId={programId} /> : null}
              {activeStep === 1 ? <StepPersonalInformation /> : null}
              {activeStep === 2 ? <StepDocumentsDiscounts options={options} /> : null}
              {activeStep === 3 ? <StepExamPayment /> : null}
              {activeStep === 4 ? <StepPackageConsent options={options} /> : null}
              {activeStep === 5 ? (
                <StepReviewSubmit options={options} onEditStep={setActiveStep} />
              ) : null}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                  {activeStep > 0 ? (
                    <Button variant="outlined" onClick={handleBack} disabled={submitting}>
                      Back
                    </Button>
                  ) : null}
                  <Button variant="text" onClick={handleSaveDraft} disabled={submitting}>
                    Save draft
                  </Button>
                </Stack>

                {activeStep < ENROLLMENT_WIZARD_STEPS.length - 1 ? (
                  <Button variant="contained" onClick={handleNext} disabled={submitting || !programId}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" disabled={submitting || !programId}>
                    {submitting ? 'Submitting…' : 'Submit application'}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Form>
        )}
      </Stack>
    </StudentWorkspaceShell>
  );
}
