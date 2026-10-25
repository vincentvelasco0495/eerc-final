import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';

import { formatPesoAmount } from 'src/config/enrollment-payment';
import { learnerDetailsFromRow } from 'src/features/enrollment/utils/enrollment-rows';
import {
  programAmountTargets,
  enrollmentHasUnreviewedPayments,
} from 'src/features/enrollment/utils/enrollment-payments';
import {
  shortLearningModeLabel,
  learnerGroupLearningModeLabel,
} from 'src/features/enrollment/utils/enrollment-learning-mode';

import { Iconify } from 'src/components/iconify';

import { EnrollmentRowActions } from './enrollment-row-actions';
import { EnrollmentRejectDialog } from './enrollment-reject-dialog';
import { EnrollmentAmountDueDialog } from './enrollment-amount-due-dialog';
import { EnrollmentApplicationDialog } from './enrollment-application-dialog';
import { EnrollmentLearnerDetailsDialog } from './enrollment-learner-details-dialog';
import { EnrollmentPaymentHistoryDialog } from './enrollment-payment-history-dialog';
import { EnrollmentSwitchLearningModeDialog } from './enrollment-switch-learning-mode-dialog';

const SKELETON_ROWS = 5;

const mobileCardSx = {
  p: 1.5,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1.5,
};

function findEnrollmentById(rows, enrollmentId) {
  if (!enrollmentId) {
    return null;
  }
  for (const row of rows) {
    if (row?.isLearnerGroup && Array.isArray(row.enrollments)) {
      const match = row.enrollments.find((item) => item.id === enrollmentId);
      if (match) {
        return match;
      }
    } else if (row?.id === enrollmentId) {
      return row;
    }
  }
  return null;
}

const STATUS_COLOR = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  hold: 'info',
  mixed: 'default',
};

function enrollmentChildKindLabel(row) {
  if (row.courseTitle) {
    return row.requestKind === 'course_access'
      ? `Course access · ${row.courseTitle}`
      : `Course · ${row.courseTitle}`;
  }
  return 'Program application';
}

function StatusChips({ row }) {
  if (row?.status === 'mixed' && Array.isArray(row.statusSummary) && row.statusSummary.length > 0) {
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        {row.statusSummary.map((item) => (
          <Chip
            key={item.status}
            label={`${item.count} ${item.status}`}
            size="small"
            color={STATUS_COLOR[item.status] ?? 'default'}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Chip label={row.status} size="small" color={STATUS_COLOR[row.status] ?? 'default'} />
  );
}

function LearnerNameButton({ name, onClick }) {
  if (!onClick) {
    return (
      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
        {name || '—'}
      </Typography>
    );
  }

  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      sx={{
        p: 0,
        minWidth: 0,
        maxWidth: 1,
        justifyContent: 'flex-start',
        textTransform: 'none',
        fontWeight: 600,
        color: 'brand.accentText',
        whiteSpace: 'normal',
        textAlign: 'left',
        overflowWrap: 'anywhere',
        '&:hover': { textDecoration: 'underline', background: 'transparent' },
      }}
    >
      {name || '—'}
    </Button>
  );
}

function EnrollmentLearningModeCell({ row, canManage, isBusy, onSwitchLearningMode, wrap = false }) {
  const shortLabel = shortLearningModeLabel(row?.learningModeId, row?.learningModeName);
  const fullName = String(row?.learningModeName ?? '').trim();

  return (
    <Stack spacing={0.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
      <Typography
        variant="body2"
        title={fullName || undefined}
        noWrap={!wrap}
        sx={wrap ? { overflowWrap: 'anywhere' } : undefined}
      >
        {shortLabel}
      </Typography>
      {canManage ? (
        <Button
          size="small"
          variant="text"
          disabled={isBusy}
          onClick={() => onSwitchLearningMode?.(row)}
          sx={{ px: 0.5, minWidth: 0, textTransform: 'none', whiteSpace: 'nowrap' }}
        >
          Switch
        </Button>
      ) : null}
    </Stack>
  );
}

function rowHighlightSx(row) {
  if (!enrollmentHasUnreviewedPayments(row)) {
    return undefined;
  }
  return {
    bgcolor: (theme) => `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`,
    boxShadow: (theme) => `inset 3px 0 0 ${theme.vars.palette.warning.main}`,
  };
}

function EnrollmentMobileCard({
  row,
  showActions,
  canManage,
  busyId,
  onStatusChange,
  onView,
  onReject,
  onPaymentHistory,
  onLearnerView,
  onSwitchLearningMode,
  onSetAmount,
  isChild = false,
}) {
  const isBusy = busyId === row.id;

  return (
    <Box
      sx={{
        ...mobileCardSx,
        ...rowHighlightSx(row),
        ...(isChild ? { bgcolor: 'action.hover', ml: 1.5 } : null),
      }}
    >
      <Stack spacing={1}>
        {isChild ? (
          <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            {enrollmentChildKindLabel(row)}
          </Typography>
        ) : (
          <Box>
            <LearnerNameButton name={row.userName} onClick={() => onLearnerView?.(row)} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflowWrap: 'anywhere' }}>
              {row.userEmail || '—'}
            </Typography>
          </Box>
        )}
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
          {row.programTitle || row.programId || '—'}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          useFlexGap
        >
          <EnrollmentLearningModeCell
            row={row}
            canManage={canManage}
            isBusy={isBusy}
            onSwitchLearningMode={onSwitchLearningMode}
            wrap
          />
          <StatusChips row={row} />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Submitted {row.submittedAt || '—'}
        </Typography>
        {showActions ? (
          <EnrollmentRowActions
            row={row}
            canManage={canManage}
            isBusy={isBusy}
            compact
            onStatusChange={onStatusChange}
            onView={onView}
            onReject={onReject}
            onPaymentHistory={onPaymentHistory}
            onSetAmount={!isChild && programAmountTargets(row).length > 0 ? onSetAmount : undefined}
          />
        ) : null}
      </Stack>
    </Box>
  );
}

function EnrollmentDataRow({
  row,
  showActions,
  canManage,
  busyId,
  onStatusChange,
  onView,
  onReject,
  onPaymentHistory,
  onLearnerView,
  onSwitchLearningMode,
  onSetAmount,
  isChild = false,
  compact = false,
}) {
  const isBusy = busyId === row.id;

  if (compact) {
    return (
      <EnrollmentMobileCard
        row={row}
        showActions={showActions}
        canManage={canManage}
        busyId={busyId}
        onStatusChange={onStatusChange}
        onView={onView}
        onReject={onReject}
        onPaymentHistory={onPaymentHistory}
        onLearnerView={onLearnerView}
        onSwitchLearningMode={onSwitchLearningMode}
        onSetAmount={onSetAmount}
        isChild={isChild}
      />
    );
  }

  if (isChild) {
    return (
      <TableRow
        hover
        sx={{
          bgcolor: 'action.hover',
          ...rowHighlightSx(row),
        }}
      >
        <TableCell sx={{ pl: 5 }}>
          <Typography variant="caption" color="text.secondary">
            {enrollmentChildKindLabel(row)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{row.programTitle || row.programId || '—'}</Typography>
        </TableCell>
        <TableCell>
          <EnrollmentLearningModeCell
            row={row}
            canManage={canManage}
            isBusy={isBusy}
            onSwitchLearningMode={onSwitchLearningMode}
          />
        </TableCell>
        <TableCell>{row.submittedAt || '—'}</TableCell>
        <TableCell>
          <StatusChips row={row} />
        </TableCell>
        {showActions ? (
          <TableCell align="right">
            <EnrollmentRowActions
              row={row}
              canManage={canManage}
              isBusy={isBusy}
              onStatusChange={onStatusChange}
              onView={onView}
              onReject={onReject}
              onPaymentHistory={onPaymentHistory}
            />
          </TableCell>
        ) : null}
      </TableRow>
    );
  }

  return (
    <TableRow hover sx={rowHighlightSx(row)}>
      <TableCell>
        <LearnerNameButton name={row.userName} onClick={() => onLearnerView?.(row)} />
      </TableCell>
      <TableCell>{row.userEmail || '—'}</TableCell>
      <TableCell>{row.programTitle || row.programId || '—'}</TableCell>
      <TableCell>
        <EnrollmentLearningModeCell
          row={row}
          canManage={canManage}
          isBusy={isBusy}
          onSwitchLearningMode={onSwitchLearningMode}
        />
      </TableCell>
      <TableCell>{row.submittedAt || '—'}</TableCell>
      <TableCell>
        <StatusChips row={row} />
      </TableCell>
      {showActions ? (
        <TableCell align="right">
          <EnrollmentRowActions
            row={row}
            canManage={canManage}
            isBusy={isBusy}
            onStatusChange={onStatusChange}
            onView={onView}
            onReject={onReject}
            onPaymentHistory={onPaymentHistory}
            onSetAmount={programAmountTargets(row).length > 0 ? onSetAmount : undefined}
          />
        </TableCell>
      ) : null}
    </TableRow>
  );
}

function amountDueCaption(row) {
  return programAmountTargets(row)
    .filter((item) => item.amountDue != null)
    .map((item) => `${item.programTitle}: ${formatPesoAmount(item.amountDue)}`)
    .join(' · ');
}

function LearnerGroupRow({
  row,
  expanded,
  onToggle,
  showActions,
  canManage,
  busyId,
  onStatusChange,
  onView,
  onReject,
  onPaymentHistory,
  onLearnerView,
  onSwitchLearningMode,
  onSetAmount,
  compact = false,
}) {
  const childEnrollments = Array.isArray(row.enrollments) ? row.enrollments : [];
  const dueCaption = amountDueCaption(row);
  const childRows = expanded
    ? childEnrollments.map((child) => (
        <EnrollmentDataRow
          key={child.id}
          row={child}
          showActions={showActions}
          canManage={canManage}
          busyId={busyId}
          onStatusChange={onStatusChange}
          onView={onView}
          onReject={onReject}
          onPaymentHistory={onPaymentHistory}
          onSwitchLearningMode={onSwitchLearningMode}
          compact={compact}
          isChild
        />
      ))
    : null;

  if (compact) {
    return (
      <Stack spacing={1}>
        <Box sx={{ ...mobileCardSx, ...rowHighlightSx(row) }}>
          <Stack direction="row" alignItems="flex-start" spacing={0.5}>
            <IconButton size="small" onClick={onToggle} aria-label="Toggle program applications">
              <Iconify
                icon={expanded ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                width={18}
              />
            </IconButton>
            <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
              <Box>
                <LearnerNameButton name={row.userName} onClick={() => onLearnerView?.(row)} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {row.enrollmentCount} application{row.enrollmentCount === 1 ? '' : 's'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', overflowWrap: 'anywhere' }}
                >
                  {row.userEmail || '—'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                {row.programTitle || '—'}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                useFlexGap
              >
                <Typography variant="body2">{learnerGroupLearningModeLabel(row)}</Typography>
                <StatusChips row={row} />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Submitted {row.submittedAt || '—'}
              </Typography>
              {showActions ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {canManage && programAmountTargets(row).length > 0 ? (
                    <Button size="small" variant="outlined" onClick={() => onSetAmount?.(row)}>
                      Amount due
                    </Button>
                  ) : null}
                  <Button size="small" variant="outlined" onClick={() => onLearnerView?.(row)}>
                    View details
                  </Button>
                </Stack>
              ) : null}
              {dueCaption ? (
                <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                  {dueCaption}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Box>
        {childRows}
      </Stack>
    );
  }

  return (
    <>
      <TableRow hover sx={rowHighlightSx(row)}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton size="small" onClick={onToggle} aria-label="Toggle program applications">
              <Iconify
                icon={expanded ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                width={18}
              />
            </IconButton>
            <Box>
              <LearnerNameButton name={row.userName} onClick={() => onLearnerView?.(row)} />
              <Typography variant="caption" color="text.secondary">
                {row.enrollmentCount} application{row.enrollmentCount === 1 ? '' : 's'}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>{row.userEmail || '—'}</TableCell>
        <TableCell>{row.programTitle || '—'}</TableCell>
        <TableCell>{learnerGroupLearningModeLabel(row)}</TableCell>
        <TableCell>{row.submittedAt || '—'}</TableCell>
        <TableCell>
          <StatusChips row={row} />
        </TableCell>
        {showActions ? (
          <TableCell align="right">
            <Stack spacing={0.75} alignItems="stretch">
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                {canManage && programAmountTargets(row).length > 0 ? (
                  <Button size="small" variant="outlined" onClick={() => onSetAmount?.(row)}>
                    Amount due
                  </Button>
                ) : (
                  <Box />
                )}
                <Button size="small" variant="outlined" onClick={() => onLearnerView?.(row)}>
                  View details
                </Button>
              </Stack>
              {dueCaption ? (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
                  {dueCaption}
                </Typography>
              ) : null}
            </Stack>
          </TableCell>
        ) : null}
      </TableRow>
      {childRows}
    </>
  );
}

export function EnrollmentTable({
  rows = [],
  loading = false,
  canManage = false,
  showActionsColumn = false,
  onStatusChange,
  onLearningModeChange,
  busyId = null,
  emptyMessage = 'No enrollments found',
  onPaymentVerified,
}) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTargetId, setViewTargetId] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);
  const [learnerTarget, setLearnerTarget] = useState(null);
  const [learningModeTarget, setLearningModeTarget] = useState(null);
  const [amountTarget, setAmountTarget] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    if (!historyTarget?.id) {
      return;
    }
    const refreshed = findEnrollmentById(rows, historyTarget.id);
    if (refreshed) {
      setHistoryTarget(refreshed);
    }
  }, [rows, historyTarget?.id]);

  useEffect(() => {
    if (!learnerTarget) {
      return;
    }
    const match = rows.find((row) => {
      const details = learnerDetailsFromRow(row);
      return (
        details?.userEmail === learnerTarget.userEmail &&
        details?.userName === learnerTarget.userName
      );
    });
    if (match) {
      setLearnerTarget(learnerDetailsFromRow(match));
    }
  }, [rows, learnerTarget]);

  const handleView = useCallback((enrollmentId) => {
    setViewTargetId(enrollmentId);
  }, []);

  const handleReject = useCallback((row) => {
    setRejectTarget(row);
  }, []);

  const handlePaymentHistory = useCallback((row) => {
    setHistoryTarget(row);
  }, []);

  const handleLearnerView = useCallback((row) => {
    setLearnerTarget(learnerDetailsFromRow(row));
  }, []);

  const handleSwitchLearningMode = useCallback((row) => {
    setLearningModeTarget(row);
  }, []);

  const handleSetAmount = useCallback((row) => {
    setAmountTarget(row);
  }, []);

  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const showSkeleton = loading && (!Array.isArray(rows) || rows.length === 0);
  const showActions = showActionsColumn || canManage;
  const colSpan = showActions ? 7 : 6;

  const renderedRows =
    !showSkeleton && rows.length > 0
      ? rows.map((row) => {
          if (row?.isLearnerGroup && Array.isArray(row.enrollments) && row.enrollments.length > 1) {
            return (
              <LearnerGroupRow
                key={row.id}
                row={row}
                expanded={Boolean(expandedGroups[row.id])}
                onToggle={() => toggleGroup(row.id)}
                showActions={showActions}
                canManage={canManage}
                busyId={busyId}
                onStatusChange={onStatusChange}
                onView={handleView}
                onReject={handleReject}
                onPaymentHistory={handlePaymentHistory}
                onLearnerView={handleLearnerView}
                onSwitchLearningMode={handleSwitchLearningMode}
                onSetAmount={handleSetAmount}
                compact={isCompact}
              />
            );
          }

          const flatRow =
            row?.isLearnerGroup && Array.isArray(row.enrollments) && row.enrollments.length === 1
              ? row.enrollments[0]
              : row;

          return (
            <EnrollmentDataRow
              key={flatRow.id}
              row={flatRow}
              showActions={showActions}
              canManage={canManage}
              busyId={busyId}
              onStatusChange={onStatusChange}
              onView={handleView}
              onReject={handleReject}
              onPaymentHistory={handlePaymentHistory}
              onLearnerView={handleLearnerView}
              onSwitchLearningMode={handleSwitchLearningMode}
              onSetAmount={handleSetAmount}
              compact={isCompact}
            />
          );
        })
      : null;

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && rows.length > 0 ? (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            borderRadius: 1,
          }}
        />
      ) : null}

      {isCompact ? (
        <Stack
          spacing={1.25}
          sx={{
            opacity: loading && rows.length > 0 ? 0.72 : 1,
            transition: (t) => t.transitions.create('opacity', { duration: 160 }),
          }}
        >
          {showSkeleton
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <Skeleton key={`sk-${i}`} variant="rounded" height={92} animation="wave" />
              ))
            : null}
          {!showSkeleton && !loading && rows.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
              {emptyMessage}
            </Typography>
          ) : null}
          {renderedRows}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table
            size="small"
            sx={{
              tableLayout: 'fixed',
              minWidth: showActions ? 1180 : 860,
              opacity: loading && rows.length > 0 ? 0.72 : 1,
              transition: (t) => t.transitions.create('opacity', { duration: 160 }),
              '& th, & td': { verticalAlign: 'middle' },
              '& td:not(:last-of-type)': { overflowWrap: 'anywhere' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 220 }}>Learner</TableCell>
                <TableCell sx={{ width: 180 }}>Email</TableCell>
                <TableCell sx={{ width: 180 }}>Program</TableCell>
                <TableCell sx={{ width: 150 }}>Mode of learning</TableCell>
                <TableCell sx={{ width: 110 }}>Submitted</TableCell>
                <TableCell sx={{ width: 110 }}>Status</TableCell>
                {showActions ? (
                  <TableCell align="right" sx={{ width: 230 }}>
                    Actions
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {showSkeleton
                ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell colSpan={colSpan} sx={{ py: 1.5 }}>
                        <Skeleton variant="rounded" height={40} animation="wave" />
                      </TableCell>
                    </TableRow>
                  ))
                : null}

              {!showSkeleton && !loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}

              {renderedRows}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <EnrollmentRejectDialog
        open={Boolean(rejectTarget)}
        learnerName={rejectTarget?.userName ?? ''}
        submitting={busyId === rejectTarget?.id}
        onClose={() => {
          if (busyId !== rejectTarget?.id) {
            setRejectTarget(null);
          }
        }}
        onConfirm={(rejectionReason) => {
          if (!rejectTarget) {
            return;
          }
          onStatusChange?.(rejectTarget, 'rejected', rejectionReason);
          setRejectTarget(null);
        }}
      />

      <EnrollmentApplicationDialog
        open={Boolean(viewTargetId)}
        enrollmentId={viewTargetId}
        onClose={() => setViewTargetId(null)}
      />

      <EnrollmentLearnerDetailsDialog
        open={Boolean(learnerTarget)}
        learner={learnerTarget}
        canManage={canManage}
        busyId={busyId}
        onClose={() => setLearnerTarget(null)}
        onView={handleView}
        onReject={handleReject}
        onPaymentHistory={handlePaymentHistory}
        onStatusChange={onStatusChange}
        onSwitchLearningMode={handleSwitchLearningMode}
      />

      <EnrollmentSwitchLearningModeDialog
        open={Boolean(learningModeTarget)}
        row={learningModeTarget}
        submitting={busyId === learningModeTarget?.id}
        onClose={() => {
          if (busyId !== learningModeTarget?.id) {
            setLearningModeTarget(null);
          }
        }}
        onConfirm={(learningMode) => {
          if (!learningModeTarget || !learningMode) {
            return;
          }
          onLearningModeChange?.(learningModeTarget, learningMode);
          setLearningModeTarget(null);
        }}
      />

      <EnrollmentAmountDueDialog
        open={Boolean(amountTarget)}
        row={amountTarget}
        onClose={() => setAmountTarget(null)}
        onSaved={onPaymentVerified}
      />

      <EnrollmentPaymentHistoryDialog
        open={Boolean(historyTarget)}
        enrollment={historyTarget}
        programTitle={historyTarget?.programTitle ?? ''}
        adminMode={canManage}
        onClose={() => setHistoryTarget(null)}
        onVerified={async () => {
          await onPaymentVerified?.();
        }}
      />
    </Box>
  );
}
