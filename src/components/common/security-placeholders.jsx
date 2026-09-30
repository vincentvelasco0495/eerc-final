import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export function StreamingOnlyNotice() {
  return (
    <Alert severity="info" variant="outlined">
      Streaming-only protection is enabled. Download actions are intentionally disabled in this LMS UI.
    </Alert>
  );
}

export function SingleSessionWarning({ open }) {
  if (!open) {
    return null;
  }

  return (
    <Alert severity="warning" variant="filled">
      Another device session was detected. Continue here to keep this learning session active.
    </Alert>
  );
}

export function DisabledDownloadPanel() {
  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Download controls are locked for protected learning assets.
      </Typography>
      <Button disabled variant="outlined">
        Download disabled
      </Button>
    </Stack>
  );
}
