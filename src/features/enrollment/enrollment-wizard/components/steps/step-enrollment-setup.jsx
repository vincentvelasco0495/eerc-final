import { useMemo, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EnrollmentRadioCards } from '../enrollment-radio-cards';
import { EnrollmentSectionCard } from '../enrollment-section-card';
import {
  stripPlainText,
  findOptionLabel,
  filterSchedulesForBranch,
  isPureOnlineLearningMode,
  filterBatchEnrollsForProgram,
  filterBranchesForLearningMode,
} from '../../utils';

export function StepEnrollmentSetup({ options, programId }) {
  const { control, watch, setValue } = useFormContext();
  const learningModeId = watch('learningModeId');
  const branchEnrollId = watch('branchEnrollId');
  const batchEnrollId = watch('batchEnrollId');

  const batchOptions = useMemo(
    () =>
      filterBatchEnrollsForProgram(options.batchEnrolls ?? [], programId).map((item) => ({
        ...item,
        description: item.description ? stripPlainText(item.description) : undefined,
        helper: item.tentativeStart ? `Tentative start: ${item.tentativeStart}` : undefined,
      })),
    [options.batchEnrolls, programId]
  );

  useEffect(() => {
    if (!batchOptions.length) {
      if (batchEnrollId) {
        setValue('batchEnrollId', '');
      }
      return;
    }

    const stillValid = batchOptions.some((item) => item.id === batchEnrollId);
    if (!stillValid) {
      setValue('batchEnrollId', batchOptions.length === 1 ? batchOptions[0].id : '');
    }
  }, [batchEnrollId, batchOptions, setValue]);

  const learningModeName = findOptionLabel(options.learningModes, learningModeId);
  const branchOptions = useMemo(
    () => filterBranchesForLearningMode(options.branchEnrolls ?? [], learningModeName),
    [options.branchEnrolls, learningModeName]
  );
  const branchName = findOptionLabel(branchOptions, branchEnrollId);
  const scheduleOptions = useMemo(
    () => filterSchedulesForBranch(options.reviewSchedules ?? [], branchEnrollId, branchName),
    [options.reviewSchedules, branchEnrollId, branchName]
  );

  return (
    <EnrollmentSectionCard
      title="Enrollment setup"
      description="Choose your batch, learning mode, branch, and review schedule."
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Batch enrolled
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Select the intake batch (for example Batch 1 or Batch 2). This is separate from your
            mode of learning below.
          </Typography>
          {!batchOptions.length ? (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              No enrollment batches are available for this program yet. Please contact EERC staff or
              try again later.
            </Alert>
          ) : null}
          <Controller
            name="batchEnrollId"
            control={control}
            render={({ field, fieldState }) => (
              <EnrollmentRadioCards
                name="batchEnrollId"
                value={field.value}
                onChange={field.onChange}
                options={batchOptions}
                error={fieldState.error?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Mode of learning
          </Typography>
          <Controller
            name="learningModeId"
            control={control}
            render={({ field, fieldState }) => (
              <EnrollmentRadioCards
                name="learningModeId"
                value={field.value}
                onChange={(next) => {
                  field.onChange(next);
                  setValue('branchEnrollId', '');
                  setValue('reviewScheduleId', '');
                  const modeName = findOptionLabel(options.learningModes, next);
                  if (isPureOnlineLearningMode(modeName)) {
                    const onlineBranch = filterBranchesForLearningMode(
                      options.branchEnrolls ?? [],
                      modeName
                    )[0];
                    if (onlineBranch) {
                      setValue('branchEnrollId', onlineBranch.id);
                    }
                  }
                }}
                options={options.learningModes ?? []}
                error={fieldState.error?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Branch to enroll
          </Typography>
          <Controller
            name="branchEnrollId"
            control={control}
            render={({ field, fieldState }) => (
              <EnrollmentRadioCards
                name="branchEnrollId"
                value={field.value}
                onChange={(next) => {
                  field.onChange(next);
                  setValue('reviewScheduleId', '');
                }}
                options={branchOptions}
                error={fieldState.error?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Review schedule
          </Typography>
          <Controller
            name="reviewScheduleId"
            control={control}
            render={({ field, fieldState }) => (
              <EnrollmentRadioCards
                name="reviewScheduleId"
                value={field.value}
                onChange={field.onChange}
                options={scheduleOptions}
                error={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </Stack>
    </EnrollmentSectionCard>
  );
}
