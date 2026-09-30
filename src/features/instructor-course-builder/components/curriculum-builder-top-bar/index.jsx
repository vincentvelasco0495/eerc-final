import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Menu from '@mui/material/Menu';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { curriculumCourseTabs } from '../../instructor-course-curriculum-data';

export function CurriculumBuilderTopBar({
  backHref,
  courseTitle,
  courseTab,
  onCourseTabChange,
  publishAnchor,
  onOpenPublishMenu,
  onClosePublishMenu,
  /** Learner preview link (defaults to static reference page). */
  viewHref,
}) {
  return (
    <Box sx={styles.root}>
      <Stack spacing={2} sx={styles.mainStack}>
        <Stack direction="row" spacing={2} alignItems="center" sx={styles.left}>
          <Button
            component={RouterLink}
            href={backHref}
            color="inherit"
            startIcon={<Iconify icon="solar:arrow-left-linear" width={20} />}
            sx={styles.backButton}
          >
            Back to courses
          </Button>
          <Divider orientation="vertical" flexItem sx={styles.divider} />
          <Typography variant="h6" sx={styles.title}>
            {courseTitle}
          </Typography>
        </Stack>

        <Box sx={styles.tabsWrap}>
          <Tabs
            value={courseTab}
            onChange={(_, v) => onCourseTabChange?.(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={styles.tabs}
          >
            {curriculumCourseTabs.map((t) => (
              <Tab key={t.value} value={t.value} label={t.label} disableRipple />
            ))}
          </Tabs>
        </Box>

        <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={styles.right}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Iconify icon="solar:alt-arrow-down-linear" width={18} />}
            onClick={onOpenPublishMenu}
            sx={styles.publishButton}
          >
            Published
          </Button>
          <Menu
            anchorEl={publishAnchor}
            open={Boolean(publishAnchor)}
            onClose={onClosePublishMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={onClosePublishMenu}>Published</MenuItem>
            <MenuItem onClick={onClosePublishMenu}>Draft</MenuItem>
            <MenuItem onClick={onClosePublishMenu}>Scheduled</MenuItem>
          </Menu>
          <Button
            component={RouterLink}
            href={viewHref ?? paths.courseDetailDemo}
            variant="outlined"
            color="inherit"
            sx={styles.viewButton}
          >
            View
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
