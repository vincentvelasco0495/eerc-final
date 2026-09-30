import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';

import { learnerDetailsFromRow } from 'src/features/enrollment/utils/enrollment-rows';
import { enrollmentHasUnreviewedPayments } from 'src/features/enrollment/utils/enrollment-payments';

import { Iconify } from 'src/components/iconify';

import { EnrollmentRejectDialog } from './enrollment-reject-dialog';
import { EnrollmentApplicationDialog } from './enrollment-application-dialog';
import { EnrollmentLearnerDetailsDialog } from './enrollment-learner-details-dialog';
import { EnrollmentPaymentHistoryDialog } from './enrollment-payment-history-dialog';

const SKELETON_ROWS = 5;

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
    return <Typography variant="body2">{name || '—'}</Typography>;
  }

  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      sx={{
        p: 0,
        minWidth: 0,
        justifyContent: 'flex-start',
        textTransform: 'none',
        fontWeight: 600,
        color: 'brand.accentText',
        '&:hover': { textDecoration: 'underline', background: 'transparent' },
      }}
    >
      {name || '—'}
    </Button>
  );
}

function EnrollmentActions({
  row,
  canManage,
  isBusy,
  onStatusChange,
  onView,
  onReject,
  onPaymentHistory,
}) {
  const isApproved = row.status === 'approved';
  const isRejected = row.status === 'rejected';
  const isHold = row.status === 'hold';

  if (!canManage) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
      <Button size="small" variant="outlined" disabled={isBusy} onClick={() => onView(row.id)}>
        View
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isBusy}
        onClick={() => onPaymentHistory?.(row)}
      >
        Payment history
      </Button>
      <Button
        size="small"
        variant="contained"
        color="success"
        disabled={isBusy || isApproved}
        onClick={() => onStatusChange?.(row, 'approved')}
      >
        Approve
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="warning"
        disabled={isBusy || isHold || isRejected}
        onClick={() => onStatusChange?.(row, 'hold')}
      >
        Hold
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        disabled={isBusy || isRejected}
        onClick={() => onReject(row)}
      >
        Reject
      </Button>
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
  isChild = false,
}) {
  const isBusy = busyId === row.id;

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
            Program application
          </Typography>
        </TableCell>
        <TableCell />
        <TableCell>{row.programTitle || row.programId || '—'}</TableCell>
        <TableCell>{row.submittedAt || '—'}</TableCell>
        <TableCell>
          <StatusChips row={row} />
        </TableCell>
        {showActions ? (
          <TableCell align="right">
            <EnrollmentActions
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
      <TableCell>{row.submittedAt || '—'}</TableCell>
      <TableCell>
        <StatusChips row={row} />
      </TableCell>
      {showActions ? (
        <TableCell align="right">
          <EnrollmentActions
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
  colSpan,
}) {
  const childEnrollments = Array.isArray(row.enrollments) ? row.enrollments : [];

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
                {row.enrollmentCount} program{row.enrollmentCount === 1 ? '' : 's'}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>{row.userEmail || '—'}</TableCell>
        <TableCell>{row.programTitle || '—'}</TableCell>
        <TableCell>{row.submittedAt || '—'}</TableCell>
        <TableCell>
          <StatusChips row={row} />
        </TableCell>
        {showActions ? (
          <TableCell align="right">
            <Button size="small" variant="outlined" onClick={() => onLearnerView?.(row)}>
              View details
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell colSpan={colSpan} sx={{ py: 0, borderBottom: expanded ? undefined : 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ py: 1 }}>
              <Table size="small">
                <TableBody>
                  {childEnrollments.map((child) => (
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
                      isChild
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function EnrollmentTable({
  rows = [],
  loading = false,
  canManage = false,
  showActionsColumn = false,
  onStatusChange,
  busyId = null,
  emptyMessage = 'No enrollments found',
  onPaymentVerified,
}) {
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTargetId, setViewTargetId] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);
  const [learnerTarget, setLearnerTarget] = useState(null);
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

  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const showSkeleton = loading && (!Array.isArray(rows) || rows.length === 0);
  const showActions = showActionsColumn || canManage;
  const colSpan = showActions ? 6 : 5;

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
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          sx={{
            minWidth: showActions ? 920 : 680,
            opacity: loading && rows.length > 0 ? 0.72 : 1,
            transition: (theme) => theme.transitions.create('opacity', { duration: 160 }),
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Learner</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              {showActions ? <TableCell align="right">Actions</TableCell> : null}
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

            {!showSkeleton && rows.length > 0
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
                        colSpan={colSpan}
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
                    />
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>

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
