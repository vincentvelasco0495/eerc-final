import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function EnrollmentRadioCards({ name, value, options = [], onChange, error }) {
  return (
    <Stack spacing={1.5}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <Box
            key={option.id}
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onChange(option.id);
              }
            }}
            sx={{
              p: 2,
              borderRadius: 1.5,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: (theme) =>
                selected ? theme.vars.palette.brand.accentSoft : theme.vars.palette.background.paper,
              transition: (theme) =>
                theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
                  duration: 180,
                }),
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: (theme) => theme.vars.customShadows?.z4,
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Radio checked={selected} value={option.id} name={name} sx={{ mt: -0.5, p: 0.5 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2">{option.name}</Typography>
                {option.description ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {option.description}
                  </Typography>
                ) : null}
                {option.helper ? (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                    {option.helper}
                  </Typography>
                ) : null}
              </Box>
            </Stack>
          </Box>
        );
      })}
      {error ? (
        <Typography variant="caption" color="error.main">
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
