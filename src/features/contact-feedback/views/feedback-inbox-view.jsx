import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import { fetchContactFeedbackAdmin } from 'src/features/contact-feedback/api/contact-feedback-api';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { ExportExcelButton } from 'src/components/export-excel-button';
import {
  ServerListPagination,
  ServerListPerPageControl,
  normalizeServerPaginationMeta,
} from 'src/components/server-pagination';

export function FeedbackInboxView() {
  const hasApi = Boolean(CONFIG.serverUrl?.trim());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!hasApi) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchContactFeedbackAdmin({ page, perPage });
      setRows(res.data ?? []);
      setMeta(
        res.meta ?? {
          currentPage: page,
          lastPage: 1,
          perPage,
          total: (res.data ?? []).length,
        }
      );
    } catch (e) {
      setError(e);
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [hasApi, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const resolvedPagination =
    meta && !error ? normalizeServerPaginationMeta(meta, { page, perPage }) : null;

  if (!hasApi) {
    return (
      <InstructorWorkspaceShell>
        <Alert severity="warning">
          Set <code>VITE_SERVER_URL</code> to your Laravel API to load feedback submissions.
        </Alert>
      </InstructorWorkspaceShell>
    );
  }

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Feedback
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Messages submitted from the public Contact page.
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error">
            {error?.response?.data?.message ?? error?.message ?? 'Could not load feedback.'}
          </Alert>
        ) : null}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              flexWrap="wrap"
              columnGap={2}
              rowGap={1}
            >
              <ExportExcelButton
                fileName="contact-feedback"
                sheetName="Feedback"
                headers={['Date', 'Name', 'Email', 'Phone', 'Message']}
                rows={rows}
                mapRow={(row) => [
                  row.createdAt ? fDateTime(row.createdAt) : '',
                  row.name ?? '',
                  row.email ?? '',
                  row.phone ?? '',
                  row.message ?? '',
                ]}
                disabled={loading}
              />
              {resolvedPagination ? (
                <ServerListPerPageControl
                  perPage={perPage}
                  onPerPageChange={(n) => {
                    setPerPage(n);
                    setPage(1);
                  }}
                  disabled={loading}
                  label="Submissions per page"
                />
              ) : null}
            </Stack>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
              <Table size="small" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width={160}>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell width={140}>Phone</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          No submissions yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                          {row.createdAt ? fDateTime(row.createdAt) : '—'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top', fontWeight: 600 }}>{row.name}</TableCell>
                        <TableCell sx={{ verticalAlign: 'top' }}>
                          <Link href={`mailto:${row.email}`} underline="hover">
                            {row.email}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top' }}>{row.phone || '—'}</TableCell>
                        <TableCell
                          sx={{
                            verticalAlign: 'top',
                            maxWidth: 420,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            color: 'text.secondary',
                          }}
                        >
                          {row.message}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {resolvedPagination ? (
              <ServerListPagination
                page={resolvedPagination.currentPage}
                lastPage={resolvedPagination.lastPage}
                total={resolvedPagination.total}
                from={resolvedPagination.from}
                to={resolvedPagination.to}
                onPageChange={setPage}
                disabled={loading}
                singularItemLabel="submission"
                pluralItemLabel="submissions"
              />
            ) : null}
          </>
        )}
      </Stack>
    </InstructorWorkspaceShell>
  );
}
