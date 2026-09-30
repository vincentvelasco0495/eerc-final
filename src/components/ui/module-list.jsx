import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function ModuleList({ modules }) {
  return (
    <Card
      sx={{
        width: 1,
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <List sx={{ p: 0 }}>
        {modules.map((moduleItem) => (
          <ListItem
            key={moduleItem.id}
            divider
            sx={{
              py: 2.5,
              px: 3,
              gap: 2,
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: 'grid',
                flexShrink: 0,
                placeItems: 'center',
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
                color: 'text.secondary',
              }}
            >
              <Typography variant="subtitle2">{moduleItem.type.slice(0, 1)}</Typography>
            </Box>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                justifyContent="space-between"
              >
                <Typography variant="subtitle1">{moduleItem.title}</Typography>
                <Chip
                  label={moduleItem.type}
                  color={moduleItem.progress > 0 ? 'primary' : 'default'}
                  size="small"
                />
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {moduleItem.subject} / {moduleItem.topic} / {moduleItem.subtopic}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {moduleItem.duration} • Resume at {moduleItem.lastPosition}
              </Typography>
              <LinearProgress value={moduleItem.progress} variant="determinate" sx={{ height: 8, borderRadius: 99 }} />
            </Stack>

            <Button
              component={RouterLink}
              href={paths.dashboard.modules.details(moduleItem.id)}
              variant="outlined"
            >
              Open module
            </Button>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
