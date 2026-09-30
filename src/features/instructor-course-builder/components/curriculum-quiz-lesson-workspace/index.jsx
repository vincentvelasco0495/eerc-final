import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { CONFIG } from 'src/global-config';
import {
  getLmsAxiosErrorMessage,
  postLessonMaterialForModule,
} from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { QuizTabs } from './quiz-tabs';
import { AnswerList } from './answer-list';
import { QuizHeader } from './quiz-header';
import { FooterActions } from './footer-actions';
import { QuestionEditor } from './question-editor';
import { QuestionSettings } from './question-settings';
import { QuizSettingsPanel } from './quiz-settings-panel';
import { QuestionCardChrome } from './question-card-chrome';
import { QuestionCollapsedBar } from './question-collapsed-bar';
import { isQuizPdfAsset } from '../../utils/quiz-pdf-constants';
import { peekQuizPdfPageCount } from '../../utils/split-quiz-pdf';
import { QuizPdfItemCountDialog } from './quiz-pdf-item-count-dialog';
import { QuizQuestionSortableItem } from './quiz-question-sortable-item';
import { normalizeUploadedLessonMaterial } from '../../utils/lesson-materials-cache';
import { useQuizQuestionListDropMonitor } from './use-quiz-question-list-drop-monitor';
import {
  nid,
  createDemoQuestion,
  answersToLetterChoices,
  createBlankQuizQuestion,
  createImportedPdfQuestion,
  isPlaceholderQuizQuestion,
  DEFAULT_IMAGE_QUESTION_PROMPT,
} from './quiz-question-factory';

function readImageMaterialId(q, primaryKey, legacyKey) {
  const primary = typeof q?.[primaryKey] === 'string' ? q[primaryKey].trim() : '';
  if (primary) return primary;
  if (legacyKey && typeof q?.[legacyKey] === 'string' && q[legacyKey].trim() !== '') {
    return q[legacyKey].trim();
  }
  return null;
}

function normalizeLoadedQuizQuestions(rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) {
    return [createDemoQuestion()];
  }
  return list.map((q) => {
    const optionsRaw = Array.isArray(q?.options)
      ? q.options
      : Array.isArray(q?.choices)
        ? q.choices.map((label) => ({ label, isCorrect: false }))
        : [];
    const answers = optionsRaw.map((opt) => ({
      id: typeof opt?.id === 'string' ? opt.id : nid(),
      text: String(opt?.label ?? ''),
      isCorrect: Boolean(opt?.isCorrect),
    }));
    const fallbackId = answers[0]?.id ?? nid();
    const correct = answers.find((a) => a.isCorrect)?.id ?? fallbackId;
    const letters = answersToLetterChoices(answers, correct);
    const rawPrompt = typeof q?.prompt === 'string' ? q.prompt : '';
    const plainPrompt = rawPrompt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const questionText =
      plainPrompt.toLowerCase() === DEFAULT_IMAGE_QUESTION_PROMPT.toLowerCase() ? '' : rawPrompt;
    const questionType =
      q?.questionType === 'simulation_diagram' ? 'simulation_diagram' : 'single_choice';
    const problemImageName =
      typeof q?.problemImageName === 'string'
        ? q.problemImageName
        : typeof q?.diagramName === 'string'
          ? q.diagramName
          : null;
    const itemNumberRaw = Number(q?.itemNumber);
    const itemNumber = Number.isInteger(itemNumberRaw) && itemNumberRaw > 0 ? itemNumberRaw : null;
    const matchItem = String(problemImageName ?? '').match(/^Item\s+(\d+)$/i);
    const resolvedItemNumber = itemNumber ?? (matchItem ? Number(matchItem[1]) : null);

    return {
      id: typeof q?.id === 'string' ? q.id : nid(),
      collapsed: true,
      questionText,
      questionType,
      required: Boolean(q?.required),
      problemImageMaterialPublicId: readImageMaterialId(
        q,
        'problemImageMaterialPublicId',
        'diagramMaterialPublicId'
      ),
      problemImagePreviewUrl:
        typeof q?.problemImageUrl === 'string'
          ? q.problemImageUrl
          : typeof q?.diagramUrl === 'string'
            ? q.diagramUrl
            : null,
      problemImageName: resolvedItemNumber ? `Item ${resolvedItemNumber}` : problemImageName,
      problemImageMime: typeof q?.problemImageMime === 'string' ? q.problemImageMime : null,
      itemNumber: resolvedItemNumber,
      solutionImageMaterialPublicId: readImageMaterialId(q, 'solutionImageMaterialPublicId'),
      solutionImagePreviewUrl: typeof q?.solutionImageUrl === 'string' ? q.solutionImageUrl : null,
      solutionImageName: typeof q?.solutionImageName === 'string' ? q.solutionImageName : null,
      answers: letters.answers,
      correctAnswerId: letters.correctAnswerId,
      newAnswerDraft: '',
    };
  });
}

function promptForSave(questionText) {
  const text = String(questionText ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || DEFAULT_IMAGE_QUESTION_PROMPT;
}

function toPersistedQuizQuestions(questions) {
  return (Array.isArray(questions) ? questions : [])
    .map((q) => {
      const problemImageMaterialPublicId =
        typeof q?.problemImageMaterialPublicId === 'string' && q.problemImageMaterialPublicId.trim() !== ''
          ? q.problemImageMaterialPublicId.trim()
          : null;
      const letters = answersToLetterChoices(q?.answers, q?.correctAnswerId);
      const itemFromName = String(q?.problemImageName ?? '').match(/^Item\s+(\d+)$/i);
      const itemNumberRaw = Number(q?.itemNumber ?? itemFromName?.[1]);
      const itemNumber = Number.isInteger(itemNumberRaw) && itemNumberRaw > 0 ? itemNumberRaw : null;

      return {
        prompt: promptForSave(q?.questionText),
        questionType: 'single_choice',
        required: Boolean(q?.required),
        problemImageMaterialPublicId,
        solutionImageMaterialPublicId: null,
        itemNumber,
        choices: letters.answers.map((a) => ({
          label: a.text,
          isCorrect: String(a.id) === String(letters.correctAnswerId),
        })),
      };
    })
    .filter((q) => Boolean(q.problemImageMaterialPublicId) && q.choices.length === 4);
}

export function CurriculumQuizLessonWorkspace({
  lesson,
  onLessonTitleChange,
  onLessonSave,
  liveQuizLoader,
  saveLiveQuizLesson,
  liveQuizAuthoring,
  saveLiveQuizSettings,
  quizModulePublicId = null,
  onLessonMaterialsChange,
}) {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState(() => [createDemoQuestion()]);
  const [savingLive, setSavingLive] = useState(false);
  const [savingQuizSettings, setSavingQuizSettings] = useState(false);
  const [imageUploadingByQuestionId, setImageUploadingByQuestionId] = useState({});
  const [pdfImport, setPdfImport] = useState(null);
  const [pdfDraft, setPdfDraft] = useState(null);
  const mainColumnRef = useRef(null);
  const quizSettingsPanelRef = useRef(null);

  useEffect(() => {
    setActiveTab('questions');
    setPdfDraft(null);
  }, [lesson.id]);

  useEffect(() => {
    let alive = true;

    if (typeof liveQuizLoader !== 'function') {
      setQuestions([createDemoQuestion()]);
      return () => {
        alive = false;
      };
    }

    void (async () => {
      try {
        const rows = await liveQuizLoader(lesson.id);
        if (alive) {
          setQuestions(normalizeLoadedQuizQuestions(rows));
        }
      } catch {
        if (alive) {
          setQuestions([createDemoQuestion()]);
          toast.error('Could not load quiz questions.');
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [lesson.id, liveQuizLoader]);

  const reorderQuestions = useCallback((updateList) => {
    setQuestions((prev) => updateList(prev));
  }, []);

  useQuizQuestionListDropMonitor({ listRef: mainColumnRef, onReorder: reorderQuestions });

  const saveQuizNow = useCallback(async () => {
    const missingImage = questions.some(
      (q) =>
        !(
          typeof q.problemImageMaterialPublicId === 'string' &&
          q.problemImageMaterialPublicId.trim() !== ''
        )
    );
    if (missingImage) {
      toast.warning('Upload a question image for each question before saving.');
      return;
    }

    if (typeof saveLiveQuizLesson === 'function') {
      setSavingLive(true);
      try {
        const payloadQuestions = toPersistedQuizQuestions(questions);
        await saveLiveQuizLesson({
          quizId: lesson.id,
          title: lesson.title,
          questions: payloadQuestions,
        });
        onLessonSave?.(lesson.id);
        toast.success(`Quiz “${lesson.title}” saved.`);
      } finally {
        setSavingLive(false);
      }
      return;
    }

    onLessonSave?.(lesson.id);
    toast.success(`Quiz “${lesson.title}” saved (demo).`);
  }, [lesson.id, lesson.title, onLessonSave, questions, saveLiveQuizLesson]);

  const handleHeaderSave = useCallback(() => {
    if (activeTab === 'settings') {
      void quizSettingsPanelRef.current?.save?.();
      return;
    }
    void saveQuizNow();
  }, [activeTab, saveQuizNow]);

  const saveLiveQuizSettingsForPanel = useMemo(() => {
    if (typeof saveLiveQuizSettings !== 'function') {
      return undefined;
    }
    return async (settingsPayload) => {
      await saveLiveQuizSettings({
        quizId: lesson.id,
        title: lesson.title,
        ...settingsPayload,
      });
    };
  }, [lesson.id, lesson.title, saveLiveQuizSettings]);

  const handleFooterSave = useCallback(() => {
    void saveQuizNow();
  }, [saveQuizNow]);

  const handleAddQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev.map((q) => ({ ...q, collapsed: true })),
      { ...createBlankQuizQuestion(), collapsed: false },
    ]);
  }, []);

  const importQuestionsFromPdf = useCallback(
    async (file, itemCount) => {
      if (!CONFIG.serverUrl?.trim()) {
        toast.error(
          'Set VITE_SERVER_URL to your Laravel app origin (e.g. http://127.0.0.1:8000) and restart the dev server.'
        );
        return;
      }
      if (!quizModulePublicId) {
        toast.error('Select a quiz lesson in your course curriculum before importing a PDF.');
        return;
      }

      setPdfImport({ phase: 'uploading', current: 1, total: 1 });
      try {
        const payload = await postLessonMaterialForModule(quizModulePublicId, file, {
          usage: 'quiz_question_image',
        });
        const material = normalizeUploadedLessonMaterial(payload);
        if (!material?.id) {
          toast.error('Upload succeeded but the server did not return a file id.');
          return;
        }

        const previewUrl = material.fileUrl ?? material.inlineFileUrl ?? null;
        setQuestions((prev) => {
          const keep = prev.filter((q) => !isPlaceholderQuizQuestion(q));
          const imported = Array.from({ length: itemCount }, (_, index) =>
            createImportedPdfQuestion({
              materialPublicId: material.id,
              previewUrl,
              itemNumber: index + 1,
              collapsed: index !== 0,
            })
          );
          return [...keep, ...imported];
        });

        toast.success(
          `Created ${itemCount} items with the full PDF on each. Mark the correct letter on each, then Save.`
        );
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, err?.message || 'Could not import that PDF.'));
      } finally {
        setPdfImport(null);
      }
    },
    [quizModulePublicId]
  );

  const handlePickPdf = useCallback(
    async (file) => {
      if (!CONFIG.serverUrl?.trim()) {
        toast.error(
          'Set VITE_SERVER_URL to your Laravel app origin (e.g. http://127.0.0.1:8000) and restart the dev server.'
        );
        return;
      }
      if (!quizModulePublicId) {
        toast.error('Select a quiz lesson in your course curriculum before importing a PDF.');
        return;
      }

      setPdfImport({ phase: 'reading', current: 0, total: 1 });
      try {
        const pageCount = await peekQuizPdfPageCount(file);
        setPdfDraft({
          file,
          pageCount,
          fileName: file.name,
        });
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, err?.message || 'Could not read that PDF.'));
      } finally {
        setPdfImport(null);
      }
    },
    [quizModulePublicId]
  );

  const handleConfirmPdfItemCount = useCallback(
    (itemCount) => {
      const draft = pdfDraft;
      setPdfDraft(null);
      if (!draft?.file) {
        return;
      }
      void importQuestionsFromPdf(draft.file, itemCount);
    },
    [importQuestionsFromPdf, pdfDraft]
  );

  const patchQuestion = useCallback((questionId, partial) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, ...partial } : q))
    );
  }, []);

  const handleDeleteQuestion = useCallback((questionId) => {
    setQuestions((prev) => {
      if (prev.length <= 1) {
        toast.warning('Add another question before removing this one.');
        return prev;
      }
      return prev.filter((q) => q.id !== questionId);
    });
  }, []);

  const allQuestionsCollapsed =
    questions.length > 0 && questions.every((question) => question.collapsed);

  const handleToggleAllQuestionsCollapsed = useCallback(() => {
    setQuestions((prev) => {
      const shouldCollapse = prev.some((q) => !q.collapsed);
      return prev.map((q) => ({ ...q, collapsed: shouldCollapse }));
    });
  }, []);

  return (
    <Box sx={styles.root}>
      <QuizHeader
        title={lesson.title}
        onTitleChange={(title) => onLessonTitleChange?.(lesson.id, title)}
        onSave={handleHeaderSave}
        saveDisabled={activeTab === 'settings' ? savingQuizSettings : savingLive || Boolean(pdfImport)}
      />

      <Box sx={styles.tabsRow}>
        <QuizTabs activeTab={activeTab} onTabChange={setActiveTab} questionCount={questions.length} />
        {activeTab === 'questions' ? (
          <Box sx={styles.tabActions}>
            <IconButton
              sx={styles.listIconBtn}
              aria-label={allQuestionsCollapsed ? 'Expand all questions' : 'Collapse all questions'}
              aria-expanded={!allQuestionsCollapsed}
              size="small"
              onClick={handleToggleAllQuestionsCollapsed}
            >
              <Iconify
                icon={allQuestionsCollapsed ? 'solar:double-alt-arrow-down-linear' : 'solar:list-linear'}
                width={22}
              />
            </IconButton>
            <Button variant="outlined" sx={styles.libraryBtn} onClick={() => toast.info('Questions library (demo).')}>
              Questions library
            </Button>
          </Box>
        ) : (
          <Box sx={{ minWidth: { xs: 0, sm: 40 } }} aria-hidden />
        )}
      </Box>

      {activeTab === 'questions' ? (
        <>
          <Box ref={mainColumnRef} sx={styles.mainColumn}>
            {questions.map((q) => (
              <QuizQuestionSortableItem
                key={q.id}
                questionId={q.id}
                chromeSurface={q.collapsed ? 'collapsed' : 'expanded'}
              >
                {({ dragHandleRef }) => (
                  <Box sx={styles.card}>
                    {q.collapsed ? (
                      <QuestionCollapsedBar
                        questionText={q.questionText}
                        imageName={q.problemImageName}
                        collapsed={q.collapsed}
                        onToggleCollapse={() => patchQuestion(q.id, { collapsed: !q.collapsed })}
                        onDelete={() => handleDeleteQuestion(q.id)}
                        dragHandleRef={dragHandleRef}
                      />
                    ) : (
                      <>
                        <QuestionCardChrome
                          collapsed={q.collapsed}
                          onToggleCollapse={() => patchQuestion(q.id, { collapsed: !q.collapsed })}
                          onDelete={() => handleDeleteQuestion(q.id)}
                          dragHandleRef={dragHandleRef}
                        />
                        <QuestionSettings
                          required={q.required}
                          onRequiredChange={(required) => patchQuestion(q.id, { required })}
                        />
                        <QuestionEditor
                          mode="image"
                          questionText={q.questionText}
                          onQuestionTextChange={(html) => patchQuestion(q.id, { questionText: html })}
                          modulePublicId={quizModulePublicId}
                          problemImageMaterialPublicId={q.problemImageMaterialPublicId}
                          problemImagePreviewUrl={q.problemImagePreviewUrl}
                          problemImageName={q.problemImageName}
                          problemImageMime={q.problemImageMime}
                          skipMaterialDelete={
                            Boolean(q.problemImageMaterialPublicId) &&
                            questions.filter(
                              (row) =>
                                row.problemImageMaterialPublicId === q.problemImageMaterialPublicId
                            ).length > 1
                          }
                          imageUploadingSlot={imageUploadingByQuestionId[q.id] ?? null}
                          onImageUploadingSlotChange={(slot) =>
                            setImageUploadingByQuestionId((prev) => {
                              if (!slot) {
                                const next = { ...prev };
                                delete next[q.id];
                                return next;
                              }
                              return { ...prev, [q.id]: slot };
                            })
                          }
                          onProblemImageChange={({ materialPublicId, previewUrl, fileName, mime }) => {
                            const nextMime = mime ?? null;
                            const nextIsPdf = isQuizPdfAsset({
                              mime: nextMime,
                              fileName,
                              url: previewUrl,
                            });
                            const keepItem = Boolean(nextIsPdf && q.itemNumber);
                            patchQuestion(q.id, {
                              problemImageMaterialPublicId: materialPublicId,
                              problemImagePreviewUrl: previewUrl,
                              problemImageName: keepItem ? `Item ${q.itemNumber}` : fileName,
                              problemImageMime: nextMime,
                              itemNumber: keepItem ? q.itemNumber : null,
                            });
                          }}
                          onAfterMaterialsChange={onLessonMaterialsChange}
                        />
                        <AnswerList
                          embedded
                          letterMode
                          answers={q.answers}
                          correctAnswerId={q.correctAnswerId}
                          onCorrectChange={(correctAnswerId) => patchQuestion(q.id, { correctAnswerId })}
                        />
                      </>
                    )}
                  </Box>
                )}
              </QuizQuestionSortableItem>
            ))}
          </Box>

          {pdfImport ? (
            <Box sx={styles.importProgress}>
              <Typography component="span" sx={styles.importProgressLabel}>
                {pdfImport.phase === 'uploading' ? 'Uploading PDF…' : 'Reading PDF…'}
              </Typography>
              <LinearProgress
                variant={pdfImport.phase === 'uploading' ? 'indeterminate' : 'determinate'}
                value={
                  pdfImport.total > 0
                    ? Math.min(100, Math.round((pdfImport.current / pdfImport.total) * 100))
                    : 0
                }
              />
            </Box>
          ) : null}

          <FooterActions
            onAddQuestion={handleAddQuestion}
            onImportPdf={(file) => void handlePickPdf(file)}
            onSave={handleFooterSave}
            saveDisabled={savingLive}
            importDisabled={Boolean(pdfImport) || savingLive || Boolean(pdfDraft)}
          />
          <QuizPdfItemCountDialog
            open={Boolean(pdfDraft)}
            fileName={pdfDraft?.fileName ?? ''}
            pageCount={pdfDraft?.pageCount ?? null}
            onCancel={() => setPdfDraft(null)}
            onConfirm={handleConfirmPdfItemCount}
          />
        </>
      ) : (
        <QuizSettingsPanel
          ref={quizSettingsPanelRef}
          lesson={lesson}
          liveAuthoring={liveQuizAuthoring}
          saveLiveQuizSettings={saveLiveQuizSettingsForPanel}
          onLessonSave={onLessonSave}
          onSavingChange={setSavingQuizSettings}
        />
      )}
    </Box>
  );
}
