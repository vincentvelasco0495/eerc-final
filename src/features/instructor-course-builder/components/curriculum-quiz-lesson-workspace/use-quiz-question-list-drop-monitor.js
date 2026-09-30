import { useCallback, useLayoutEffect } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';

import { isQuizQuestionDndData } from './quiz-question-dnd';

function isInvalidOrSameIndex(fromIndex, toIndex) {
  return fromIndex < 0 || toIndex < 0 || fromIndex === toIndex;
}

export function useQuizQuestionListDropMonitor({ listRef, onReorder }) {
  const handleDrop = useCallback(
    ({ source, location }) => {
      const dropTarget = location.current.dropTargets[0];
      if (!dropTarget) return;

      const sourceData = source.data;
      const targetData = dropTarget.data;
      if (!isQuizQuestionDndData(sourceData) || !isQuizQuestionDndData(targetData)) return;

      onReorder((list) => {
        const sourceIndex = list.findIndex((q) => q.id === sourceData.item.id);
        const targetIndex = list.findIndex((q) => q.id === targetData.item.id);
        if (isInvalidOrSameIndex(sourceIndex, targetIndex)) return list;

        return reorderWithEdge({
          axis: 'vertical',
          list,
          startIndex: sourceIndex,
          indexOfTarget: targetIndex,
          closestEdgeOfTarget: extractClosestEdge(targetData),
        });
      });
    },
    [onReorder]
  );

  useLayoutEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return undefined;

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isQuizQuestionDndData(source.data),
        onDrop: handleDrop,
      }),
      autoScrollForElements({
        element: listEl,
        canScroll: ({ source }) => isQuizQuestionDndData(source.data),
        getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
      })
    );
  }, [handleDrop, listRef]);
}
