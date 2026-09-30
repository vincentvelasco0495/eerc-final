import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function EnrollmentSectionCard({ title, description, children }) {
  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.vars.customShadows?.z8 ?? theme.shadows[2],
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Stack>
    </Card>
  );
}
