import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useLmsActions, useLmsPrograms } from 'src/hooks/use-lms';

import { toast } from 'src/components/snackbar';

import { css } from './styles';
import { CourseInfoSection } from './course-info-section';
import { paragraphsToHtml, htmlToParagraphTexts } from '../../utils/course-marketing-html';
import {
  curriculumBuilderCourse,
  courseMainDescriptionSeedHtml,
} from '../../instructor-course-curriculum-data';

function parseHoursLabel(label) {
  const n = Number.parseInt(String(label ?? '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Navbar “Course” tab — offline demo sandbox, or live LMS authoring when `tiedCourse` is set.
 * When `onEnsureCourse` is passed without `tiedCourse.id`, Save creates the catalog row then PATCHes it.
 */
export function CourseSettingsWorkspace({
  tiedCourse = null,
  onSaved,
  /** When set and there is no course id yet, Save calls this first (must return LMS `public_id`). */
  onEnsureCourse,
} = {}) {
  const hasCourseRow = tiedCourse?.id != null;
  const canPersistToLms = hasCourseRow || typeof onEnsureCourse === 'function';
  const { programs } = useLmsPrograms();
  const { runCommand } = useLmsActions();

  const [courseName, setCourseName] = useState(curriculumBuilderCourse.title);
  const [slug, setSlug] = useState('how-to-design-components-right');
  const [programId, setProgramId] = useState('program-ce');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerMediaId, setBannerMediaId] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');
  const [courseDuration, setCourseDuration] = useState('9 hours');
  const [videoDuration, setVideoDuration] = useState('5 hours');
  const [descriptionHtml, setDescriptionHtml] = useState(
    canPersistToLms ? '' : courseMainDescriptionSeedHtml
  );
  const [lockLessonsInOrder, setLockLessonsInOrder] = useState(false);

  const [saveBusy, setSaveBusy] = useState(false);

  const baseUrlPrefix = curriculumBuilderCourse.baseUrlSlugPrefix ?? '';

  const programOptions = useMemo(() => {
    const list = Array.isArray(programs) ? programs : [];
    const active = list.filter((p) => String(p?.status ?? '').toLowerCase() === 'active');
    const opts = active.map((p) => ({
      id: p.id,
      label: String(p.title ?? p.code ?? p.id),
    }));

    // If the currently selected program is inactive/missing, include it as disabled to avoid blank UI.
    const selected = list.find((p) => String(p?.id) === String(programId));
    if (selected && String(selected?.status ?? '').toLowerCase() !== 'active') {
      opts.unshift({
        id: selected.id,
        label: `${String(selected.title ?? selected.code ?? selected.id)} (inactive)`,
        disabled: true,
      });
    }

    return opts.length ? opts : [{ id: programId, label: programId, disabled: true }];
  }, [programId, programs]);

  useEffect(() => {
    if (hasCourseRow) {
      return;
    }
    setCourseName(curriculumBuilderCourse.title);
    setSlug(curriculumBuilderCourse.defaultSlug ?? 'how-to-design-components-right');
    setProgramId(curriculumBuilderCourse.defaultProgramId ?? 'program-ce');
    setBannerUrl('');
    setBannerMediaId('');
    setBannerImageFile(null);
    setBannerPreviewUrl('');
    setCourseDuration('9 hours');
    setVideoDuration('5 hours');
    setDescriptionHtml(canPersistToLms ? '' : courseMainDescriptionSeedHtml);
    setLockLessonsInOrder(false);
  }, [canPersistToLms, hasCourseRow]);

  useEffect(() => {
    if (!tiedCourse) {
      return;
    }
    const m = tiedCourse.marketing ?? {};
    const descriptionParagraphs = Array.isArray(m.description)
      ? m.description
      : Array.isArray(m.paragraphs)
        ? m.paragraphs
        : [];

    setCourseName(String(tiedCourse.title ?? '').trim() || curriculumBuilderCourse.title);
    setSlug(String(tiedCourse.slug ?? '').trim());
    setProgramId(String(tiedCourse.programId ?? '').trim());
    setBannerUrl(typeof m.bannerImageUrl === 'string' ? m.bannerImageUrl.trim() : '');
    setBannerMediaId(typeof m.bannerImageMediaId === 'string' ? m.bannerImageMediaId.trim() : '');
    setBannerImageFile(null);
    setBannerPreviewUrl('');
    setCourseDuration(`${Number.isFinite(Number(tiedCourse.hours)) ? tiedCourse.hours : 0} hours`);
    setVideoDuration(
      typeof tiedCourse.videoHoursLabel === 'string' ? tiedCourse.videoHoursLabel.trim() : ''
    );
    const descFallback = paragraphsToHtml(descriptionParagraphs);
    const fromDesc = paragraphsToHtml(
      [typeof tiedCourse.description === 'string' ? tiedCourse.description.trim() : ''].filter(Boolean)
    );
    setDescriptionHtml(descFallback || fromDesc || '');
    setLockLessonsInOrder(Boolean(m.lockLessonsInOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed when switching authoring target only
  }, [tiedCourse?.id]);

  const handlePersistLmsSettings = useCallback(async () => {
    let courseId = tiedCourse?.id;
    if (!courseId && typeof onEnsureCourse === 'function') {
      try {
        courseId = await onEnsureCourse({
          title: courseName.trim(),
          programId: programId.trim(),
        });
      } catch {
        return;
      }
    }
    if (!courseId) {
      return;
    }
    try {
      setSaveBusy(true);
      const description = htmlToParagraphTexts(descriptionHtml);

      const marketingPayload = {
        ...(description.length ? { description } : {}),
        bannerImageUrl: bannerUrl.trim() === '' ? null : bannerUrl.trim(),
        lockLessonsInOrder,
      };

      if (bannerImageFile) {
        const formData = new FormData();
        formData.append('title', courseName.trim());
        formData.append('slug', slug.trim());
        formData.append('programId', programId || '');
        formData.append('hours', String(parseHoursLabel(courseDuration)));
        formData.append('videoHoursLabel', videoDuration.trim() === '' ? '' : videoDuration.trim());
        formData.append('marketingPayload', JSON.stringify(marketingPayload));
        formData.append('bannerImage', bannerImageFile);
        const json = await runCommand('course.update', {
          publicId: courseId,
          body: formData,
        });
        onSaved?.(json?.data);
      } else {
        const json = await runCommand('course.update', {
          publicId: courseId,
          body: {
          title: courseName.trim(),
          slug: slug.trim(),
          programId: programId || null,
          hours: parseHoursLabel(courseDuration),
          videoHoursLabel: videoDuration.trim() === '' ? null : videoDuration.trim(),
          marketing: marketingPayload,
          },
        });
        onSaved?.(json?.data);
      }
      toast.success('Course saved.');
      setBannerImageFile(null);
    } catch (e) {
      toast.error(e?.message ?? 'Save failed.');
    } finally {
      setSaveBusy(false);
    }
  }, [
    tiedCourse?.id,
    onEnsureCourse,
    runCommand,
    bannerImageFile,
    bannerUrl,
    courseDuration,
    courseName,
    descriptionHtml,
    lockLessonsInOrder,
    programId,
    slug,
    videoDuration,
    onSaved,
  ]);

  return (
    <Box sx={css.workspaceRoot}>
      <Box sx={css.pageCard}>
        <CourseInfoSection
          courseName={courseName}
          onCourseNameChange={setCourseName}
          slug={slug}
          slugReadOnly={false}
          onSlugChange={setSlug}
          fullCourseUrlPrefix={baseUrlPrefix}
          programId={programId}
          programDisabled={false}
          onProgramIdChange={setProgramId}
          programOptions={programOptions}
          onBannerImageFileChange={(file) => {
            setBannerImageFile(file);
            setBannerPreviewUrl(URL.createObjectURL(file));
          }}
          courseCoverMediaId={bannerMediaId}
          courseCoverSrc={bannerPreviewUrl || bannerUrl?.trim() || ''}
          courseDuration={courseDuration}
          onCourseDurationChange={setCourseDuration}
          videoDuration={videoDuration}
          onVideoDurationChange={setVideoDuration}
          descriptionHtml={descriptionHtml}
          onDescriptionHtmlChange={setDescriptionHtml}
          lockLessonsInOrder={lockLessonsInOrder}
          onLockLessonsInOrderChange={setLockLessonsInOrder}
        />

        {canPersistToLms ? (
          <>
            <Divider sx={[css.dividerSection, { my: 3 }]} component="hr" />
            <Stack spacing={2}>
              <Typography variant="caption" color="text.secondary">
                {hasCourseRow
                  ? 'Editing a live LMS course row. Banner file path is stored server-side only.'
                  : 'Save creates the course in the catalog, then applies these settings.'}
              </Typography>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={handlePersistLmsSettings} disabled={saveBusy}>
                  {saveBusy ? 'Saving…' : 'Save course'}
                </Button>
              </Stack>
            </Stack>
          </>
        ) : (
          <Box sx={css.footerRow}>
            <Button
              variant="contained"
              color="primary"
              sx={css.saveBtn}
              onClick={() => toast.success('Course settings saved (demo).')}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
