import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { resolveLessonVideoPlaybackUrls } from 'src/features/courses/utils/resolve-lesson-video-playback-urls';
import {
  deleteLessonMaterial,
  getLmsAxiosErrorMessage,
  uploadLessonVideoInChunks,
  getLessonMaterialPlaybackUrl,
} from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';

import { styles } from '../curriculum-text-lesson-workspace/styles';
import { VideoLessonWorkspaceHeader } from '../video-lesson-workspace-header';
import { VideoLessonWorkspaceFields } from '../video-lesson-workspace-fields';
import { TextLessonWorkspaceSettings } from '../text-lesson-workspace-settings';
import { TextLessonWorkspaceMaterials } from '../text-lesson-workspace-materials';
import { TextLessonWorkspaceEditorSection } from '../text-lesson-workspace-editor-section';
import {
  normalizeVideoWatermarkText,
  normalizeVideoWorkspaceMeta,
} from '../../utils/lesson-authoring-helpers';
import {
  buildLessonAuthoringTargetKey,
  normalizeUploadedLessonMaterial,
} from '../../utils/lesson-materials-cache';

export function CurriculumVideoLessonWorkspace({
  lesson,
  onLessonTitleChange,
  onLessonSave,
  saveLiveRichLesson,
  liveLessonAuthoring = null,
  onLessonMaterialsChange,
}) {
  const [workspaceTab, setWorkspaceTab] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadPercent, setVideoUploadPercent] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoPreviewSources, setVideoPreviewSources] = useState([]);
  const [videoPreviewLoading, setVideoPreviewLoading] = useState(false);
  const videoBlobRef = useRef(null);

  const assignVideoPreviewUrl = useCallback((blobUrlOrNull) => {
    const raw = typeof blobUrlOrNull === 'string' ? blobUrlOrNull.trim() : '';
    const next = raw || null;
    const prev = videoBlobRef.current;
    if (prev && prev.startsWith('blob:') && prev !== next) {
      URL.revokeObjectURL(prev);
    }
    videoBlobRef.current = next && next.startsWith('blob:') ? next : null;
    setVideoPreviewUrl(next ?? '');
    if (!next || next.startsWith('blob:')) {
      setVideoPreviewSources(next ? [next] : []);
    }
  }, []);

  useEffect(
    () => () => {
      if (videoBlobRef.current) {
        URL.revokeObjectURL(videoBlobRef.current);
      }
    },
    []
  );

  const [sourceType, setSourceType] = useState('html-mp4');
  const [duration, setDuration] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [videoLessonMaterialPublicId, setVideoLessonMaterialPublicId] = useState(null);
  const [lessonPreview, setLessonPreview] = useState(false);
  const [shortDescriptionHtml, setShortDescriptionHtml] = useState('');
  const [lessonContentHtml, setLessonContentHtml] = useState('');

  const lessonAuthorFingerprint = useMemo(() => {
    if (!saveLiveRichLesson || !liveLessonAuthoring) {
      return '';
    }
    const excerpt = liveLessonAuthoring.excerptHtml ?? '';
    const body = liveLessonAuthoring.bodyHtml ?? '';
    const lite = (raw) => {
      const str = typeof raw === 'string' ? raw : String(raw ?? '');
      const cap = str.length <= 2048 ? str : `${str.slice(0, 512)}::${str.slice(-512)}`;
      return `${str.length}:${cap}`;
    };
    const meta = liveLessonAuthoring.lessonMeta ?? {};
    let metaStable = '';
    try {
      metaStable = JSON.stringify(meta);
    } catch {
      metaStable = String(meta);
    }
    return [
      lite(excerpt),
      lite(body),
      metaStable,
      liveLessonAuthoring.isCoreLesson ? 'core' : 'standalone',
    ].join('|');
  }, [liveLessonAuthoring, saveLiveRichLesson]);

  const authoringTargetKey = useMemo(
    () => buildLessonAuthoringTargetKey(lesson, liveLessonAuthoring),
    [lesson, liveLessonAuthoring]
  );
  const hydratedAuthoringKeyRef = useRef('');

  const materialModulePublicId = useMemo(() => {
    if (liveLessonAuthoring?.modulePublicId != null && String(liveLessonAuthoring.modulePublicId).trim() !== '') {
      return liveLessonAuthoring.modulePublicId;
    }
    const id = lesson?.id;
    if (typeof id === 'string' && id.endsWith('-core')) {
      return id.slice(0, -'-core'.length);
    }
    return null;
  }, [lesson?.id, liveLessonAuthoring?.modulePublicId]);

  const materialModuleResourcePublicId = useMemo(
    () =>
      liveLessonAuthoring?.isCoreLesson
        ? liveLessonAuthoring?.moduleLessonResourcePublicId ?? null
        : null,
    [liveLessonAuthoring?.isCoreLesson, liveLessonAuthoring?.moduleLessonResourcePublicId]
  );

  const materialStandaloneLessonPublicId = useMemo(() => {
    if (
      liveLessonAuthoring?.standaloneLessonPublicId != null &&
      String(liveLessonAuthoring.standaloneLessonPublicId).trim() !== ''
    ) {
      return liveLessonAuthoring.standaloneLessonPublicId;
    }
    const id = lesson?.id;
    const t = lesson?.type;
    if (typeof id !== 'string' || (t !== 'document' && t !== 'video') || id.endsWith('-core')) {
      return null;
    }
    return id;
  }, [lesson?.id, lesson?.type, liveLessonAuthoring?.standaloneLessonPublicId]);

  const allLessonMaterials = useMemo(
    () => (Array.isArray(liveLessonAuthoring?.lessonMaterials) ? liveLessonAuthoring.lessonMaterials : []),
    [liveLessonAuthoring?.lessonMaterials]
  );

  const listedLessonMaterials = useMemo(() => {
    const linkedVideoId =
      typeof videoLessonMaterialPublicId === 'string' ? videoLessonMaterialPublicId.trim() : '';
    if (!linkedVideoId) {
      return allLessonMaterials;
    }
    return allLessonMaterials.filter((m) => m?.id && String(m.id) !== linkedVideoId);
  }, [allLessonMaterials, videoLessonMaterialPublicId]);

  const videoLinkedName = useMemo(() => {
    if (!videoLessonMaterialPublicId) return null;
    return allLessonMaterials.find((m) => m.id === videoLessonMaterialPublicId)?.name ?? null;
  }, [allLessonMaterials, videoLessonMaterialPublicId]);

  useEffect(() => {
    setWorkspaceTab(0);
  }, [lesson.id, lesson.type]);

  useLayoutEffect(() => {
    if (!saveLiveRichLesson || !liveLessonAuthoring) {
      hydratedAuthoringKeyRef.current = '';
      setSourceType('html-mp4');
      setDuration('');
      setWatermarkText('');
      setVideoLessonMaterialPublicId(null);
      setLessonPreview(false);
      setShortDescriptionHtml('');
      setLessonContentHtml('');
      assignVideoPreviewUrl(null);
      return;
    }

    if (hydratedAuthoringKeyRef.current === authoringTargetKey) {
      return;
    }
    hydratedAuthoringKeyRef.current = authoringTargetKey;

    const lm =
      liveLessonAuthoring.lessonMeta && typeof liveLessonAuthoring.lessonMeta === 'object'
        ? liveLessonAuthoring.lessonMeta
        : {};

    const vst = lm.videoSourceType != null ? String(lm.videoSourceType).trim() : '';
    setSourceType(vst || 'html-mp4');

    setVideoLessonMaterialPublicId(
      lm.videoLessonMaterialPublicId != null &&
        String(lm.videoLessonMaterialPublicId).trim() !== ''
        ? String(lm.videoLessonMaterialPublicId).trim()
        : null
    );

    if (liveLessonAuthoring.isCoreLesson) {
      setDuration(
        String(
          liveLessonAuthoring.duration ??
            lm.durationLabel ??
            liveLessonAuthoring.durationLabel ??
            ''
        ).trim()
      );
    } else {
      setDuration(String(lm.durationLabel ?? liveLessonAuthoring.durationLabel ?? '').trim());
    }

    setLessonPreview(!!lm.lessonPreview);
    setWatermarkText(normalizeVideoWatermarkText(lm.watermarkText ?? lm.watermark_text ?? ''));

    setShortDescriptionHtml(String(liveLessonAuthoring.excerptHtml ?? '').trim());
    setLessonContentHtml(String(liveLessonAuthoring.bodyHtml ?? '').trim());
  }, [
    authoringTargetKey,
    lesson.id,
    lesson.type,
    saveLiveRichLesson,
    liveLessonAuthoring,
    assignVideoPreviewUrl,
  ]);

  useEffect(() => {
    let cancelled = false;
    const vid =
      typeof videoLessonMaterialPublicId === 'string' ? videoLessonMaterialPublicId.trim() : '';

    async function load() {
      if (videoUploading) return;
      if (!vid || !CONFIG.serverUrl?.trim()) {
        assignVideoPreviewUrl(null);
        setVideoPreviewSources([]);
        setVideoPreviewLoading(false);
        return;
      }

      setVideoPreviewLoading(true);
      try {
        const src = await getLessonMaterialPlaybackUrl(vid);
        if (cancelled || videoUploading) return;
        const urls = resolveLessonVideoPlaybackUrls(vid, src);
        assignVideoPreviewUrl(urls[0] || src);
        setVideoPreviewSources(urls);
      } catch {
        if (cancelled || videoUploading) return;
        const urls = resolveLessonVideoPlaybackUrls(vid);
        if (urls[0]) {
          assignVideoPreviewUrl(urls[0]);
          setVideoPreviewSources(urls);
        }
      } finally {
        if (!cancelled) {
          setVideoPreviewLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [videoLessonMaterialPublicId, videoUploading, assignVideoPreviewUrl]);

  const buildLessonMetaForSave = useCallback(
    (overrides = {}) =>
      normalizeVideoWorkspaceMeta(
        {
          lessonPreview,
          durationLabel: duration.trim(),
          videoSourceType: sourceType,
          videoLessonMaterialPublicId,
          watermarkText,
          ...overrides,
        },
        { durationLabelFallback: duration }
      ),
    [duration, lessonPreview, sourceType, videoLessonMaterialPublicId, watermarkText]
  );

  const persistLesson = useCallback(async () => {
    if (saveLiveRichLesson) {
      try {
        await saveLiveRichLesson({
          title: lesson.title,
          durationLabel: duration.trim(),
          shortDescriptionHtml,
          lessonContentHtml,
          lessonMeta: buildLessonMetaForSave(),
        });
        toast.success('Lesson saved.');
      } catch (e) {
        toast.error(getLmsAxiosErrorMessage(e, 'Save failed.'));
      }
      return;
    }
    onLessonSave?.(lesson.id);
    toast.success(`Lesson “${lesson.title}” saved (demo).`);
  }, [
    buildLessonMetaForSave,
    duration,
    lesson.id,
    lesson.title,
    lessonContentHtml,
    onLessonSave,
    saveLiveRichLesson,
    shortDescriptionHtml,
  ]);

  const materialUploadTarget = useMemo(() => {
    const hasStandalone = Boolean(
      materialStandaloneLessonPublicId && String(materialStandaloneLessonPublicId).trim() !== ''
    );
    if (hasStandalone) {
      return { kind: 'standalone', id: materialStandaloneLessonPublicId };
    }
    if (materialModulePublicId && String(materialModulePublicId).trim() !== '') {
      return { kind: 'module', id: materialModulePublicId };
    }
    return null;
  }, [materialModulePublicId, materialStandaloneLessonPublicId]);

  const uploadLessonVideoAndLink = useCallback(
    async (file) => {
      if (!file) {
        return;
      }
      if (!CONFIG.serverUrl?.trim()) {
        toast.error(
          'Set VITE_SERVER_URL to your Laravel app origin (e.g. http://127.0.0.1:8000) and restart the dev server.'
        );
        return;
      }
      if (!materialUploadTarget) {
        toast.error('Select a video lesson tied to your course before uploading.');
        return;
      }
      if (!saveLiveRichLesson) {
        toast.error('Sign in with LMS authoring enabled to upload files.');
        return;
      }

      setVideoUploading(true);
      setVideoUploadPercent(0);
      assignVideoPreviewUrl(URL.createObjectURL(file));
      const previousVideoId =
        typeof videoLessonMaterialPublicId === 'string' && videoLessonMaterialPublicId.trim() !== ''
          ? videoLessonMaterialPublicId.trim()
          : null;

      try {
        const raw = await uploadLessonVideoInChunks({
          file,
          target: {
            kind: materialUploadTarget.kind,
            id: materialUploadTarget.id,
            moduleResourcePublicId: materialModuleResourcePublicId,
          },
          onProgress: ({ percent }) => setVideoUploadPercent(percent),
        });
        const uploadedId =
          raw?.data?.id != null
            ? String(raw.data.id)
            : raw?.id != null
              ? String(raw.id)
              : null;
        if (!uploadedId) {
          throw new Error('Upload response missing material id.');
        }

        setVideoLessonMaterialPublicId(uploadedId);

        await saveLiveRichLesson({
          title: lesson.title,
          durationLabel: duration.trim(),
          shortDescriptionHtml,
          lessonContentHtml,
          lessonMeta: buildLessonMetaForSave({
            videoLessonMaterialPublicId: uploadedId,
          }),
        });

        if (previousVideoId && previousVideoId !== uploadedId) {
          try {
            await deleteLessonMaterial(previousVideoId);
          } catch (delErr) {
            toast.error(
              getLmsAxiosErrorMessage(
                delErr,
                'New file is linked, but the previous file could not be removed from storage.'
              )
            );
          }
        }

        const uploadedMaterial = normalizeUploadedLessonMaterial(raw);
        if (uploadedMaterial && materialModulePublicId) {
          onLessonMaterialsChange?.({
            modulePublicId: materialModulePublicId,
            standaloneLessonPublicId: materialStandaloneLessonPublicId,
            add: [uploadedMaterial],
          });
        }

        toast.success('Video uploaded and linked.');
      } catch (e) {
        toast.error(getLmsAxiosErrorMessage(e, 'Upload failed.'));
      } finally {
        setVideoUploading(false);
        setVideoUploadPercent(null);
      }
    },
    [
      assignVideoPreviewUrl,
      buildLessonMetaForSave,
      duration,
      lesson.title,
      lessonContentHtml,
      materialModulePublicId,
      materialModuleResourcePublicId,
      materialStandaloneLessonPublicId,
      materialUploadTarget,
      onLessonMaterialsChange,
      saveLiveRichLesson,
      shortDescriptionHtml,
      videoLessonMaterialPublicId,
    ]
  );

  const handleVideoFiles = useCallback(
    (files) => {
      const f = files?.[0];
      void uploadLessonVideoAndLink(f);
    },
    [uploadLessonVideoAndLink]
  );

  const handleRemoveVideo = useCallback(async () => {
    const rawId =
      typeof videoLessonMaterialPublicId === 'string' ? videoLessonMaterialPublicId.trim() : '';

    if (!rawId) {
      assignVideoPreviewUrl(null);
      return;
    }

    if (!saveLiveRichLesson) {
      assignVideoPreviewUrl(null);
      setVideoLessonMaterialPublicId(null);
      toast.success('Video cleared.');
      return;
    }

    if (!window.confirm('Remove this video from the lesson? The uploaded file will be deleted.')) {
      return;
    }

    setVideoUploading(true);
    try {
      await saveLiveRichLesson({
        title: lesson.title,
        durationLabel: duration.trim(),
        shortDescriptionHtml,
        lessonContentHtml,
        lessonMeta: buildLessonMetaForSave({
          videoLessonMaterialPublicId: null,
        }),
      });
      assignVideoPreviewUrl(null);
      setVideoLessonMaterialPublicId(null);
      await deleteLessonMaterial(rawId);
      if (materialModulePublicId) {
        onLessonMaterialsChange?.({
          modulePublicId: materialModulePublicId,
          standaloneLessonPublicId: materialStandaloneLessonPublicId,
          removeIds: [rawId],
        });
      }
      toast.success('Video removed.');
    } catch (e) {
      toast.error(getLmsAxiosErrorMessage(e, 'Could not remove video.'));
    } finally {
      setVideoUploading(false);
    }
  }, [
    assignVideoPreviewUrl,
    buildLessonMetaForSave,
    duration,
    lesson.title,
    lessonContentHtml,
    materialModulePublicId,
    materialStandaloneLessonPublicId,
    onLessonMaterialsChange,
    saveLiveRichLesson,
    shortDescriptionHtml,
    videoLessonMaterialPublicId,
  ]);

  const showVideoRemoveControls = Boolean(
    saveLiveRichLesson ? videoLessonMaterialPublicId : videoPreviewUrl
  );

  const videoSecondaryHint =
    videoLessonMaterialPublicId ?
      videoLinkedName ?
        `Linked: ${videoLinkedName}`
      : `Linked material id: ${videoLessonMaterialPublicId}`
    : null;

  return (
    <Box sx={(theme) => styles.root(theme)}>
      <VideoLessonWorkspaceHeader
        lessonTitle={lesson.title}
        onLessonTitleChange={(title) => onLessonTitleChange(lesson.id, title)}
        onCreate={persistLesson}
        actionLabel={saveLiveRichLesson ? 'Save lesson' : 'Create'}
      />

      <Box sx={styles.tabsBar}>
        <Tabs
          value={workspaceTab}
          onChange={(_, v) => setWorkspaceTab(v)}
          variant="fullWidth"
          sx={(theme) => styles.tabs(theme)}
        >
          <Tab label="Lesson" disableRipple />
          <Tab label="Q&A" disableRipple />
        </Tabs>
      </Box>

      {workspaceTab === 0 ? (
        <Stack sx={styles.lessonPanel}>
          <VideoLessonWorkspaceFields
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
            duration={duration}
            onDurationChange={setDuration}
            onVideoFiles={handleVideoFiles}
            videoSecondaryHint={videoSecondaryHint}
            videoPreviewUrl={videoPreviewUrl}
            videoPreviewSources={videoPreviewSources}
            videoUploading={videoUploading}
            videoUploadPercent={videoUploadPercent}
            videoPreviewLoading={videoPreviewLoading}
            onVideoRemove={handleRemoveVideo}
            showVideoRemove={showVideoRemoveControls}
            watermarkText={watermarkText}
            onWatermarkTextChange={setWatermarkText}
          />

          <TextLessonWorkspaceSettings
            lessonPreview={lessonPreview}
            onLessonPreviewChange={setLessonPreview}
            showUnlockAfterPurchase={false}
            hideDuration
          />

          <TextLessonWorkspaceEditorSection
            key={`${lesson.id}-short`}
            label="Short description of the lesson"
            value={shortDescriptionHtml}
            onChange={setShortDescriptionHtml}
            placeholder="Summarize this lesson for the course outline…"
            minHeight={380}
            maxHeight={640}
            contentRevision={
              saveLiveRichLesson && lessonAuthorFingerprint
                ? `short|${lessonAuthorFingerprint}`
                : undefined
            }
            revisionApplyHtml={
              saveLiveRichLesson ? String(liveLessonAuthoring?.excerptHtml ?? '').trim() : undefined
            }
          />

          <TextLessonWorkspaceEditorSection
            key={`${lesson.id}-content`}
            label="Lesson content"
            value={lessonContentHtml}
            onChange={setLessonContentHtml}
            placeholder="Write supporting notes or a transcript…"
            minHeight={440}
            maxHeight={880}
            fullItem
            contentRevision={
              saveLiveRichLesson && lessonAuthorFingerprint
                ? `body|${lessonAuthorFingerprint}`
                : undefined
            }
            revisionApplyHtml={
              saveLiveRichLesson ? String(liveLessonAuthoring?.bodyHtml ?? '').trim() : undefined
            }
          />

          <TextLessonWorkspaceMaterials
            key={`${lesson.id}-files`}
            lessonMaterials={listedLessonMaterials}
            apiConfigured={Boolean(CONFIG.serverUrl?.trim())}
            modulePublicId={materialModulePublicId}
            moduleResourcePublicId={materialModuleResourcePublicId}
            standaloneLessonPublicId={materialStandaloneLessonPublicId}
            onAfterMaterialsChange={onLessonMaterialsChange}
            materialsTarget={{
              modulePublicId: materialModulePublicId,
              standaloneLessonPublicId: materialStandaloneLessonPublicId,
            }}
          />
        </Stack>
      ) : (
        <Box sx={styles.qaPanel}>
          <Typography sx={styles.qaText}>
            Q&A for this lesson will appear here. Learners can ask questions after the lesson is
            published (demo).
          </Typography>
        </Box>
      )}

      <Stack direction="row" justifyContent="flex-end" sx={styles.footer}>
        <Button
          variant="contained"
          color="primary"
          onClick={persistLesson}
          sx={styles.footerButton}
          disabled={videoUploading}
        >
          {saveLiveRichLesson ? 'Save lesson' : 'Create'}
        </Button>
      </Stack>
    </Box>
  );
}
