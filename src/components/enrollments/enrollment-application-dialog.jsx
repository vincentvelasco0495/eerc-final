import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import {
  ENROLLMENT_WIZARD_STEPS,
  ENROLLMENT_FIELD_LABELS,
} from 'src/features/enrollment/enrollment-wizard/constants';
import {
  fetchEnrollmentApplication,
  fetchEnrollmentDocumentBlob,
  fetchEnrollmentPaymentProofBlob,
} from 'src/redux/api/lmsApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const DOCUMENT_LABELS = {
  profilePicture: 'Profile picture',
  discountProof: 'Discount proof',
  retakerProof: 'Retaker proof',
  paymentProof: 'Payment proof',
  signature: 'Signature',
};

const APPLICATION_SECTIONS = [
  {
    title: ENROLLMENT_WIZARD_STEPS[0],
    fields: ['batchEnrollId', 'learningModeId', 'branchEnrollId', 'reviewScheduleId'],
  },
  {
    title: ENROLLMENT_WIZARD_STEPS[1],
    fields: ['fullName', 'aliasName', 'schoolName', 'gender', 'dateOfBirth', 'contactNumber', 'homeAddress'],
  },
  {
    title: ENROLLMENT_WIZARD_STEPS[2],
    fields: ['honorAwardDiscountId'],
    documents: ['profilePicture', 'discountProof'],
  },
  {
    title: ENROLLMENT_WIZARD_STEPS[3],
    fields: ['examExperience', 'retakerAttempts', 'downpaymentAmount'],
    documents: ['retakerProof', 'paymentProof'],
  },
  {
    title: ENROLLMENT_WIZARD_STEPS[4],
    fields: ['packageEnrollId'],
    documents: ['signature'],
  },
];

const LABEL_KEY_BY_FIELD = {
  batchEnrollId: 'batchEnroll',
  learningModeId: 'learningMode',
  branchEnrollId: 'branchEnroll',
  reviewScheduleId: 'reviewSchedule',
  honorAwardDiscountId: 'honorAwardDiscount',
  packageEnrollId: 'packageEnroll',
};

function resolveOptionLabel(field, formData) {
  const labelKey = LABEL_KEY_BY_FIELD[field];
  if (labelKey && formData?.labels?.[labelKey]) {
    return formData.labels[labelKey];
  }
  return null;
}

function formatFieldValue(field, value, formData) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const optionLabel = resolveOptionLabel(field, formData);
  if (optionLabel) {
    return optionLabel;
  }

  if (field === 'gender') {
    if (value === 'female') return 'Female';
    if (value === 'male') return 'Male';
  }

  if (field === 'dateOfBirth') {
    return fDate(value) || String(value);
  }

  if (field === 'examExperience') {
    if (value === 'retaker') return 'Retaker';
    if (value === 'first-time') return 'First-time taker';
  }

  if (field === 'confirmTerms') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

function resolveFileMeta(name, mime) {
  const type = mime || '';
  const lowerName = name?.toLowerCase() || '';

  if (type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(lowerName)) {
    return { icon: 'solar:gallery-bold-duotone', kind: 'Image' };
  }
  if (type === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return { icon: 'solar:document-text-bold-duotone', kind: 'PDF' };
  }
  if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
    return { icon: 'solar:document-bold-duotone', kind: 'Document' };
  }

  return { icon: 'solar:file-bold-duotone', kind: 'File' };
}

async function openBlobInNewTab(blob) {
  const blobUrl = URL.createObjectURL(blob);
  const popup = window.open(blobUrl, '_blank', 'noopener,noreferrer');

  if (!popup) {
    URL.revokeObjectURL(blobUrl);
    throw new Error('Could not open a new tab. Check your popup blocker.');
  }

  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
}

function downloadBlob(blob, fileName) {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = fileName || 'download';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
}

function DocumentAttachmentRow({ label, fileName, mime, busy, onView, onDownload }) {
  const { icon, kind } = resolveFileMeta(fileName, mime);

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.neutral',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            bgcolor: 'background.paper',
            color: 'brand.accentText',
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={fileName}
          >
            {fileName}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {kind}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} flexShrink={0}>
          <Button size="small" variant="outlined" disabled={busy} onClick={onView}>
            {busy ? 'Opening…' : 'View'}
          </Button>
          <Button size="small" variant="text" disabled={busy} onClick={onDownload}>
            Download
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function SummaryRow({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

function ApplicationSection({ title, children }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Stack spacing={1.25}>{children}</Stack>
    </Box>
  );
}

export function EnrollmentApplicationDialog({ open, enrollmentId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  const [fileBusyKey, setFileBusyKey] = useState(null);

  const fetchFileBlob = useCallback(
    async (fileKey, fetcher) => {
      if (!enrollmentId) {
        return null;
      }

      setFileBusyKey(fileKey);
      try {
        return await fetcher();
      } catch (err) {
        const message =
          typeof err === 'string' ? err : err?.message ?? 'Could not load the file.';
        toast.error(message);
        return null;
      } finally {
        setFileBusyKey(null);
      }
    },
    [enrollmentId]
  );

  const handleViewDocument = useCallback(
    async (docKey) => {
      const blob = await fetchFileBlob(`doc:${docKey}`, () =>
        fetchEnrollmentDocumentBlob(enrollmentId, docKey)
      );
      if (blob) {
        try {
          await openBlobInNewTab(blob);
        } catch (err) {
          const message =
            typeof err === 'string' ? err : err?.message ?? 'Could not open the file.';
          toast.error(message);
        }
      }
    },
    [enrollmentId, fetchFileBlob]
  );

  const handleDownloadDocument = useCallback(
    async (docKey, fileName) => {
      const blob = await fetchFileBlob(`doc:${docKey}`, () =>
        fetchEnrollmentDocumentBlob(enrollmentId, docKey)
      );
      if (blob) {
        downloadBlob(blob, fileName);
      }
    },
    [enrollmentId, fetchFileBlob]
  );

  const handleViewPaymentProof = useCallback(async () => {
    const blob = await fetchFileBlob('payment-proof', () =>
      fetchEnrollmentPaymentProofBlob(enrollmentId)
    );
    if (blob) {
      try {
        await openBlobInNewTab(blob);
      } catch (err) {
        const message =
          typeof err === 'string' ? err : err?.message ?? 'Could not open the file.';
        toast.error(message);
      }
    }
  }, [enrollmentId, fetchFileBlob]);

  const handleDownloadPaymentProof = useCallback(
    async (fileName) => {
      const blob = await fetchFileBlob('payment-proof', () =>
        fetchEnrollmentPaymentProofBlob(enrollmentId)
      );
      if (blob) {
        downloadBlob(blob, fileName);
      }
    },
    [enrollmentId, fetchFileBlob]
  );

  useEffect(() => {
    if (!open || !enrollmentId) {
      setApplication(null);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const payload = await fetchEnrollmentApplication(enrollmentId);
        if (!cancelled) {
          setApplication(payload);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            typeof err === 'string' ? err : err?.message ?? 'Could not load enrollment application.';
          setError(message);
          setApplication(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, enrollmentId]);

  const formData = application?.formData ?? null;
  const documents = application?.documents ?? {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Enrollment application</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        ) : null}

        {!loading && error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : null}

        {!loading && !error && application ? (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="subtitle1">{application.userName || 'Learner'}</Typography>
              <Chip size="small" label={application.status} />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {application.programTitle}
                {application.courseTitle ? ` · ${application.courseTitle}` : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Submitted {application.submittedAt || '—'}
                {application.userEmail ? ` · ${application.userEmail}` : ''}
              </Typography>
            </Stack>

            {application.rejectionReason ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: (theme) => `rgb(${theme.vars.palette.error.mainChannel} / 0.16)`,
                  border: '1px solid',
                  borderColor: (theme) => `rgb(${theme.vars.palette.error.mainChannel} / 0.4)`,
                }}
              >
                <Typography variant="subtitle2" color="error.light">
                  Rejection reason
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                  {application.rejectionReason}
                </Typography>
              </Box>
            ) : null}

            {!application.hasFormData ? (
              <Typography variant="body2" color="text.secondary">
                No wizard application data was stored for this enrollment. It may be a legacy
                payment-only submission.
              </Typography>
            ) : (
              APPLICATION_SECTIONS.map((section) => {
                const fieldRows = section.fields
                  .filter((field) => {
                    if (field === 'retakerAttempts' && formData?.examExperience !== 'retaker') {
                      return false;
                    }
                    return true;
                  })
                  .map((field) => (
                    <SummaryRow
                      key={field}
                      label={ENROLLMENT_FIELD_LABELS[field] ?? field}
                      value={formatFieldValue(field, formData?.[field], formData)}
                    />
                  ));

                const documentRows = (section.documents ?? []).map((docKey) => {
                  const doc = documents?.[docKey];
                  const fileName = doc?.originalName;

                  if (!fileName) {
                    return (
                      <SummaryRow key={docKey} label={DOCUMENT_LABELS[docKey] ?? docKey} value="—" />
                    );
                  }

                  return (
                    <DocumentAttachmentRow
                      key={docKey}
                      label={DOCUMENT_LABELS[docKey] ?? docKey}
                      fileName={fileName}
                      mime={doc?.mime}
                      busy={fileBusyKey === `doc:${docKey}`}
                      onView={() => handleViewDocument(docKey)}
                      onDownload={() => handleDownloadDocument(docKey, fileName)}
                    />
                  );
                });

                if (!fieldRows.length && !documentRows.length) {
                  return null;
                }

                return (
                  <ApplicationSection key={section.title} title={section.title}>
                    {fieldRows}
                    {documentRows}
                  </ApplicationSection>
                );
              })
            )}

            {application.hasPaymentProof && !documents?.paymentProof?.originalName ? (
              <>
                <Divider />
                {application.paymentProofFileName ? (
                  <DocumentAttachmentRow
                    label="Legacy payment proof"
                    fileName={application.paymentProofFileName}
                    mime={null}
                    busy={fileBusyKey === 'payment-proof'}
                    onView={handleViewPaymentProof}
                    onDownload={() => handleDownloadPaymentProof(application.paymentProofFileName)}
                  />
                ) : (
                  <SummaryRow label="Legacy payment proof" value="Uploaded" />
                )}
              </>
            ) : null}
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
