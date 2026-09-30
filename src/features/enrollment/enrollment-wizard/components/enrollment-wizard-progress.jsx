import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { ENROLLMENT_WIZARD_STEPS } from '../constants';

export function EnrollmentWizardProgress({ activeStep }) {
  const progress = Math.round(((activeStep + 1) / ENROLLMENT_WIZARD_STEPS.length) * 100);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        mb: 3,
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.vars.customShadows?.z8,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="overline" color="brand.accentText">
              EERC Learning Center
            </Typography>
            <Typography variant="h5">Student Enrollment Application</Typography>
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {progress}% complete
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 99 }} />
        <Stepper activeStep={activeStep} alternativeLabel sx={{ display: { xs: 'none', md: 'flex' } }}>
          {ENROLLMENT_WIZARD_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="subtitle1" sx={{ display: { xs: 'block', md: 'none' } }}>
          Step {activeStep + 1} of {ENROLLMENT_WIZARD_STEPS.length}: {ENROLLMENT_WIZARD_STEPS[activeStep]}
        </Typography>
      </Stack>
    </Box>
  );
}
