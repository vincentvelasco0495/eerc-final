import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { ENROLLMENT_WIZARD_STEPS } from '../../constants';
import { findOptionLabel, openEnrollmentFileInNewTab } from '../../utils';

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return '';
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveFileMeta(file) {
  const type = file.type || '';
  const name = file.name?.toLowerCase() || '';

  if (type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(name)) {
    return { icon: 'solar:gallery-bold-duotone', kind: 'Image' };
  }
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return { icon: 'solar:document-text-bold-duotone', kind: 'PDF' };
  }
  if (name.endsWith('.doc') || name.endsWith('.docx')) {
    return { icon: 'solar:document-bold-duotone', kind: 'Document' };
  }

  return { icon: 'solar:file-bold-duotone', kind: 'File' };
}

function SummarySection({ title, onEdit, children }) {
  return (
    <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Button size="small" type="button" onClick={onEdit}>
          Edit
        </Button>
      </Stack>
      <Stack spacing={1}>{children}</Stack>
    </Card>
  );
}

function SummaryRow({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Box>
  );
}

function FileRow({ label, file }) {
  if (!(file instanceof File)) {
    return <SummaryRow label={label} value="No file uploaded" />;
  }

  const { icon, kind } = resolveFileMeta(file);
  const sizeLabel = formatFileSize(file.size);

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        {label}
      </Typography>
      <Box
        component="button"
        type="button"
        aria-label={`View ${label}: ${file.name}`}
        onClick={() => openEnrollmentFileInNewTab(file)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: '100%',
          p: 1.5,
          textAlign: 'left',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.neutral',
          cursor: 'pointer',
          transition: (theme) =>
            theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
              duration: 180,
            }),
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: (theme) => theme.vars.palette.brand.hover,
            boxShadow: (theme) => theme.vars.customShadows?.z4,
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            bgcolor: 'background.paper',
            color: 'brand.accentText',
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2">View attachment</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={file.name}
          >
            {file.name}
          </Typography>
          {sizeLabel ? (
            <Typography variant="caption" color="text.disabled">
              {kind} · {sizeLabel}
            </Typography>
          ) : null}
        </Box>

        <Iconify
          icon="solar:square-arrow-right-up-bold-duotone"
          width={20}
          sx={{ color: 'text.secondary', flexShrink: 0 }}
        />
      </Box>
    </Box>
  );
}

export function StepReviewSubmit({ options, onEditStep }) {
  const { control, watch } = useFormContext();
  const values = watch();

  const genderLabel = values.gender === 'female' ? 'Female' : values.gender === 'male' ? 'Male' : '—';
  const examLabel =
    values.examExperience === 'retaker'
      ? 'Retaker'
      : values.examExperience === 'first-time'
        ? 'First-time taker'
        : '—';
  const dateOfBirthLabel = fDate(values.dateOfBirth) || '—';

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Review your application</Typography>
      <Typography variant="body2" color="text.secondary">
        Confirm that all details are correct before submitting your enrollment application.
      </Typography>

      <SummarySection title={ENROLLMENT_WIZARD_STEPS[0]} onEdit={() => onEditStep(0)}>
        <SummaryRow label="Batch" value={findOptionLabel(options.batchEnrolls, values.batchEnrollId)} />
        <SummaryRow
          label="Mode of learning"
          value={findOptionLabel(options.learningModes, values.learningModeId)}
        />
        <SummaryRow
          label="Branch"
          value={findOptionLabel(options.branchEnrolls, values.branchEnrollId)}
        />
        <SummaryRow
          label="Review schedule"
          value={findOptionLabel(options.reviewSchedules, values.reviewScheduleId)}
        />
      </SummarySection>

      <SummarySection title={ENROLLMENT_WIZARD_STEPS[1]} onEdit={() => onEditStep(1)}>
        <SummaryRow label="Name" value={values.fullName} />
        <SummaryRow label="Alias name" value={values.aliasName} />
        <SummaryRow label="School" value={values.schoolName} />
        <SummaryRow label="Gender" value={genderLabel} />
        <SummaryRow label="Date of birth" value={dateOfBirthLabel} />
        <SummaryRow label="Contact number" value={values.contactNumber} />
        <SummaryRow label="Home address" value={values.homeAddress} />
      </SummarySection>

      <SummarySection title={ENROLLMENT_WIZARD_STEPS[2]} onEdit={() => onEditStep(2)}>
        <FileRow label="Profile picture" file={values.profilePicture} />
        <SummaryRow
          label="Honors / awards / discount"
          value={findOptionLabel(options.honorAwardDiscounts, values.honorAwardDiscountId)}
        />
        <FileRow label="Discount proof" file={values.discountProof} />
      </SummarySection>

      <SummarySection title={ENROLLMENT_WIZARD_STEPS[3]} onEdit={() => onEditStep(3)}>
        <SummaryRow label="Board exam experience" value={examLabel} />
        {values.examExperience === 'retaker' ? (
          <>
            <SummaryRow label="Retaker attempts" value={values.retakerAttempts} />
            <FileRow label="Retaker proof" file={values.retakerProof} />
          </>
        ) : null}
        <FileRow label="Payment proof" file={values.paymentProof} />
        <SummaryRow label="Downpayment / scholarship" value={values.downpaymentAmount} />
      </SummarySection>

      <SummarySection title={ENROLLMENT_WIZARD_STEPS[4]} onEdit={() => onEditStep(4)}>
        <SummaryRow
          label="Package enroll"
          value={findOptionLabel(options.packageEnrolls, values.packageEnrollId)}
        />
        <FileRow label="Signature" file={values.signature} />
      </SummarySection>

      <Divider />

      <Controller
        name="confirmTerms"
        control={control}
        render={({ field, fieldState }) => (
          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
              label="I confirm that all information provided is true and correct, and I agree to the terms stated above."
            />
            {fieldState.error ? (
              <Typography variant="caption" color="error.main">
                {fieldState.error.message}
              </Typography>
            ) : null}
          </Stack>
        )}
      />
    </Stack>
  );
}
