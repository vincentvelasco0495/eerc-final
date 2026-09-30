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

import { HOMEPAGE_V2_DEFAULTS } from 'src/features/homepage-v2/data/homepage-v2-defaults';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useHomepageAdmin, adminDataToFormSections } from '../../hooks/use-homepage-admin';
import {
  StatisticsEditor,
  HowItWorksEditor,
  HeroSectionEditor,
  InstructorsEditor,
  FeatureCardsEditor,
  SampleLectureEditor,
  SuccessStoriesEditor,
  FeaturedContentEditor,
} from './homepage-v2-cms-form';

const ACCORDIONS = [
  { key: 'hero', title: 'Hero Section', Editor: HeroSectionEditor },
  { key: 'feature_cards', title: 'Benefits Cards', Editor: FeatureCardsEditor },
  { key: 'instructors', title: 'Instructor Showcase', Editor: InstructorsEditor },
  { key: 'sample_lecture', title: 'Advertise Sample Lecture', Editor: SampleLectureEditor },
  { key: 'stats', title: 'Statistics Banner', Editor: StatisticsEditor },
  { key: 'success_stories', title: 'Success Stories', Editor: SuccessStoriesEditor },
  { key: 'how_it_works', title: 'How It Works', Editor: HowItWorksEditor },
  { key: 'featured_content', title: 'Featured Content', Editor: FeaturedContentEditor },
];

function renameDefaultVideoTitles(item, index) {
  const n = index + 1;
  const announcement = `Announcement ${n}`;
  const isPlaceholder = (value) => /^video\s+\d+$/i.test(String(value ?? '').trim());
  const thumbnail = item?.thumbnail;

  return {
    ...item,
    title: isPlaceholder(item?.title) ? announcement : item?.title,
    thumbnail: thumbnail
      ? {
          ...thumbnail,
          label: isPlaceholder(thumbnail.label) ? announcement : thumbnail.label,
          alt: isPlaceholder(thumbnail.alt) ? announcement : thumbnail.alt,
        }
      : thumbnail,
  };
}

function buildDefaultFormValues(sections) {
  const base = HOMEPAGE_V2_DEFAULTS.sections;
  const merged = {};

  Object.keys(base).forEach((key) => {
    merged[key] = {
      status: 'published',
      ...base[key],
      ...(sections[key] ?? {}),
    };
  });

  if (Array.isArray(merged.featured_content?.items)) {
    merged.featured_content = {
      ...merged.featured_content,
      items: merged.featured_content.items.map(renameDefaultVideoTitles),
    };
  }

  return { sections: merged };
}

export function HomepageV2CmsView() {
  const { hasApi, isLoading, isSaving, saveAllSections, publishAll, query } = useHomepageAdmin();

  const methods = useForm({
    defaultValues: buildDefaultFormValues(HOMEPAGE_V2_DEFAULTS.sections),
  });

  const { reset, handleSubmit, formState } = methods;
  const { isDirty } = formState;

  useEffect(() => {
    if (!query.data || isDirty) {
      return;
    }
    reset(buildDefaultFormValues(adminDataToFormSections(query.data)));
  }, [query.data, query.dataUpdatedAt, reset, isDirty]);

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
          Set <code>VITE_SERVER_URL</code> to your Laravel API to manage homepage content.
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
              Homepage
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edit landing page sections, upload images, and control visibility. Changes apply to the
              public homepage at <strong>/</strong>.
            </Typography>
          </Stack>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2}>
              {ACCORDIONS.map(({ key, title, Editor }) => (
                <Accordion key={key} defaultExpanded={key === 'hero'} disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
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
                href="/?preview=1"
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

export default HomepageV2CmsView;
