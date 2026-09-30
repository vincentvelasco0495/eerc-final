import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import Box from '@mui/material/Box';

import {
  isQuizQuestionDndData,
  getQuizQuestionItemData,
  QUIZ_QUESTION_ITEM_ATTR,
} from './quiz-question-dnd';

function shallowEqualState(a, b) {
  if (a.type !== b.type) return false;
  if (a.type === 'over' && b.type === 'over') {
    return a.closestEdge === b.closestEdge;
  }
  return true;
}

/**
 * Wraps one question card; provides dragHandleRef for the chrome hamburger.
 * Children: ({ dragHandleRef, isDragging }) => ReactNode
 *
 * `chromeSurface` must change when the drag-handle DOM is recreated (e.g. collapsed ↔ expanded),
 * otherwise pragmatic-drag-and-drop keeps listening on detached nodes.
 */
export function QuizQuestionSortableItem({ questionId, chromeSurface = 'default', children }) {
  const itemRef = useRef(null);
  const dragHandleElRef = useRef(null);
  const [handleGeneration, setHandleGeneration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dropState, setDropState] = useState({ type: 'idle' });

  const setDropStateIfChanged = useCallback((next) => {
    setDropState((prev) => (shallowEqualState(prev, next) ? prev : next));
  }, []);

  const setDragHandleRef = useCallback((el) => {
    if (dragHandleElRef.current === el) return;
    dragHandleElRef.current = el;
    setHandleGeneration((g) => g + 1);
  }, []);

  useLayoutEffect(() => {
    const itemEl = itemRef.current;
    const dragHandleEl = dragHandleElRef.current;
    if (!itemEl || !dragHandleEl) return undefined;

    const dragItem = draggable({
      element: itemEl,
      dragHandle: dragHandleEl,
      getInitialData: () =>
        getQuizQuestionItemData({
          itemId: questionId,
          rect: itemEl.getBoundingClientRect(),
        }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => {
        setIsDragging(false);
        setDropState({ type: 'idle' });
      },
    });

    const dropItemTarget = dropTargetForElements({
      element: itemEl,
      getIsSticky: () => true,
      canDrop: ({ source }) =>
        isQuizQuestionDndData(source.data) && source.element !== itemEl,
      getData: ({ input }) => {
        const userData = getQuizQuestionItemData({
          itemId: questionId,
          rect: itemEl.getBoundingClientRect(),
        });
        return attachClosestEdge(userData, {
          element: itemEl,
          input,
          allowedEdges: ['top', 'bottom'],
        });
      },
      onDrag: ({ source, self }) => {
        const sourceData = source.data;
        if (!isQuizQuestionDndData(sourceData) || sourceData.item.id === questionId) return;

        const closestEdge = extractClosestEdge(self.data);
        if (!closestEdge) return;

        setDropStateIfChanged({
          type: 'over',
          closestEdge,
        });
      },
      onDragEnter: ({ source, self }) => {
        const sourceData = source.data;
        if (!isQuizQuestionDndData(sourceData) || sourceData.item.id === questionId) return;

        const closestEdge = extractClosestEdge(self.data);
        if (!closestEdge) return;

        setDropStateIfChanged({
          type: 'over',
          closestEdge,
        });
      },
      onDragLeave: ({ source }) => {
        if (!isQuizQuestionDndData(source.data)) return;
        const isSelf = source.data.item.id === questionId;
        setDropStateIfChanged({ type: isSelf ? 'draggingLeftSelf' : 'idle' });
      },
      onDrop: () => setDropState({ type: 'idle' }),
    });

    return combine(dragItem, dropItemTarget);
  }, [questionId, chromeSurface, handleGeneration, setDropStateIfChanged]);

  const showTopLine = dropState.type === 'over' && dropState.closestEdge === 'top';
  const showBottomLine = dropState.type === 'over' && dropState.closestEdge === 'bottom';

  return (
    <Box
      ref={itemRef}
      {...{ [QUIZ_QUESTION_ITEM_ATTR]: questionId }}
      sx={{
        position: 'relative',
        minWidth: 0,
        maxWidth: '100%',
        opacity: isDragging ? 0.55 : 1,
        transition: 'opacity 0.12s ease',
      }}
    >
      {showTopLine ? (
        <Box
          sx={{
            position: 'absolute',
            top: -5,
            left: 8,
            right: 8,
            height: 3,
            borderRadius: 1,
            bgcolor: 'primary.main',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {children({ dragHandleRef: setDragHandleRef, isDragging })}
      {showBottomLine ? (
        <Box
          sx={{
            position: 'absolute',
            bottom: -5,
            left: 8,
            right: 8,
            height: 3,
            borderRadius: 1,
            bgcolor: 'primary.main',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </Box>
  );
}
