import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function CourseCard({ course }) {
  const progressValue = (course.completedModules / course.totalModules) * 100;

  return (
    <Card
      sx={{
        width: 1,
        height: '100%',
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Avatar
              variant="rounded"
              sx={{ width: 48, height: 48, bgcolor: 'primary.lighter', color: 'brand.accentText' }}
            >
              {course.title.slice(0, 2).toUpperCase()}
            </Avatar>
            <Chip label={course.level} size="small" color="primary" variant="outlined" />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h6">{course.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {course.description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {course.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>

          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Module progress
              </Typography>
              <Typography variant="body2">
                {course.completedModules}/{course.totalModules}
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 99 }} />
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button
              component={RouterLink}
              href={
                course.slug
                  ? paths.dashboard.courseDetails(course.slug)
                  : paths.dashboard.courses.details(course.id)
              }
              variant="contained"
            >
              Open course
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
