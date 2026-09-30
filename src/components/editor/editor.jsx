import { debounce } from 'es-toolkit';
import { common, createLowlight } from 'lowlight';
import { mergeClasses } from 'minimal-shared/utils';
import ImageExtension from '@tiptap/extension-image';
import StarterKitExtension from '@tiptap/starter-kit';
import { Subscript } from '@tiptap/extension-subscript';
import { Underline } from '@tiptap/extension-underline';
import { Superscript } from '@tiptap/extension-superscript';
import TextAlignExtension from '@tiptap/extension-text-align';
import { Placeholder as PlaceholderExtension } from '@tiptap/extensions';
import { TextStyleKit } from '@tiptap/extension-text-style/text-style-kit';
import CodeBlockLowlightExtension from '@tiptap/extension-code-block-lowlight';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import FormHelperText from '@mui/material/FormHelperText';

import { EditorRoot } from './styles';
import { editorClasses } from './classes';
import { Toolbar } from './components/toolbar';
import { BubbleToolbar } from './components/bubble-toolbar';
import { CodeHighlightBlock } from './components/code-highlight-block';
import { TinyMceToolbar } from './components/tinymce-chrome/tinymce-toolbar';
import { TinyMceMenuBar } from './components/tinymce-chrome/tinymce-menu-bar';
import { ClearFormat as ClearFormatExtension } from './extension/clear-format';
import { TextTransform as TextTransformExtension } from './extension/text-transform';
import { TinyMceEditorPanel } from './components/tinymce-chrome/tinymce-editor-panel';
import { TinyMceToolbarPanel } from './components/tinymce-chrome/tinymce-toolbar-panel';

// ----------------------------------------------------------------------

export function Editor({
  sx,
  error,
  onChange,
  slotProps,
  helperText,
  resetValue,
  className,
  editable = true,
  fullItem = false,
  /** `'tinymce'` adds menu bar, 3-row toolbar, and status strip (lesson builder). */
  chrome = 'default',
  /** Document area drag-resize limits (tinymce chrome only). */
  tinymceResizeBounds,
  immediatelyRender = false,
  ref: contentRef,
  value: initialContent = '',
  placeholder = 'Write something awesome...',
  /** `0` fires `onChange` on every keystroke (needed for forms that submit immediately). Default `200` ms debounce. */
  debounceMs = 200,
  /**
   * When this value changes (e.g. LMS save + refetch epoch), HTML is reapplied from `value`.
   * Avoids relying on TipTap’s one-shot `content` initializer so server snapshots repopulate the UI.
   */
  contentRevision = undefined,
  /**
   * Prefer this HTML when `contentRevision` advances (same render as fresh `/modules` payload).
   * Avoids a race where React state `value` is still stale while `contentRevision` already bumped.
   */
  revisionApplyHtml = undefined,
  ...other
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(0);

  const syncedContentRevisionRef = useRef(null);

  const tmResizeBounds = tinymceResizeBounds ?? { min: 150, max: 600 };

  const lowlight = useMemo(() => createLowlight(common), []);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const debouncedEmit = useMemo(() => {
    const ms = debounceMs ?? 200;
    if (ms <= 0) {
      return null;
    }
    return debounce((html) => {
      onChangeRef.current?.(html);
    }, ms);
  }, [debounceMs]);

  const editor = useEditor({
    editable,
    immediatelyRender,
    content: initialContent,
    shouldRerenderOnTransaction: !!rerenderKey,
    onUpdate: (ctx) => {
      const html = ctx.editor.getHTML();
      const ms = debounceMs ?? 200;
      if (ms <= 0) {
        onChangeRef.current?.(html);
      } else if (debouncedEmit) {
        debouncedEmit(html);
      }
    },
    extensions: [
      StarterKitExtension.configure({
        codeBlock: false,
        code: { HTMLAttributes: { class: editorClasses.content.codeInline } },
        heading: { HTMLAttributes: { class: editorClasses.content.heading } },
        horizontalRule: { HTMLAttributes: { class: editorClasses.content.hr } },
        listItem: { HTMLAttributes: { class: editorClasses.content.listItem } },
        blockquote: { HTMLAttributes: { class: editorClasses.content.blockquote } },
        bulletList: { HTMLAttributes: { class: editorClasses.content.bulletList } },
        orderedList: { HTMLAttributes: { class: editorClasses.content.orderedList } },
        link: {
          openOnClick: false,
          HTMLAttributes: { class: editorClasses.content.link },
        },
      }),
      TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
      TextStyleKit,
      Underline,
      Subscript,
      Superscript,
      ImageExtension.configure({ HTMLAttributes: { class: editorClasses.content.image } }),
      PlaceholderExtension.configure({
        placeholder,
        emptyEditorClass: editorClasses.content.placeholder,
      }),
      CodeBlockLowlightExtension.extend({
        addNodeView: () => ReactNodeViewRenderer(CodeHighlightBlock),
      }).configure({ lowlight }),
      // Custom extensions
      TextTransformExtension,
      ClearFormatExtension,
    ],
    ...other,
  });

  const handleToggleFullscreen = useCallback(() => {
    editor?.unmount();
    setFullscreen((prev) => !prev);
    setRerenderKey((prev) => prev + 1);
  }, [editor]);

  const handleExitFullscreen = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        editor?.unmount();
        setFullscreen(false);
        setRerenderKey((prev) => prev + 1);
      }
    },
    [editor]
  );

  useLayoutEffect(() => {
    if (contentRevision === undefined || contentRevision === null || !editor || editor.isDestroyed) {
      return;
    }

    const rev = String(contentRevision);
    if (syncedContentRevisionRef.current === rev) {
      return;
    }

    syncedContentRevisionRef.current = rev;

    const slice =
      revisionApplyHtml !== undefined && revisionApplyHtml !== null ? revisionApplyHtml : (initialContent ?? '');
    const html = String(slice);
    editor.commands.setContent(html.trim() === '' ? '<p></p>' : html, false);
  }, [contentRevision, initialContent, revisionApplyHtml, editor]);

  useEffect(() => {
    if (contentRevision !== undefined) {
      return undefined;
    }
    const timer = setTimeout(() => {
      if (!editor?.isDestroyed && editor?.isEmpty && initialContent !== '<p></p>') {
        editor?.commands.setContent(initialContent);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [contentRevision, initialContent, editor]);

  useEffect(() => {
    if (resetValue && !initialContent) {
      editor?.commands.clearContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  useEffect(() => {
    if (!fullscreen) return undefined;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleExitFullscreen);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleExitFullscreen);
    };
  }, [fullscreen, handleExitFullscreen]);

  return (
    <Portal disablePortal={!fullscreen}>
      {fullscreen && <Backdrop open sx={[(theme) => ({ zIndex: theme.zIndex.modal - 1 })]} />}

      <Box
        {...slotProps?.wrapper}
        sx={[
          { display: 'flex', flexDirection: 'column' },
          ...(Array.isArray(slotProps?.wrapper?.sx)
            ? slotProps.wrapper.sx
            : [slotProps?.wrapper?.sx]),
        ]}
      >
        <EditorRoot
          className={mergeClasses([editorClasses.root, className], {
            [editorClasses.state.error]: !!error,
            [editorClasses.state.disabled]: !editable,
            [editorClasses.state.fullscreen]: fullscreen,
            [editorClasses.state.tinymce]: chrome === 'tinymce',
          })}
          sx={sx}
        >
          {editor && !editor.isDestroyed && (
            <>
              {chrome === 'tinymce' ? (
                <>
                    <TinyMceToolbarPanel>
                    <TinyMceMenuBar editor={editor} />
                    <TinyMceToolbar
                      editor={editor}
                      fullItem={fullItem}
                      fullscreen={fullscreen}
                      onToggleFullscreen={handleToggleFullscreen}
                    />
                  </TinyMceToolbarPanel>

                  <TinyMceEditorPanel
                    editor={editor}
                    resizeBounds={tmResizeBounds}
                    fullscreen={fullscreen}
                    mainSlot={
                      <EditorContent
                        ref={contentRef}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        editor={editor}
                        className={editorClasses.content.root}
                      />
                    }
                  >
                    <BubbleToolbar editor={editor} />
                  </TinyMceEditorPanel>
                </>
              ) : (
                <>
                  <Toolbar
                    editor={editor}
                    fullItem={fullItem}
                    fullscreen={fullscreen}
                    onToggleFullscreen={handleToggleFullscreen}
                  />
                  <BubbleToolbar editor={editor} />
                  <EditorContent
                    ref={contentRef}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    editor={editor}
                    className={editorClasses.content.root}
                  />
                </>
              )}
            </>
          )}
        </EditorRoot>

        {helperText && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
      </Box>
    </Portal>
  );
}
