import { useEditorState } from '@tiptap/react';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TINYMCE } from './tinymce-theme';
import { TinyMcePathStrip } from './tinymce-status-bar';

const CONTENT_BOTTOM_PAD = 28;

function TinyMceWordCount({ editor }) {
  const { words } = useEditorState({
    editor,
    selector: (ctx) => {
      const text = ctx.editor.getText();
      const w = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      return { words: w };
    },
  });

  if (!editor) return null;

  return (
    <Typography
      component="span"
      variant="caption"
      className="tinymce-word-count"
      sx={{
        position: 'absolute',
        right: 28,
        bottom: 6,
        zIndex: 2,
        pointerEvents: 'none',
        color: 'text.secondary',
        fontSize: '0.7rem',
        lineHeight: 1.2,
      }}
    >
      {words} {words === 1 ? 'word' : 'words'}
    </Typography>
  );
}

function TinyMceResizeHandle({ onResizeStart, disabled }) {
  if (disabled) return null;

  return (
    <Box
      component="span"
      className="tinymce-resize-handle"
      role="presentation"
      onMouseDown={onResizeStart}
      sx={(theme) => ({
        position: 'absolute',
        right: 8,
        bottom: 6,
        zIndex: 3,
        width: 12,
        height: 12,
        cursor: 'nwse-resize',
        opacity: 0.6,
        flexShrink: 0,
        '&:hover': { opacity: 1 },
        background: `repeating-linear-gradient(
          -45deg,
          ${theme.vars.palette.text.secondary},
          ${theme.vars.palette.text.secondary} 0.5px,
          transparent 0.5px,
          transparent 3px
        )`,
      })}
    />
  );
}

/** Bottom chrome: document area (scroll) + resize + word count; path strip below. */
export function TinyMceEditorPanel({
  editor,
  children,
  mainSlot,
  resizeBounds = { min: 150, max: 600 },
  fullscreen = false,
}) {
  const wrapperRef = useRef(null);
  const [docHeight, setDocHeight] = useState(null);
  const [resizing, setResizing] = useState(false);
  const dragRef = useRef({ startY: 0, startHeight: 0 });

  const endResize = useCallback(() => {
    setResizing(false);
    document.body.style.userSelect = '';
  }, []);

  const onResizeMove = useCallback(
    (event) => {
      const { startY, startHeight } = dragRef.current;
      const next = Math.round(startHeight + (event.clientY - startY));
      const h = Math.min(resizeBounds.max, Math.max(resizeBounds.min, next));
      setDocHeight(h);
    },
    [resizeBounds.max, resizeBounds.min]
  );

  const onResizeUp = useCallback(() => {
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', onResizeUp);
    endResize();
  }, [endResize, onResizeMove]);

  const onResizeStart = useCallback(
    (event) => {
      if (fullscreen) return;
      event.preventDefault();
      event.stopPropagation();
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const current = docHeight ?? rect.height;
      dragRef.current = { startY: event.clientY, startHeight: current };
      setResizing(true);
      document.body.style.userSelect = 'none';

      window.addEventListener('mousemove', onResizeMove);
      window.addEventListener('mouseup', onResizeUp);
    },
    [docHeight, fullscreen, onResizeMove, onResizeUp]
  );

  useEffect(
    () => () => {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeUp);
      document.body.style.userSelect = '';
    },
    [onResizeMove, onResizeUp]
  );

  useEffect(() => {
    if (fullscreen) {
      setDocHeight(null);
    }
  }, [fullscreen]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: TINYMCE.chromeSurface,
        overflow: 'hidden',
      }}
    >
      {children}

      <Box
        ref={wrapperRef}
        className="tinymce-editor-document-wrapper"
        sx={{
          position: 'relative',
          flex: docHeight != null ? '0 0 auto' : '1 1 auto',
          minHeight: docHeight != null ? resizeBounds.min : 0,
          height: docHeight != null ? docHeight : undefined,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: resizing ? 'none' : 'height 0.15s ease-out',
        }}
      >
        <Box
          className="tinymce-editor-scroll-area"
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            pb: `${CONTENT_BOTTOM_PAD}px`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {mainSlot}
        </Box>

        <TinyMceWordCount editor={editor} />
        <TinyMceResizeHandle onResizeStart={onResizeStart} disabled={fullscreen} />
      </Box>

      <TinyMcePathStrip editor={editor} />
    </Box>
  );
}
