import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { getStepErrorMessages } from '../constants';

export function EnrollmentStepErrors({ stepIndex }) {
  const {
    formState: { errors },
  } = useFormContext();

  const entries = getStepErrorMessages(errors, stepIndex);

  if (!entries.length) {
    return null;
  }

  return (
    <Alert severity="error">
      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
        Please fill out the required fields below:
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
        {entries.map(({ field, label, message }) => (
          <Typography key={field} component="li" variant="body2" sx={{ mb: 0.25 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>
              {label}:
            </Box>{' '}
            {message}
          </Typography>
        ))}
      </Box>
    </Alert>
  );
}
