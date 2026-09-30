import { useRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { AnswerList } from '../curriculum-quiz-lesson-workspace/answer-list';
import { QuestionEditor } from '../curriculum-quiz-lesson-workspace/question-editor';
import { QuestionCardChrome } from '../curriculum-quiz-lesson-workspace/question-card-chrome';
import { QuestionCollapsedBar } from '../curriculum-quiz-lesson-workspace/question-collapsed-bar';
import { nid, createBlankQuestion } from '../curriculum-quiz-lesson-workspace/quiz-question-factory';

const noopDragRef = { current: null };

export function AssignmentQuestionsPanel({
  questions,
  onQuestionsChange,
  onCreate,
  createDisabled = false,
}) {
  const mainColumnRef = useRef(null);

  const patchQuestion = useCallback(
    (questionId, partial) => {
      onQuestionsChange?.(
        (Array.isArray(questions) ? questions : []).map((q) =>
          q.id === questionId ? { ...q, ...partial } : q
        )
      );
    },
    [onQuestionsChange, questions]
  );

  const handleAddQuestion = useCallback(() => {
    const list = Array.isArray(questions) ? questions : [];
    onQuestionsChange?.([
      ...list.map((q) => ({ ...q, collapsed: true })),
      { ...createBlankQuestion(), collapsed: false },
    ]);
  }, [onQuestionsChange, questions]);

  const handleDeleteQuestion = useCallback(
    (questionId) => {
      const list = Array.isArray(questions) ? questions : [];
      if (list.length <= 1) {
        toast.warning('Add another question before removing this one.');
        return;
      }
      onQuestionsChange?.(list.filter((q) => q.id !== questionId));
    },
    [onQuestionsChange, questions]
  );

  const handleAnswerText = useCallback(
    (questionId, answerId, text) => {
      onQuestionsChange?.(
        (Array.isArray(questions) ? questions : []).map((q) =>
          q.id !== questionId
            ? q
            : { ...q, answers: q.answers.map((a) => (a.id === answerId ? { ...a, text } : a)) }
        )
      );
    },
    [onQuestionsChange, questions]
  );

  const handleAddAnswer = useCallback(
    (questionId) => {
      onQuestionsChange?.(
        (Array.isArray(questions) ? questions : []).map((q) => {
          if (q.id !== questionId) {
            return q;
          }
          const text = q.newAnswerDraft.trim();
          if (!text) {
            return q;
          }
          return {
            ...q,
            answers: [...q.answers, { id: nid(), text }],
            newAnswerDraft: '',
          };
        })
      );
    },
    [onQuestionsChange, questions]
  );

  const rows = Array.isArray(questions) ? questions : [];
  const allQuestionsCollapsed = rows.length > 0 && rows.every((question) => question.collapsed);

  const handleToggleAllQuestionsCollapsed = useCallback(() => {
    onQuestionsChange?.((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const shouldCollapse = list.some((q) => !q.collapsed);
      return list.map((q) => ({ ...q, collapsed: shouldCollapse }));
    });
  }, [onQuestionsChange]);

  return (
    <>
      <Box sx={styles.questionsToolbar}>
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
      </Box>

      <Box ref={mainColumnRef} sx={styles.questionsColumn}>
        {rows.map((q) => (
          <Box key={q.id} sx={styles.card}>
            {q.collapsed ? (
              <QuestionCollapsedBar
                questionText={q.questionText}
                collapsed={q.collapsed}
                onToggleCollapse={() => patchQuestion(q.id, { collapsed: !q.collapsed })}
                onDelete={() => handleDeleteQuestion(q.id)}
                dragHandleRef={noopDragRef}
              />
            ) : (
              <>
                <QuestionCardChrome
                  collapsed={q.collapsed}
                  onToggleCollapse={() => patchQuestion(q.id, { collapsed: !q.collapsed })}
                  onDelete={() => handleDeleteQuestion(q.id)}
                  dragHandleRef={noopDragRef}
                />
                <QuestionEditor
                  questionText={q.questionText}
                  onQuestionTextChange={(html) => patchQuestion(q.id, { questionText: html })}
                />
                <AnswerList
                  embedded
                  answers={q.answers}
                  correctAnswerId={q.correctAnswerId}
                  onAnswerTextChange={(answerId, text) => handleAnswerText(q.id, answerId, text)}
                  onCorrectChange={(correctAnswerId) => patchQuestion(q.id, { correctAnswerId })}
                  newAnswerDraft={q.newAnswerDraft}
                  onNewAnswerDraftChange={(newAnswerDraft) =>
                    patchQuestion(q.id, { newAnswerDraft })
                  }
                  onAddAnswer={() => handleAddAnswer(q.id)}
                />
              </>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={styles.questionsFooter}>
        <span />
        <Box sx={styles.footerCenter}>
          <Button
            variant="contained"
            color="primary"
            sx={styles.footerBtn}
            onClick={handleAddQuestion}
            endIcon={<Iconify icon="solar:alt-arrow-down-linear" width={18} />}
          >
            + Question
          </Button>
        </Box>
        <Box sx={styles.footerEnd}>
          <Button
            variant="contained"
            color="primary"
            sx={{ ...styles.footerBtn, width: { xs: 1, sm: 'auto' } }}
            onClick={onCreate}
            disabled={createDisabled}
          >
            Create
          </Button>
        </Box>
      </Box>
    </>
  );
}
