import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';

import { styles } from './styles';
import { AssignmentTabs } from './assignment-tabs';
import { AssignmentHeader } from './assignment-header';
import { AssignmentSettingsPanel } from './assignment-settings-panel';
import { AssignmentQuestionsPanel } from './assignment-questions-panel';
import { createBlankQuestion } from '../curriculum-quiz-lesson-workspace/quiz-question-factory';
import {
  toPersistedAssignmentQuestions,
  normalizeLoadedAssignmentQuestions,
} from './assignment-payload-utils';

function mapApiMaterials(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    id: row.id,
    name: row.name,
    sizeBytes: row.sizeBytes,
    file: null,
  }));
}

export function CurriculumAssignmentLessonWorkspace({
  lesson,
  onLessonTitleChange,
  onLessonSave,
  liveAssignmentAuthoring = null,
  liveAssignmentLoader,
  saveLiveAssignment,
  uploadAssignmentMaterial,
  onAssignmentMaterialsChange,
}) {
  const [activeTab, setActiveTab] = useState('assignment');
  const [attemptsAllowed, setAttemptsAllowed] = useState(2);
  const [duration, setDuration] = useState(10);
  const [timeUnit, setTimeUnit] = useState('hours');
  const [resetTimeLimitOnRetake, setResetTimeLimitOnRetake] = useState(false);
  const [lessonPreview, setLessonPreview] = useState(false);
  const [contentHtml, setContentHtml] = useState('');
  const [materials, setMaterials] = useState([]);
  const [questions, setQuestions] = useState(() => [{ ...createBlankQuestion(), collapsed: false }]);
  const [saving, setSaving] = useState(false);
  const [materialsBusy, setMaterialsBusy] = useState(false);

  const isLiveAssignment = typeof saveLiveAssignment === 'function';

  useEffect(() => {
    setActiveTab('assignment');
  }, [lesson.id]);

  useEffect(() => {
    if (!liveAssignmentAuthoring) {
      setAttemptsAllowed(2);
      setDuration(10);
      setTimeUnit('hours');
      setResetTimeLimitOnRetake(false);
      setLessonPreview(false);
      setContentHtml('');
      setMaterials([]);
      setQuestions([{ ...createBlankQuestion(), collapsed: false }]);
      return;
    }

    setAttemptsAllowed(Number(liveAssignmentAuthoring.attemptsAllowed) || 1);
    setDuration(Number(liveAssignmentAuthoring.duration) || 0);
    setTimeUnit(liveAssignmentAuthoring.timeUnit === 'hours' ? 'hours' : 'minutes');
    setResetTimeLimitOnRetake(Boolean(liveAssignmentAuthoring.resetTimeLimitOnRetake));
    setLessonPreview(Boolean(liveAssignmentAuthoring.lessonPreview));
    setContentHtml(String(liveAssignmentAuthoring.lessonContentHtml ?? ''));
    setMaterials(mapApiMaterials(liveAssignmentAuthoring.materials));
  }, [lesson.id, liveAssignmentAuthoring]);

  useEffect(() => {
    if (typeof liveAssignmentLoader !== 'function') {
      setQuestions([{ ...createBlankQuestion(), collapsed: false }]);
      return undefined;
    }

    let alive = true;
    void (async () => {
      try {
        const rows = await liveAssignmentLoader(lesson.id);
        if (alive) {
          setQuestions(normalizeLoadedAssignmentQuestions(rows));
        }
      } catch {
        if (alive) {
          setQuestions([{ ...createBlankQuestion(), collapsed: false }]);
          toast.error('Could not load assignment questions.');
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [lesson.id, liveAssignmentLoader]);

  const handleCreate = useCallback(async () => {
    const title = String(lesson.title ?? '').trim();
    if (!title) {
      toast.warning('Enter an assignment title before creating.');
      return;
    }

    const payloadQuestions = toPersistedAssignmentQuestions(questions);
    const bodyQuestions =
      payloadQuestions.length > 0 ? payloadQuestions : undefined;

    setSaving(true);
    try {
      if (isLiveAssignment) {
        await saveLiveAssignment({
          assignmentId: lesson.id,
          title,
          attemptsAllowed,
          duration,
          timeUnit,
          resetTimeLimitOnRetake,
          lessonPreview,
          lessonContentHtml: contentHtml,
          questions: bodyQuestions,
        });
      }

      onLessonSave?.(lesson.id);
      toast.success(`Assignment “${title}” saved.`);
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not save assignment.'));
    } finally {
      setSaving(false);
    }
  }, [
    attemptsAllowed,
    contentHtml,
    duration,
    isLiveAssignment,
    lesson.id,
    lesson.title,
    lessonPreview,
    onLessonSave,
    questions,
    resetTimeLimitOnRetake,
    saveLiveAssignment,
    timeUnit,
  ]);

  const handleMaterialsChange = useCallback(
    async (nextMaterials) => {
      if (typeof nextMaterials === 'function') {
        setMaterials(nextMaterials);
        return;
      }

      const prevIds = new Set((Array.isArray(materials) ? materials : []).map((m) => m.id));
      const nextRows = Array.isArray(nextMaterials) ? nextMaterials : [];
      const added = nextRows.filter((row) => row?.file instanceof File && !prevIds.has(row.id));

      if (!added.length || typeof uploadAssignmentMaterial !== 'function') {
        setMaterials(nextRows);
        return;
      }

      if (!CONFIG.serverUrl?.trim()) {
        toast.error('Set VITE_SERVER_URL to upload assignment materials.');
        return;
      }

      setMaterialsBusy(true);
      try {
        const uploaded = [];
        for (const row of added) {
          const response = await uploadAssignmentMaterial(row.file);
          const material = response?.data ?? response;
          if (material?.id) {
            uploaded.push({
              id: material.id,
              name: material.name ?? row.name,
              sizeBytes: material.sizeBytes ?? row.sizeBytes,
              file: null,
            });
          }
        }

        const merged = [
          ...nextRows.filter((row) => !(row?.file instanceof File)),
          ...uploaded,
        ];
        setMaterials(merged);
        onAssignmentMaterialsChange?.(merged);
        toast.success(`Uploaded ${uploaded.length === 1 ? 'file' : `${uploaded.length} files`}.`);
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, 'Could not upload assignment material.'));
      } finally {
        setMaterialsBusy(false);
      }
    },
    [materials, onAssignmentMaterialsChange, uploadAssignmentMaterial]
  );

  return (
    <Box sx={styles.root}>
      <AssignmentHeader
        title={lesson.title}
        onTitleChange={(title) => onLessonTitleChange?.(lesson.id, title)}
        onCreate={handleCreate}
        createDisabled={saving || materialsBusy}
      />

      <Box sx={styles.tabsRow}>
        <AssignmentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          questionCount={questions.length}
        />
      </Box>

      {activeTab === 'assignment' ? (
        <AssignmentSettingsPanel
          attemptsAllowed={attemptsAllowed}
          onAttemptsAllowedChange={setAttemptsAllowed}
          duration={duration}
          onDurationChange={setDuration}
          timeUnit={timeUnit}
          onTimeUnitChange={setTimeUnit}
          resetTimeLimitOnRetake={resetTimeLimitOnRetake}
          onResetTimeLimitOnRetakeChange={setResetTimeLimitOnRetake}
          lessonPreview={lessonPreview}
          onLessonPreviewChange={setLessonPreview}
          contentHtml={contentHtml}
          onContentHtmlChange={setContentHtml}
          materials={materials}
          onMaterialsChange={handleMaterialsChange}
          onCreate={handleCreate}
          createDisabled={saving || materialsBusy}
        />
      ) : (
        <AssignmentQuestionsPanel
          questions={questions}
          onQuestionsChange={setQuestions}
          onCreate={handleCreate}
          createDisabled={saving}
        />
      )}
    </Box>
  );
}
