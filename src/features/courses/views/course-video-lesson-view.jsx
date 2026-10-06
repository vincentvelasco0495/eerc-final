import { useParams, useNavigate } from 'react-router';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  useLmsCourseByLookup,
  useLmsLessonProgress,
  useLmsModulesByCourse,
  extractQuizzesFromModules,
} from 'src/hooks/use-lms';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';
import { resolveCourseMarketingBannerUrl } from 'src/utils/course-hero-image';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { guestCanAccessLesson } from 'src/features/courses/utils/lesson-preview-access';
import { SecureLessonVideo } from 'src/features/courses/components/secure-lesson-video';
import { patchLmsLessonProgress, getLessonMaterialPlaybackUrl } from 'src/redux/api/lmsApi';
import { useLmsCourseDetailShell } from 'src/features/courses/hooks/use-lms-course-detail-shell';
import { resolveLessonVideoPlaybackUrls } from 'src/features/courses/utils/resolve-lesson-video-playback-urls';

import { Iconify } from 'src/components/iconify';
import { WatermarkOverlay } from 'src/components/common/watermark-overlay';
import { CourseDetailBackArrowSvg } from 'src/components/course-detail/course-detail-back-arrow';

import { useAuthContext } from 'src/auth/hooks';

import { extractYouTubeVideoIdFromHtml } from '../utils/extract-youtube-id-from-html';
import { resolveVideoLessonFromModules } from '../utils/resolve-video-lesson-from-modules';

// ----------------------------------------------------------------------

const VIDEO_CURRICULUM_TYPES = new Set(['video', 'stream', 'zoom']);

function formatBytes(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 0) {
    return '—';
  }
  if (v < 1024) {
    return `${Math.round(v)} B`;
  }
  if (v < 1024 * 1024) {
    const kb = v / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} kb`;
  }
  return `${(v / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeKind(mime) {
  const m = typeof mime === 'string' ? mime.toLowerCase() : '';
  if (m.includes('pdf')) {
    return 'pdf';
  }
  if (m.startsWith('image/')) {
    return 'image';
  }
  return 'file';
}

function fileRowIcon(kind) {
  if (kind === 'pdf') {
    return 'solar:file-text-bold-duotone';
  }
  if (kind === 'image') {
    return 'solar:gallery-bold-duotone';
  }
  return 'solar:document-bold-duotone';
}

function isDownloadDocMaterial(mime) {
  const m = typeof mime === 'string' ? mime.toLowerCase() : '';
  return !(m.startsWith('image/') || m.startsWith('video/'));
}

function normalizeAssetUrl(path, materialPublicId = null, inline = false) {
  const id = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  if (id && base) {
    return `${base}/api/lesson-materials/${encodeURIComponent(id)}/file${inline ? '?inline=1' : ''}`;
  }
  return resolveApiAssetUrl(path);
}

/**
 * Learner-facing full-page video lesson: uploaded file URL from modules payload (public storage),
 * otherwise YouTube from body HTML.
 */
export function CourseVideoLessonView() {
  const theme = useTheme();
  const { slug = '', courseId = '', lessonId = '' } = useParams();
  const courseLookup = slug || courseId;
  const navigate = useNavigate();
  const { authenticated } = useAuthContext();
  const isGuest = !authenticated;

  const { course, isLoading: courseLoading } = useLmsCourseByLookup(courseLookup);
  const resolvedCourseId = course?.id ?? '';
  const { modules, isLoading: modulesLoading, mutate: mutateModules } =
    useLmsModulesByCourse(resolvedCourseId);
  const { lessonProgressRecords, concurrentViewers, mutate: mutateProgress } = useLmsLessonProgress(
    resolvedCourseId,
    Boolean(resolvedCourseId) && !isGuest
  );

  const quizzesForCourse = useMemo(
    () => extractQuizzesFromModules(modules),
    [modules]
  );

  const { shell, isLessonLocked } = useLmsCourseDetailShell(course, modules, quizzesForCourse);

  const lessonPayload = useMemo(
    () => resolveVideoLessonFromModules(lessonId, modules),
    [lessonId, modules]
  );

  const progressRecord = useMemo(
    () =>
      (Array.isArray(lessonProgressRecords) ? lessonProgressRecords : []).find(
        (row) => row?.lessonKey === lessonId
      ) ?? null,
    [lessonId, lessonProgressRecords]
  );

  const watermarkText = useMemo(() => {
    const fromLesson =
      typeof lessonPayload?.watermarkText === 'string' ? lessonPayload.watermarkText.trim() : '';
    return fromLesson;
  }, [lessonPayload?.watermarkText]);

  const dateLabel = useMemo(() => new Date().toLocaleDateString(), []);

  const handleVideoProgress = useCallback(
    async (payload) => {
      if (!resolvedCourseId || !lessonId || isGuest || isLessonLocked(lessonId)) {
        return null;
      }
      const result = await patchLmsLessonProgress(resolvedCourseId, {
        lessonKey: lessonId,
        ...payload,
      });
      if (result?.completed) {
        void mutateModules();
        void mutateProgress();
      }
      return result;
    },
    [isGuest, isLessonLocked, lessonId, mutateModules, mutateProgress, resolvedCourseId]
  );

  const courseLinkHref = paths.dashboard.courseDetails(
    typeof course?.slug === 'string' && course.slug.trim() ? course.slug.trim() : courseLookup
  );

  useEffect(() => {
    if (!lessonId || courseLoading || modulesLoading) {
      return;
    }
    if (isGuest && !guestCanAccessLesson(lessonId, modules)) {
      navigate(`${courseLinkHref}#curriculum`, { replace: true });
      return;
    }
    if (!shell) {
      return;
    }
    if (isLessonLocked(lessonId)) {
      navigate(`${courseLinkHref}#curriculum`, { replace: true });
    }
  }, [
    lessonId,
    courseLoading,
    modulesLoading,
    shell,
    isLessonLocked,
    isGuest,
    modules,
    navigate,
    courseLinkHref,
  ]);

  const youtubeId = useMemo(
    () => extractYouTubeVideoIdFromHtml(lessonPayload?.bodyHtml ?? ''),
    [lessonPayload?.bodyHtml]
  );

  const fileMaterialId = lessonPayload?.primaryVideoMaterial?.id ?? null;

  const [fileVideoObjectUrl, setFileVideoObjectUrl] = useState(null);
  const [fileVideoSources, setFileVideoSources] = useState([]);
  const [fileVideoError, setFileVideoError] = useState(null);
  const [fileVideoLoading, setFileVideoLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!fileMaterialId || !CONFIG.serverUrl?.trim()) {
        setFileVideoObjectUrl(null);
        setFileVideoSources([]);
        setFileVideoError(null);
        setFileVideoLoading(false);
        return;
      }
      if (isGuest) {
        setFileVideoObjectUrl(null);
        setFileVideoSources([]);
        setFileVideoError('Sign in to watch this video.');
        setFileVideoLoading(false);
        return;
      }

      setFileVideoLoading(true);
      try {
        const src = await getLessonMaterialPlaybackUrl(fileMaterialId);
        if (cancelled) {
          return;
        }
        const urls = resolveLessonVideoPlaybackUrls(fileMaterialId, src);
        setFileVideoObjectUrl(urls[0] || src);
        setFileVideoSources(urls);
        setFileVideoError(null);
      } catch {
        if (cancelled) {
          return;
        }
        const urls = resolveLessonVideoPlaybackUrls(fileMaterialId);
        if (urls[0]) {
          setFileVideoObjectUrl(urls[0]);
          setFileVideoSources(urls);
          setFileVideoError(null);
        } else {
          setFileVideoObjectUrl(null);
          setFileVideoSources([]);
          setFileVideoError('Could not load the uploaded video file.');
        }
      } finally {
        if (!cancelled) {
          setFileVideoLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [fileMaterialId, isGuest]);

  useEffect(() => {
    if (isGuest || !youtubeId || fileVideoObjectUrl || !resolvedCourseId || !lessonId) {
      return undefined;
    }
    if (isLessonLocked(lessonId)) {
      return undefined;
    }
    void handleVideoProgress({ presence: true });
    const timer = window.setInterval(() => {
      void handleVideoProgress({ presence: true });
    }, 20000);
    return () => window.clearInterval(timer);
  }, [
    fileVideoObjectUrl,
    handleVideoProgress,
    isGuest,
    isLessonLocked,
    lessonId,
    resolvedCourseId,
    youtubeId,
  ]);

  const navIds = useMemo(() => {
    if (!course || !lessonId || !shell) {
      return { prevId: null, nextId: null };
    }
    const videoLessons = [];
    shell.curriculumModules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        if (VIDEO_CURRICULUM_TYPES.has(les.type)) {
          videoLessons.push(les.id);
        }
      });
    });
    const idx = videoLessons.indexOf(lessonId);
    return {
      prevId: idx > 0 ? videoLessons[idx - 1] : null,
      nextId: idx >= 0 && idx < videoLessons.length - 1 ? videoLessons[idx + 1] : null,
    };
  }, [course, lessonId, shell]);

  const toLessonHref = useCallback(
    (id) => (id ? paths.dashboard.courseVideoLesson(courseLookup, id) : null),
    [courseLookup]
  );
  const handleBackToCourse = useCallback(() => {
    const idx = Number(window.history?.state?.idx ?? 0);
    if (idx > 0) {
      navigate(-1);
      return;
    }
    navigate(courseLinkHref, { replace: true });
  }, [navigate, courseLinkHref]);

  const downloadMaterial = useCallback(async (materialPublicId, filename) => {
    const material = (lessonPayload?.lessonMaterials ?? []).find((m) => m?.id === materialPublicId);
    const directUrl = normalizeAssetUrl(material?.fileUrl, material?.id ?? materialPublicId, false);
    if (directUrl) {
      const a = document.createElement('a');
      a.href = directUrl;
      a.download = filename || 'download';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    throw new Error(`Missing file URL for lesson material ${materialPublicId}`);
  }, [lessonPayload?.lessonMaterials]);

  const downloadAll = useCallback(() => {
    const mats = lessonPayload?.lessonMaterials ?? [];
    void (async () => {
      for (let i = 0; i < mats.length; i += 1) {
        const m = mats[i];
        if (m?.id) {
          await downloadMaterial(m.id, m.name ?? `file-${i + 1}`);
        }
      }
    })();
  }, [lessonPayload?.lessonMaterials, downloadMaterial]);

  const hasCourseData = Boolean(course);
  const hasModuleData = Array.isArray(modules) && modules.length > 0;
  const loading = Boolean(
    courseLookup &&
      ((!hasCourseData && courseLoading) ||
        (resolvedCourseId && !hasModuleData && modulesLoading))
  );

  if (!courseLookup || !lessonId) {
    return (
      <DashboardContent maxWidth={false}>
        <Typography variant="body2">Missing course or lesson.</Typography>
      </DashboardContent>
    );
  }

  if (!CONFIG.serverUrl?.trim()) {
    return (
      <DashboardContent maxWidth={false}>
        <Typography variant="body2">
          Video lessons require the LMS API. Set <code>VITE_SERVER_URL</code> and sign in.
        </Typography>
      </DashboardContent>
    );
  }

  if (loading) {
    return (
      <DashboardContent maxWidth={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (courseLookup && !resolvedCourseId) {
    return (
      <DashboardContent maxWidth={false}>
        <Stack spacing={2} sx={{ py: 4 }}>
          <Typography variant="body1">This course is not in the catalog or the link is invalid.</Typography>
          <Button component={RouterLink} href={paths.dashboard.courses.root} variant="contained" color="inherit">
            Browse courses
          </Button>
        </Stack>
      </DashboardContent>
    );
  }

  if (!lessonPayload) {
    return (
      <DashboardContent maxWidth={false}>
        <Stack spacing={2} sx={{ py: 4 }}>
          <Typography variant="body1">This video lesson could not be found for this course.</Typography>
          <Button component={RouterLink} href={courseLinkHref} variant="contained" color="inherit">
            Back to course
          </Button>
        </Stack>
      </DashboardContent>
    );
  }

  const materials = isGuest
    ? []
    : (lessonPayload.lessonMaterials ?? []).filter((m) => isDownloadDocMaterial(m?.mime));
  const courseTitle =
    typeof course?.title === 'string' && course.title.trim() ? course.title.trim() : 'Course';

  const kindLabel =
    lessonPayload.lessonKind === 'stream'
      ? 'Stream lesson'
      : lessonPayload.lessonKind === 'zoom'
        ? 'Zoom lesson'
        : 'Video lesson';

  return (
    <DashboardContent maxWidth={false} disablePadding sx={{ bgcolor: 'transparent' }}>
      <title>{`${lessonPayload.title} | ${CONFIG.appName}`}</title>
      <Box
        sx={{
          minHeight: 'calc(100vh - 160px)',
          bgcolor: (t) => t.vars.palette.brand.page,
          pb: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            maxWidth: 920,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack spacing={1.25} sx={{ minWidth: 0 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={handleBackToCourse}
                  aria-label="Back to course"
                  sx={(t) => ({
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    m: 0,
                    p: 0,
                    border: 'none',
                    borderRadius: '8px',
                    color: t.palette.text.primary,
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(t.palette.primary.main, 0.08),
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${t.palette.primary.main}`,
                      outlineOffset: '2px',
                    },
                  })}
                >
                  <CourseDetailBackArrowSvg />
                </Box>
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {courseTitle}
                  </Typography>
                  {lessonPayload.moduleTitle ? (
                    <>
                      <Typography variant="caption" color="text.disabled">
                        ·
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {lessonPayload.moduleTitle}
                      </Typography>
                    </>
                  ) : null}
                  <Typography variant="caption" color="text.disabled">
                    ·
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lesson content
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                icon={<Iconify icon="solar:play-circle-linear" width={16} />}
                label={kindLabel}
                color="primary"
                variant="soft"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (t) => `0 0 0 1px ${alpha(t.palette.common.white, 0.06)}`,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: 4,
                  background: (t) =>
                    `linear-gradient(90deg, ${t.palette.primary.main} 0%, ${alpha(t.palette.primary.main, 0.45)} 55%, ${t.palette.primary.light} 100%)`,
                }}
              />
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, pb: { xs: 2, md: 2.5 } }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: -0.02,
                    fontSize: { xs: '1.65rem', md: '2rem' },
                    lineHeight: 1.25,
                    mb: 0,
                  }}
                >
                  {lessonPayload.title}
                </Typography>
              </CardContent>

              <Divider />

              <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, pt: { xs: 2.5, md: 3 } }}>
                {fileVideoObjectUrl ? (
                  <SecureLessonVideo
                    src={fileVideoObjectUrl}
                    sources={fileVideoSources}
                    poster={resolveCourseMarketingBannerUrl(course)}
                    title={lessonPayload.title}
                    watermarkText={watermarkText}
                    dateLabel={dateLabel}
                    initialPercent={Number(progressRecord?.progressPercent) || 0}
                    initialPositionSeconds={Number(progressRecord?.lastPositionSeconds) || 0}
                    watchingNow={Number(concurrentViewers?.[lessonId]) || 0}
                    onProgress={handleVideoProgress}
                  />
                ) : fileVideoError ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      mb: 3,
                      borderColor: 'error.main',
                      bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                    }}
                  >
                    <Typography variant="body2" color="error.main">
                      {fileVideoError}
                    </Typography>
                  </Paper>
                ) : fileVideoLoading && fileMaterialId ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '16 / 9',
                      mb: 3,
                      borderRadius: 1.5,
                      bgcolor: (t) => t.vars.palette.brand.sunken,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : youtubeId ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: 1,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      bgcolor: 'common.black',
                      border: '1px solid',
                      borderColor: 'divider',
                      aspectRatio: '16 / 9',
                      mb: 3,
                    }}
                  >
                    <Box
                      component="iframe"
                      title={lessonPayload.title}
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: 1,
                        height: 1,
                        border: 'none',
                      }}
                    />
                    {watermarkText ? (
                      <WatermarkOverlay
                        variant="video"
                        username={watermarkText}
                        dateLabel={dateLabel}
                      />
                    ) : null}
                  </Box>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      mb: 3,
                      borderStyle: 'dashed',
                      bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                      textAlign: 'center',
                    }}
                  >
                    <Iconify icon="solar:videocamera-record-linear" width={40} sx={{ color: 'text.disabled', mb: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Upload a video file to lesson materials, or add a YouTube link in lesson content.
                    </Typography>
                  </Paper>
                )}

                {lessonPayload.bodyHtml ? (
                  <Box
                    className="video-lesson-body"
                    sx={{
                      color: 'text.primary',
                      fontSize: '1rem',
                      lineHeight: 1.75,
                      maxWidth: 720,
                      '& p': { mb: 2.25, mt: 0 },
                      '& p:last-child': { mb: 0 },
                      '& ul, & ol': { pl: 2.75, mb: 2, '& li': { mb: 0.75 } },
                      '& h1, & h2, & h3': {
                        fontWeight: 700,
                        mt: 2.5,
                        mb: 1.25,
                        lineHeight: 1.35,
                      },
                      '& a': {
                        color: 'brand.accentText',
                        fontWeight: 600,
                        textDecorationColor: (t) => alpha(t.palette.primary.main, 0.45),
                      },
                      '& blockquote': {
                        my: 2,
                        pl: 2,
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        color: 'text.secondary',
                        fontStyle: 'italic',
                      },
                      '& strong': { color: 'text.primary' },
                    }}
                    dangerouslySetInnerHTML={{ __html: lessonPayload.bodyHtml }}
                  />
                ) : null}
              </CardContent>
            </Card>

            {materials.length > 0 ? (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: (t) => `0 0 0 1px ${alpha(t.palette.common.white, 0.06)}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        color: 'brand.accentText',
                      }}
                    >
                      <Iconify icon="solar:folder-with-files-bold-duotone" width={24} />
                    </Box>
                    <Box>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                        Lesson materials
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Files provided with this lesson — download individually or all at once.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={0}>
                    {materials.map((m) => {
                      const kind = mimeKind(m.mime);
                      return (
                        <Stack
                          key={m.id}
                          direction={{ xs: 'column', sm: 'row' }}
                          alignItems={{ xs: 'stretch', sm: 'center' }}
                          spacing={2}
                          sx={{
                            py: 2,
                            px: { xs: 0, sm: 0.5 },
                            borderRadius: 1,
                            transition: theme.transitions.create(['background-color'], {
                              duration: theme.transitions.duration.shorter,
                            }),
                            '&:hover': {
                              bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 1,
                                flexShrink: 0,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: 'background.neutral',
                                color: 'text.secondary',
                              }}
                            >
                              <Iconify icon={fileRowIcon(kind)} width={26} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" noWrap title={m.name} sx={{ fontWeight: 700 }}>
                                {m.name ?? 'File'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatBytes(m.sizeBytes)}
                              </Typography>
                            </Box>
                          </Stack>
                          <Button
                            variant="soft"
                            color="primary"
                            size="small"
                            startIcon={<Iconify icon="solar:download-minimalistic-bold" width={18} />}
                            onClick={() => downloadMaterial(m.id, m.name)}
                            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0 }}
                          >
                            Download
                          </Button>
                        </Stack>
                      );
                    })}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {materials.length}
                      </Box>{' '}
                      {materials.length === 1 ? 'file attached' : 'files attached'}
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      startIcon={<Iconify icon="solar:archive-down-minimlistic-bold" width={18} />}
                      onClick={() => downloadAll()}
                      sx={{ fontWeight: 700 }}
                    >
                      Download all
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : null}

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={!navIds.prevId}
                  onClick={() => navIds.prevId && navigate(toLessonHref(navIds.prevId))}
                  startIcon={<Iconify icon="solar:alt-arrow-left-linear" width={20} />}
                  sx={{
                    minWidth: { sm: 140 },
                    fontWeight: 700,
                    borderColor: 'divider',
                    '&:not(:disabled):hover': { borderColor: 'text.primary' },
                  }}
                >
                  Previous
                </Button>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ order: { xs: -1, sm: 0 } }}>
                  <Iconify icon="solar:route-linear" width={20} sx={{ color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.08 }}>
                    Lesson navigation
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!navIds.nextId}
                  onClick={() => navIds.nextId && navigate(toLessonHref(navIds.nextId))}
                  endIcon={<Iconify icon="solar:alt-arrow-right-linear" width={20} />}
                  sx={{ minWidth: { sm: 140 }, fontWeight: 700, boxShadow: 'none' }}
                >
                  Next
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </DashboardContent>
  );
}
