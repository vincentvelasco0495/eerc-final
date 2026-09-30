import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
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

import { useLmsActions } from 'src/hooks/use-lms';

import { resolveProgramBannerSrc } from 'src/utils/program-banner';

import { CONFIG } from 'src/global-config';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import {
  canSubmitPartialPayment,
  buildPartialPaymentSummary,
} from 'src/features/enrollment/utils/enrollment-payments';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EnrollmentPartialPaymentDialog } from 'src/components/enrollments/enrollment-partial-payment-dialog';
import { EnrollmentPaymentHistoryDialog } from 'src/components/enrollments/enrollment-payment-history-dialog';

import { styles } from './styles';

function ProgramMetaItem({ icon, children }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Iconify icon={icon} width={16} sx={styles.metaIcon} />
      <Typography variant="body2" sx={styles.metaText}>
        {children}
      </Typography>
    </Stack>
  );
}

function resolveStudentEnrollmentChip(enrollmentKind) {
  if (enrollmentKind === 'approved') {
    return { label: 'Enrolled', color: 'success' };
  }
  if (enrollmentKind === 'pending') {
    return { label: 'Pending', color: 'warning' };
  }
  if (enrollmentKind === 'hold') {
    return { label: 'On hold', color: 'info' };
  }
  return { label: 'Not enrolled', color: 'default' };
}

export function InstructorProgramCard({
  program,
  onProgramUpdate,
  onRemoteProgramsInvalidate,
  readOnly = false,
  enrollmentRecord = null,
  onEnrollmentRefresh,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { runCommand } = useLmsActions();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const [partialPaymentOpen, setPartialPaymentOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const menuOpen = Boolean(menuAnchorEl);

  const bannerSrc = resolveProgramBannerSrc(program.bannerUrl || program.bannerPath);
  const isActive = program.status === 'active';
  const enrollmentChip = resolveStudentEnrollmentChip(program.enrollmentKind);
  const canPayPartial = Boolean(enrollmentRecord) && canSubmitPartialPayment(enrollmentRecord);
  const paymentSummary = useMemo(
    () => (readOnly ? buildPartialPaymentSummary(program, enrollmentRecord) : null),
    [enrollmentRecord, program, readOnly]
  );
  const publishedCoursesLabel =
    program.courseCount === 1 ? 'Published course' : 'Published courses';

  const openProgram = () => {
    const slug = String(program.programSlug ?? '').trim();
    if (!slug) {
      return;
    }
    navigate(`${paths.programCourseDetail}?program=${encodeURIComponent(slug)}`, {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const handlePreviewKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProgram();
    }
  };

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const applyLocalStatus = (nextStatus) => {
    onProgramUpdate?.(program.id, (current) => ({
      ...current,
      status: nextStatus,
    }));
  };

  const handleSetStatus = async (nextStatus) => {
    handleCloseMenu();
    if (program.status === nextStatus || statusBusy) {
      return;
    }

    const previousStatus = program.status;
    applyLocalStatus(nextStatus);

    if (CONFIG.serverUrl?.trim()) {
      setStatusBusy(true);
      try {
        await runCommand('program.update', {
          publicId: program.id,
          body: { status: nextStatus },
        });
        onRemoteProgramsInvalidate?.();
        toast.success(
          nextStatus === 'active'
            ? `"${program.title}" is now active.`
            : `"${program.title}" is now inactive.`
        );
      } catch (error) {
        applyLocalStatus(previousStatus);
        toast.error(getLmsAxiosErrorMessage(error, 'Could not update program status.'));
      } finally {
        setStatusBusy(false);
      }
      return;
    }

    toast.success(
      nextStatus === 'active'
        ? `"${program.title}" is active (demo).`
        : `"${program.title}" is inactive (demo).`
    );
  };

  const handleManageProgram = (event) => {
    event?.stopPropagation?.();
    handleCloseMenu();
    openProgram();
  };

  const handleOpenPartialPayment = (event) => {
    event?.stopPropagation?.();
    handleCloseMenu();
    if (!canPayPartial) {
      return;
    }
    setPartialPaymentOpen(true);
  };

  const handlePartialPaymentSuccess = () => {
    onEnrollmentRefresh?.();
  };

  const handleOpenPaymentHistory = (event) => {
    event?.stopPropagation?.();
    handleCloseMenu();
    setHistoryOpen(true);
  };

  return (
    <Card sx={[styles.card, statusBusy && styles.cardBusy]}>
      <CardContent sx={styles.cardContent}>
        <Stack spacing={1.6}>
          <Box
            component="div"
            role="button"
            tabIndex={0}
            aria-label={`Open program: ${program.title}`}
            onClick={openProgram}
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
                {bannerSrc ? (
                  <Box
                    component="img"
                    src={bannerSrc}
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
                  {program.category}
                </Typography>
                <Typography variant="h6" component="h3" sx={styles.title}>
                  {program.title}
                </Typography>
              </Stack>

              <Box sx={styles.metaRow}>
                <Box sx={styles.metaCellStart}>
                  <ProgramMetaItem icon="solar:book-bookmark-bold-duotone">
                    {program.courseCount} {publishedCoursesLabel}
                  </ProgramMetaItem>
                </Box>
                <Box sx={styles.metaCellCenter}>
                  <ProgramMetaItem icon="solar:list-check-bold-duotone">
                    {program.lectureCount} Lectures
                  </ProgramMetaItem>
                </Box>
                <Box sx={styles.metaCellEnd}>
                  <ProgramMetaItem icon="solar:clock-circle-bold-duotone">
                    {program.durationHours} Hours
                  </ProgramMetaItem>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Divider />

          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-end">
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Stack spacing={0.25}>
                <Typography variant="caption" sx={styles.statusCaption}>
                  {readOnly ? 'Enrollment status:' : 'Program status:'}
                </Typography>
                <Chip
                  label={readOnly ? enrollmentChip.label : isActive ? 'Active' : 'Inactive'}
                  color={readOnly ? enrollmentChip.color : isActive ? 'success' : 'warning'}
                  size="small"
                  sx={styles.statusChip}
                />
              </Stack>

              {readOnly && paymentSummary ? (
                <Stack spacing={0.2}>
                  {paymentSummary.totalFeeLabel ? (
                    <Typography variant="caption" sx={styles.statusCaption}>
                      Program fee:{' '}
                      <Box component="span" sx={styles.updatedValue}>
                        {paymentSummary.totalFeeLabel}
                      </Box>
                    </Typography>
                  ) : null}
                  <Typography variant="caption" sx={styles.statusCaption}>
                    Amount paid:{' '}
                    <Box component="span" sx={styles.updatedValue}>
                      {paymentSummary.totalPaid > 0
                        ? paymentSummary.totalPaidLabel
                        : '—'}
                    </Box>
                    {paymentSummary.totalFeeLabel && paymentSummary.totalPaid > 0
                      ? ` of ${paymentSummary.totalFeeLabel}`
                      : ''}
                  </Typography>
                  {paymentSummary.remainingLabel && paymentSummary.totalPaid > 0 ? (
                    <Typography variant="caption" color="text.secondary">
                      Remaining: {paymentSummary.remainingLabel}
                    </Typography>
                  ) : null}
                </Stack>
              ) : null}
            </Stack>

            <Stack direction="row" spacing={0.75} alignItems="flex-end">
              <Stack spacing={0.25} sx={{ minWidth: 0, textAlign: 'right' }}>
                <Typography variant="caption" sx={styles.updatedCaption}>
                  Last updated:
                </Typography>
                <Typography variant="body2" sx={styles.updatedValue}>
                  {program.updatedAt}
                </Typography>
              </Stack>

              {!readOnly ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label={`Program actions: ${program.title}`}
                    aria-controls={menuOpen ? `program-menu-${program.id}` : undefined}
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
                    id={`program-menu-${program.id}`}
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{ paper: { sx: styles.menuPaper } }}
                  >
                    {isActive ? (
                      <MenuItem dense onClick={() => handleSetStatus('inactive')} sx={styles.menuItem}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Iconify icon="solar:pause-circle-bold-duotone" width={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Set inactive"
                          slotProps={{ primary: { typography: 'body2' } }}
                        />
                      </MenuItem>
                    ) : (
                      <MenuItem dense onClick={() => handleSetStatus('active')} sx={styles.menuItem}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Iconify icon="solar:check-circle-bold-duotone" width={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Set active"
                          slotProps={{ primary: { typography: 'body2' } }}
                        />
                      </MenuItem>
                    )}

                    <MenuItem dense onClick={handleManageProgram} sx={styles.menuItem}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Iconify icon="solar:settings-bold-duotone" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Manage program"
                        slotProps={{ primary: { typography: 'body2' } }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <IconButton
                    color="inherit"
                    aria-label={`Program actions: ${program.title}`}
                    aria-controls={menuOpen ? `student-program-menu-${program.id}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    onClick={handleOpenMenu}
                    sx={styles.menuTrigger}
                  >
                    <Iconify icon="mdi:dots-vertical" width={20} />
                  </IconButton>

                  <Menu
                    id={`student-program-menu-${program.id}`}
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{ paper: { sx: styles.menuPaper } }}
                  >
                    <MenuItem
                      dense
                      disabled={!canPayPartial}
                      onClick={handleOpenPartialPayment}
                      sx={styles.menuItem}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Iconify icon="solar:wallet-money-bold-duotone" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pay partial amount"
                        secondary={canPayPartial ? undefined : 'Enroll in this program first'}
                        slotProps={{
                          primary: { typography: 'body2' },
                          secondary: { typography: 'caption' },
                        }}
                      />
                    </MenuItem>

                    <MenuItem
                      dense
                      disabled={!enrollmentRecord}
                      onClick={handleOpenPaymentHistory}
                      sx={styles.menuItem}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Iconify icon="solar:bill-list-bold-duotone" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="View payment history"
                        secondary={enrollmentRecord ? undefined : 'Enroll in this program first'}
                        slotProps={{
                          primary: { typography: 'body2' },
                          secondary: { typography: 'caption' },
                        }}
                      />
                    </MenuItem>

                    <MenuItem dense onClick={handleManageProgram} sx={styles.menuItem}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Iconify icon="solar:eye-bold-duotone" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="View program"
                        slotProps={{ primary: { typography: 'body2' } }}
                      />
                    </MenuItem>
                  </Menu>

                  <EnrollmentPartialPaymentDialog
                    open={partialPaymentOpen}
                    program={program}
                    enrollment={enrollmentRecord}
                    onClose={() => setPartialPaymentOpen(false)}
                    onSuccess={handlePartialPaymentSuccess}
                  />

                  <EnrollmentPaymentHistoryDialog
                    open={historyOpen}
                    enrollment={enrollmentRecord}
                    programTitle={program.title}
                    onClose={() => setHistoryOpen(false)}
                  />
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
