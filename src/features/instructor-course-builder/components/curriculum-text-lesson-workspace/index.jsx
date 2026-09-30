import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';

import { styles } from './styles';
import { TextLessonWorkspaceHeader } from '../text-lesson-workspace-header';
import { TextLessonWorkspaceSettings } from '../text-lesson-workspace-settings';
import { normalizeLessonMetaForApi } from '../../utils/lesson-authoring-helpers';
import { TextLessonWorkspaceMaterials } from '../text-lesson-workspace-materials';
import { buildLessonAuthoringTargetKey } from '../../utils/lesson-materials-cache';
import { TextLessonWorkspaceEditorSection } from '../text-lesson-workspace-editor-section';

/**
 * @typedef {object} LiveLessonAuthoringHydration
 * @property {string} [updatedAt]
 * @property {string} [excerptHtml]
 * @property {string} [bodyHtml]
 * @property {string} [durationLabel]
 * @property {boolean} [lessonPreview]
 * @property {Array<{ id: string, name: string, mime?: string|null, sizeBytes?: number }>} [lessonMaterials]
 * @property {string} modulePublicId
 * @property {string|null} [standaloneLessonPublicId]
 * @property {boolean} [isCoreLesson]
 */

export function CurriculumTextLessonWorkspace({
  lesson,
  onLessonTitleChange,
  onLessonSave,
  /** When set, PATCH live LMS authoring fields (`excerpt_html`, `body_html`, `lesson_meta`, …). */
  saveLiveRichLesson,
  /** Server snapshot driving initial field values (`GET /modules?courseId=…`). */
  liveLessonAuthoring = null,
  /** Merge uploaded/deleted materials into the modules cache (no full page refetch). */
  onLessonMaterialsChange,
}) {
  const [workspaceTab, setWorkspaceTab] = useState(0);
  const [duration, setDuration] = useState('');
  const [lessonPreview, setLessonPreview] = useState(false);
  const [shortDescriptionHtml, setShortDescriptionHtml] = useState('');
  const [lessonContentHtml, setLessonContentHtml] = useState('');

  /** Bump TipTap `--contentRevision` when catalog data changes (save + `/modules` refresh, etc.). */
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

  const materialStandaloneLessonPublicId = useMemo(() => {
    if (
      liveLessonAuthoring?.standaloneLessonPublicId != null &&
      String(liveLessonAuthoring.standaloneLessonPublicId).trim() !== ''
    ) {
      return liveLessonAuthoring.standaloneLessonPublicId;
    }
    const id = lesson?.id;
    if (
      typeof id !== 'string' ||
      (lesson?.type !== 'document' && lesson?.type !== 'video') ||
      id.endsWith('-core')
    ) {
      return null;
    }
    return id;
  }, [lesson?.id, lesson?.type, liveLessonAuthoring?.standaloneLessonPublicId]);

  useEffect(() => {
    setWorkspaceTab(0);
  }, [lesson.id, lesson.type]);

  useLayoutEffect(() => {
    if (!saveLiveRichLesson || !liveLessonAuthoring) {
      hydratedAuthoringKeyRef.current = '';
      setDuration('');
      setLessonPreview(false);
      setShortDescriptionHtml('');
      setLessonContentHtml('');
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

    setShortDescriptionHtml(String(liveLessonAuthoring.excerptHtml ?? '').trim());
    setLessonContentHtml(String(liveLessonAuthoring.bodyHtml ?? '').trim());
  }, [authoringTargetKey, lesson.id, lesson.type, saveLiveRichLesson, liveLessonAuthoring]);

  const persistLesson = useCallback(async () => {
    if (saveLiveRichLesson) {
      try {
        const normalizedMeta = normalizeLessonMetaForApi(
          {
            lessonPreview,
            unlockAfterPurchase: false,
            durationLabel: duration.trim(),
          },
          { durationLabelFallback: duration }
        );

        await saveLiveRichLesson({
          title: lesson.title,
          durationLabel: duration.trim(),
          shortDescriptionHtml,
          lessonContentHtml,
          lessonMeta: normalizedMeta,
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
    duration,
    lesson.id,
    lesson.title,
    lessonContentHtml,
    lessonPreview,
    onLessonSave,
    saveLiveRichLesson,
    shortDescriptionHtml,
  ]);

  return (
    <Box sx={(theme) => styles.root(theme)}>
      <TextLessonWorkspaceHeader
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
          <TextLessonWorkspaceSettings
            duration={duration}
            onDurationChange={setDuration}
            lessonPreview={lessonPreview}
            onLessonPreviewChange={setLessonPreview}
            showUnlockAfterPurchase={false}
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
            placeholder="Write the full lesson content…"
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
            lessonMaterials={liveLessonAuthoring?.lessonMaterials ?? []}
            apiConfigured={Boolean(CONFIG.serverUrl?.trim())}
            modulePublicId={materialModulePublicId}
            moduleResourcePublicId={
              liveLessonAuthoring?.isCoreLesson
                ? liveLessonAuthoring?.moduleLessonResourcePublicId ?? null
                : null
            }
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
        <Button variant="contained" color="primary" onClick={persistLesson} sx={styles.footerButton}>
          {saveLiveRichLesson ? 'Save lesson' : 'Create'}
        </Button>
      </Stack>
    </Box>
  );
}
