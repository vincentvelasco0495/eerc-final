import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { patchLmsCourse, getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { styles } from './styles';

function CourseMetaItem({ icon, children }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Iconify icon={icon} width={16} sx={styles.courseMetaIcon} />
      <Typography variant="body2" sx={styles.courseMetaText}>
        {children}
      </Typography>
    </Stack>
  );
}

export function InstructorCourseCard({
  course,
  onCourseUpdate,
  onRemoteCoursesInvalidate,
  /** When set, shows a CTA below the meta row (outside the course preview link). */
  onEnrollNowClick,
  enrollNowLabel = 'Enroll now',
  /** Student course-access CTA rendered outside the preview click target. */
  studentAction = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, user } = useAuthContext();

  const showStaffCourseStatusFooter =
    authenticated && String(user?.role ?? '').toLowerCase() !== 'student';

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const menuOpen = Boolean(menuAnchorEl);

  const applyCourseStatus = (nextStatus) => {
    if (!onCourseUpdate) {
      return;
    }
    onCourseUpdate(course.id, (current) => ({
      ...current,
      status: nextStatus,
      badge: nextStatus === 'draft' ? 'Draft' : null,
      badgeColor: nextStatus === 'draft' ? 'warning' : 'default',
    }));
  };

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMoveToDrafts = async (event) => {
    event?.stopPropagation?.();
    handleCloseMenu();
    if (course.status === 'draft' || statusBusy) {
      return;
    }
    const previousStatus = course.status;
    applyCourseStatus('draft');
    if (CONFIG.serverUrl?.trim()) {
      setStatusBusy(true);
      try {
        await patchLmsCourse(course.id, { isPublished: false });
        onRemoteCoursesInvalidate?.();
        toast.info(`"${course.title}" is now a draft.`);
      } catch (e) {
        applyCourseStatus(previousStatus);
        toast.error(getLmsAxiosErrorMessage(e, 'Could not update course status.'));
      } finally {
        setStatusBusy(false);
      }
      return;
    }
    toast.info(`"${course.title}" moved to drafts (demo).`);
  };

  const handlePublish = async (event) => {
    event?.stopPropagation?.();
    handleCloseMenu();
    if (course.status !== 'draft' || statusBusy) {
      return;
    }
    const previousStatus = course.status;
    applyCourseStatus('published');
    if (CONFIG.serverUrl?.trim()) {
      setStatusBusy(true);
      try {
        await patchLmsCourse(course.id, { isPublished: true });
        onRemoteCoursesInvalidate?.();
        toast.success(`"${course.title}" is published.`);
      } catch (e) {
        applyCourseStatus(previousStatus);
        toast.error(getLmsAxiosErrorMessage(e, 'Could not publish course.'));
      } finally {
        setStatusBusy(false);
      }
      return;
    }
    toast.success(`"${course.title}" is published (demo).`);
  };

  const handleManageCourse = (event) => {
    event?.stopPropagation?.();
    handleCloseMenu();
    const slugOrId = typeof course.detailSlug === 'string' ? course.detailSlug.trim() : '';
    if (!slugOrId) {
      toast.error('This course cannot be opened (missing slug or id from the API).');
      return;
    }
    navigate(paths.dashboard.courseCurriculumEdit(slugOrId));
  };

  const handleOpenCourseDetail = () => {
    const slugOrId = typeof course.detailSlug === 'string' ? course.detailSlug.trim() : '';
    if (!slugOrId) {
      toast.error('This course cannot be opened (missing slug or id from the API).');
      return;
    }
    navigate(paths.dashboard.courseDetails(slugOrId), {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const handlePreviewKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenCourseDetail();
    }
  };

  return (
    <Card sx={[styles.card, statusBusy && styles.cardBusy]}>
      <CardContent sx={styles.cardContent}>
        <Stack spacing={1.6}>
          {/* Course-detail navigation is limited to this block so menu (React tree) clicks do not bubble to it. */}
          <Box
            component="div"
            role="button"
            tabIndex={0}
            aria-label={`Open course: ${course.title}`}
            onClick={handleOpenCourseDetail}
            onKeyDown={handlePreviewKeyDown}
            sx={styles.previewClickable}
          >
            <Stack spacing={1.6}>
              <Box
                sx={{
                  position: 'relative',
                  width: 1,
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  borderRadius: 3,
                  bgcolor: 'background.neutral',
                }}
              >
                {course.bannerImageUrl ? (
                  <Box
                    component="img"
                    src={course.bannerImageUrl}
                    alt=""
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: 1,
                      height: 1,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: 1,
                      height: 1,
                      transform: 'none',
                    }}
                  />
                )}
              </Box>

              <Stack spacing={0.6}>
                <Typography variant="caption" sx={styles.categoryCaption}>
                  {course.category}
                </Typography>
                <Typography variant="h6" sx={styles.title}>
                  {course.title}
                </Typography>
              </Stack>

              {typeof onEnrollNowClick === 'function' ? (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ rowGap: 1, width: 1 }}
                >
                  <Box sx={[styles.metaRow, { flex: 1, minWidth: 0 }]}>
                    <Box sx={styles.metaCellStart}>
                      <CourseMetaItem icon="solar:list-check-bold-duotone">
                        {course.lessons} Lectures
                      </CourseMetaItem>
                    </Box>
                    <Box aria-hidden />
                    <Box sx={styles.metaCellEnd}>
                      <CourseMetaItem icon="solar:clock-circle-bold-duotone">
                        {course.durationHours} Hours
                      </CourseMetaItem>
                    </Box>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ flexShrink: 0 }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEnrollNowClick(course);
                    }}
                  >
                    {enrollNowLabel}
                  </Button>
                </Stack>
              ) : (
                <Box sx={styles.metaRow}>
                  <Box sx={styles.metaCellStart}>
                    <CourseMetaItem icon="solar:list-check-bold-duotone">
                      {course.lessons} Lectures
                    </CourseMetaItem>
                  </Box>
                  <Box aria-hidden />
                  <Box sx={styles.metaCellEnd}>
                    <CourseMetaItem icon="solar:clock-circle-bold-duotone">
                      {course.durationHours} Hours
                    </CourseMetaItem>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>

          {studentAction?.label ? (
            <Button
              size="small"
              fullWidth
              variant={studentAction.variant ?? 'contained'}
              color={studentAction.color ?? 'primary'}
              disabled={Boolean(studentAction.disabled || studentAction.loading)}
              onClick={(event) => {
                event.stopPropagation();
                studentAction.onClick?.(course);
              }}
              startIcon={
                studentAction.loading ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {studentAction.label}
            </Button>
          ) : null}

          {showStaffCourseStatusFooter ? (
            <>
              <Divider />

              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-end">
                <Stack spacing={0.25}>
                  <Typography variant="caption" sx={styles.statusCaption}>
                    Course status:
                  </Typography>
                  <Chip
                    label={course.status === 'published' ? 'Published' : 'Draft'}
                    color={
                      course.status === 'published'
                        ? 'success'
                        : course.status === 'draft'
                          ? 'warning'
                          : 'info'
                    }
                    size="small"
                    sx={styles.statusChip}
                  />
                </Stack>

                <Stack direction="row" spacing={0.75} alignItems="flex-end">
                  <Stack spacing={0.25} sx={{ minWidth: 0, textAlign: 'right' }}>
                    <Typography variant="caption" sx={styles.updatedCaption}>
                      Last updated:
                    </Typography>
                    <Typography variant="body2" sx={styles.updatedValue}>
                      {course.updatedAt}
                    </Typography>
                  </Stack>

                  <IconButton
                    color="inherit"
                    aria-label={`Course actions: ${course.title}`}
                    aria-controls={menuOpen ? `course-menu-${course.id}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    onClick={handleOpenMenu}
                    disabled={statusBusy}
                    sx={styles.menuTrigger}
                  >
                    {statusBusy ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <Iconify icon="mdi:dots-vertical" width={20} />
                    )}
                  </IconButton>

                  <Menu
                    id={`course-menu-${course.id}`}
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{ paper: { sx: styles.menuPaper } }}
                  >
                    {course.status === 'draft' ? (
                      <MenuItem dense onClick={handlePublish} sx={styles.menuItem}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Iconify icon="solar:check-circle-bold-duotone" width={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Publish"
                          slotProps={{ primary: { typography: 'body2' } }}
                        />
                      </MenuItem>
                    ) : (
                      <MenuItem dense onClick={handleMoveToDrafts} sx={styles.menuItem}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Iconify icon="solar:document-text-bold-duotone" width={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Move to drafts"
                          slotProps={{ primary: { typography: 'body2' } }}
                        />
                      </MenuItem>
                    )}

                    <MenuItem dense onClick={handleManageCourse} sx={styles.menuItem}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Iconify icon="solar:settings-bold-duotone" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Manage course"
                        slotProps={{ primary: { typography: 'body2' } }}
                      />
                    </MenuItem>
                  </Menu>
                </Stack>
              </Stack>
            </>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
