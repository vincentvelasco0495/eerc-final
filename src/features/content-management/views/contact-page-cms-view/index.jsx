import { useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { paths } from 'src/routes/paths';

import { CONTACT_PAGE_DEFAULTS } from 'src/features/contact-page/data/contact-page-defaults';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useContactPageAdmin, adminDataToFormSections } from '../../hooks/use-contact-page-admin';
import {
  ContactDetailsEditor,
  ContactFeedbackEditor,
  ContactRepresentativeEditor,
} from './contact-page-cms-form';

const ACCORDIONS = [
  { key: 'details', title: 'Contact details & map', Editor: ContactDetailsEditor },
  { key: 'feedback', title: 'Feedback form', Editor: ContactFeedbackEditor },
  { key: 'representative', title: 'Sidebar contact card', Editor: ContactRepresentativeEditor },
];

function buildDefaultFormValues(sections) {
  const base = CONTACT_PAGE_DEFAULTS.sections;
  const merged = {};

  Object.keys(base).forEach((key) => {
    merged[key] = {
      status: 'published',
      ...base[key],
      ...(sections[key] ?? {}),
    };
  });

  return { sections: merged };
}

export function ContactPageCmsView() {
  const { hasApi, isLoading, isSaving, saveAllSections, publishAll, query } = useContactPageAdmin();

  const methods = useForm({
    defaultValues: buildDefaultFormValues(CONTACT_PAGE_DEFAULTS.sections),
  });

  const { reset, handleSubmit, formState } = methods;
  const { isDirty } = formState;

  useEffect(() => {
    if (!query.data) {
      return;
    }
    reset(buildDefaultFormValues(adminDataToFormSections(query.data)));
  }, [query.data, query.dataUpdatedAt, reset]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!isDirty) {
        return;
      }
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const onSave = handleSubmit(async (values) => {
    try {
      await saveAllSections(values.sections);
      reset(values);
    } catch (e) {
      toast.error(e?.response?.data?.message ?? e?.message ?? 'Save failed.');
    }
  });

  const onPublishAll = useCallback(async () => {
    try {
      await publishAll();
    } catch {
      /* toast in hook */
    }
  }, [publishAll]);

  if (!hasApi) {
    return (
      <InstructorWorkspaceShell>
        <Alert severity="warning">
          Set <code>VITE_SERVER_URL</code> to your Laravel API to manage Contact page content.
        </Alert>
      </InstructorWorkspaceShell>
    );
  }

  return (
    <InstructorWorkspaceShell>
      <FormProvider {...methods}>
        <Stack spacing={3} sx={{ pb: 12 }}>
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edit addresses, map embed, feedback copy, and sidebar card. Changes apply to the public page at{' '}
              <strong>{paths.contact}</strong>.
            </Typography>
          </Stack>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2}>
              {ACCORDIONS.map(({ key, title, Editor }) => (
                <Accordion
                  key={key}
                  defaultExpanded={key === 'details'}
                  disableGutters
                  elevation={0}
                  sx={{ '&:before': { display: 'none' } }}
                >
                  <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-linear" />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Editor />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </Stack>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: { xs: 0, lg: 280 },
            right: 0,
            zIndex: 10,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            px: { xs: 2, md: 4 },
            py: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Typography variant="body2" color={isDirty ? 'warning.main' : 'text.secondary'}>
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent="flex-end">
              <Button
                variant="outlined"
                component="a"
                href={`${paths.contact}?preview=1`}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<Iconify icon="solar:eye-bold" />}
              >
                Preview
              </Button>
              <Button variant="outlined" disabled={isSaving} onClick={onPublishAll}>
                Publish all
              </Button>
              <Button variant="contained" disabled={isSaving || !isDirty} onClick={onSave}>
                {isSaving ? 'Saving…' : 'Save changes'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </FormProvider>
    </InstructorWorkspaceShell>
  );
}

export default ContactPageCmsView;
