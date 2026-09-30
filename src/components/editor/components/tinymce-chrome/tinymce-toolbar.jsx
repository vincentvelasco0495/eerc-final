import { useState, useCallback } from 'react';
import { useEditorState } from '@tiptap/react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { Iconify } from 'src/components/iconify';

import { LinkBlock } from '../link-block';
import { ToolbarRow } from './toolbar-row';
import { ImageBlock } from '../image-block';
import { ToolbarGroup } from './toolbar-group';
import { HeadingBlock } from '../heading-block';
import { toolbarIcons } from '../toolbar-icons';
import { TmIconButton } from './tm-icon-button';
import { ToolbarButton } from './toolbar-button';
import { ToolbarDropdown } from './toolbar-dropdown';
import { useToolbarState } from '../use-toolbar-state';
import { TmColorGridButton } from './tm-color-grid-button';
import {
  TINYMCE,
  TEXT_COLORS,
  FONT_FAMILIES,
  FONT_SIZE_STEPS,
  HIGHLIGHT_COLORS,
  LINE_HEIGHT_OPTIONS,
} from './tinymce-theme';

function FontSizeStepper({ editor, fontSize }) {
  const idx = FONT_SIZE_STEPS.indexOf(fontSize);
  const safeIdx = idx >= 0 ? idx : 2;
  const chain = () => editor.chain().focus();

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0}
      sx={{
        border: `1px solid ${TINYMCE.border}`,
        borderRadius: TINYMCE.buttonRadius,
        overflow: 'hidden',
      }}
    >
      <TmIconButton
        label="Decrease font size"
        disabled={safeIdx <= 0}
        onClick={() => chain().setFontSize(FONT_SIZE_STEPS[safeIdx - 1]).run()}
        sx={{
          width: { xs: 32, sm: 24 },
          height: { xs: 32, sm: 24 },
          minWidth: { xs: 32, sm: 24 },
          borderRadius: 0,
        }}
      >
        <Box sx={{ typography: 'subtitle2', lineHeight: 1, fontWeight: 700 }}>−</Box>
      </TmIconButton>
      <Box
        sx={{
          minWidth: 44,
          textAlign: 'center',
          typography: 'caption',
          fontWeight: 600,
          px: 0.75,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {fontSize}
      </Box>
      <TmIconButton
        label="Increase font size"
        disabled={safeIdx >= FONT_SIZE_STEPS.length - 1}
        onClick={() => chain().setFontSize(FONT_SIZE_STEPS[safeIdx + 1]).run()}
        sx={{
          width: { xs: 32, sm: 24 },
          height: { xs: 32, sm: 24 },
          minWidth: { xs: 32, sm: 24 },
          borderRadius: 0,
        }}
      >
        <Box sx={{ typography: 'subtitle2', lineHeight: 1, fontWeight: 700 }}>+</Box>
      </TmIconButton>
    </Stack>
  );
}

function LineHeightMenu({ editor }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();
  const chain = () => editor.chain().focus();

  return (
    <ToolbarGroup>
      <TmIconButton label="Line height" onClick={onOpen}>
        <Iconify icon="solar:sort-vertical-bold" width={17} />
      </TmIconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {LINE_HEIGHT_OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            dense
            onClick={() => {
              chain().setLineHeight(opt.value).run();
              onClose();
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
        <MenuItem
          dense
          onClick={() => {
            chain().unsetLineHeight().run();
            onClose();
          }}
        >
          Default
        </MenuItem>
      </Menu>
    </ToolbarGroup>
  );
}

function ListMenu({ editor }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();
  const chain = () => editor.chain().focus();

  return (
    <ToolbarGroup>
      <ButtonBase
        onClick={onOpen}
        disableRipple
        sx={{
          height: { xs: 36, sm: TINYMCE.controlHeight },
          px: 0.75,
          gap: 0.25,
          borderRadius: TINYMCE.buttonRadius,
          border: `1px solid ${TINYMCE.border}`,
          backgroundColor: TINYMCE.chromeSurface,
        }}
      >
        <SvgIcon sx={{ fontSize: { xs: 20, sm: 18 } }}>{toolbarIcons.bulletList}</SvgIcon>
        <Iconify width={12} icon="eva:arrow-ios-downward-fill" sx={{ color: 'text.secondary' }} />
      </ButtonBase>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem
          dense
          onClick={() => {
            chain().toggleBulletList().run();
            onClose();
          }}
        >
          Bullet list
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            chain().toggleOrderedList().run();
            onClose();
          }}
        >
          Numbered list
        </MenuItem>
      </Menu>
    </ToolbarGroup>
  );
}

function NumberedListMenu({ editor }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();
  const chain = () => editor.chain().focus();

  return (
    <ToolbarGroup>
      <ButtonBase
        onClick={onOpen}
        disableRipple
        sx={{
          height: { xs: 36, sm: TINYMCE.controlHeight },
          px: 0.75,
          gap: 0.25,
          borderRadius: TINYMCE.buttonRadius,
          border: `1px solid ${TINYMCE.border}`,
          backgroundColor: TINYMCE.chromeSurface,
        }}
      >
        <SvgIcon sx={{ fontSize: { xs: 20, sm: 18 } }}>{toolbarIcons.orderedList}</SvgIcon>
        <Iconify width={12} icon="eva:arrow-ios-downward-fill" sx={{ color: 'text.secondary' }} />
      </ButtonBase>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem
          dense
          onClick={() => {
            chain().toggleOrderedList().run();
            onClose();
          }}
        >
          Numbered list
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            chain().toggleBulletList().run();
            onClose();
          }}
        >
          Bullet list
        </MenuItem>
      </Menu>
    </ToolbarGroup>
  );
}

export function TinyMceToolbar({ editor, fullItem, fullscreen, onToggleFullscreen }) {
  const toolbarState = useToolbarState(editor);
  const styleAttrs = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.getAttributes('textStyle') || {},
  });

  const [textDir, setTextDir] = useState('ltr');

  const applyDir = useCallback(
    (dir) => {
      setTextDir(dir);
      const el = editor?.view?.dom;
      if (el) el.style.direction = dir === 'rtl' ? 'rtl' : 'ltr';
    },
    [editor]
  );

  const fontFamilyLabel =
    FONT_FAMILIES.find((f) => f.value === (styleAttrs.fontFamily || ''))?.label ?? 'System Font';
  const fontSize = styleAttrs.fontSize || '16px';

  const chainCommands = () => editor.chain().focus();

  if (!editor) return null;

  return (
    <>
      {/* Row 2: history, paragraph, font, size, bold, italic */}
      <ToolbarRow divider>
        <ToolbarGroup>
          <ToolbarButton
            label="Undo (⌘Z)"
            icon={toolbarIcons.undo}
            disabled={!toolbarState.canUndo}
            onClick={() => chainCommands().undo().run()}
          />
          <ToolbarButton
            label="Redo (⌘⇧Z)"
            icon={toolbarIcons.redo}
            disabled={!toolbarState.canRedo}
            onClick={() => chainCommands().redo().run()}
          />
        </ToolbarGroup>

        <ToolbarGroup>
          <HeadingBlock editor={editor} isActive={toolbarState.isTextLevel} variant="tinymce" />
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarDropdown
            label="Font"
            displayValue={fontFamilyLabel}
            selectedValue={styleAttrs.fontFamily || ''}
            options={FONT_FAMILIES}
            onSelect={(value) =>
              value ? chainCommands().setFontFamily(value).run() : chainCommands().unsetFontFamily().run()
            }
            minWidth={140}
          />
        </ToolbarGroup>

        <ToolbarGroup>
          <FontSizeStepper editor={editor} fontSize={fontSize} />
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            label="Bold (⌘B)"
            icon={toolbarIcons.bold}
            active={toolbarState.isBold}
            onClick={() => chainCommands().toggleBold().run()}
          />
          <ToolbarButton
            label="Italic (⌘I)"
            icon={toolbarIcons.italic}
            active={toolbarState.isItalic}
            onClick={() => chainCommands().toggleItalic().run()}
          />
        </ToolbarGroup>
      </ToolbarRow>

      {/* Row 3: full formatting strip */}
      <ToolbarRow divider={!!fullItem}>
        <ToolbarGroup>
          <ToolbarButton
            label="Underline (⌘U)"
            icon={toolbarIcons.underline}
            active={toolbarState.isUnderline}
            onClick={() => chainCommands().toggleUnderline().run()}
          />
          <ToolbarButton
            label="Strikethrough"
            icon={toolbarIcons.strike}
            active={toolbarState.isStrike}
            onClick={() => chainCommands().toggleStrike().run()}
          />
        </ToolbarGroup>

        <ToolbarGroup>
          <TmColorGridButton
            label="Text color"
            swatches={TEXT_COLORS}
            currentColor={styleAttrs.color}
            onPick={(c) =>
              c ? chainCommands().setColor(c).run() : chainCommands().unsetColor().run()
            }
          />
          <TmColorGridButton
            label="Highlight color"
            swatches={HIGHLIGHT_COLORS}
            currentColor={styleAttrs.backgroundColor}
            marker
            onPick={(c) =>
              c ? chainCommands().setBackgroundColor(c).run() : chainCommands().unsetBackgroundColor().run()
            }
          />
        </ToolbarGroup>

        <ToolbarGroup
          sx={{
            '& .MuiButtonBase-root': {
              width: { xs: 32, sm: 26 },
              height: { xs: 32, sm: 26 },
              minWidth: { xs: 32, sm: 26 },
              p: { xs: '5px', sm: '3px' },
            },
          }}
        >
          <LinkBlock
            editor={editor}
            active={toolbarState.isLink}
            linkIcon={toolbarIcons.link}
            unlinkIcon={toolbarIcons.unlink}
          />
          <ImageBlock editor={editor} icon={toolbarIcons.image} />
          <ImageBlock editor={editor} icon={toolbarIcons.media} ariaLabel="Insert media" />
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            label="Align left"
            icon={toolbarIcons.alignLeft}
            active={toolbarState.isAlign('left')}
            onClick={() => chainCommands().setTextAlign('left').run()}
          />
          <ToolbarButton
            label="Align center"
            icon={toolbarIcons.alignCenter}
            active={toolbarState.isAlign('center')}
            onClick={() => chainCommands().setTextAlign('center').run()}
          />
          <ToolbarButton
            label="Align right"
            icon={toolbarIcons.alignRight}
            active={toolbarState.isAlign('right')}
            onClick={() => chainCommands().setTextAlign('right').run()}
          />
          <ToolbarButton
            label="Justify"
            icon={toolbarIcons.alignJustify}
            active={toolbarState.isAlign('justify')}
            onClick={() => chainCommands().setTextAlign('justify').run()}
          />
        </ToolbarGroup>

        <LineHeightMenu editor={editor} />
        <ListMenu editor={editor} />
        <NumberedListMenu editor={editor} />

        <ToolbarGroup>
          <ToolbarButton
            label="Outdent"
            disabled={!toolbarState.canLiftList}
            onClick={() => chainCommands().liftListItem('listItem').run()}
          >
            <Iconify icon="material-symbols:format-indent-decrease" width={18} />
          </ToolbarButton>
          <ToolbarButton
            label="Indent"
            disabled={!toolbarState.canSinkList}
            onClick={() => chainCommands().sinkListItem('listItem').run()}
          >
            <Iconify icon="material-symbols:format-indent-increase" width={18} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            label="Subscript"
            active={toolbarState.isSubscript}
            onClick={() => chainCommands().toggleSubscript().run()}
          >
            <Box component="span" sx={{ fontSize: 11, fontFamily: 'serif', lineHeight: 1 }}>
              X<sub style={{ fontSize: '0.75em' }}>2</sub>
            </Box>
          </ToolbarButton>
          <ToolbarButton
            label="Superscript"
            active={toolbarState.isSuperscript}
            onClick={() => chainCommands().toggleSuperscript().run()}
          >
            <Box component="span" sx={{ fontSize: 11, fontFamily: 'serif', lineHeight: 1 }}>
              X<sup style={{ fontSize: '0.75em' }}>2</sup>
            </Box>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            label="Clear formatting"
            icon={toolbarIcons.clear}
            onClick={() => chainCommands().clearNodes().unsetAllMarks().run()}
          />
          <ToolbarButton
            label="Fullscreen"
            icon={fullscreen ? toolbarIcons.exitFullscreen : toolbarIcons.fullscreen}
            active={fullscreen}
            onClick={onToggleFullscreen}
          />
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton label="Left to right" active={textDir === 'ltr'} onClick={() => applyDir('ltr')}>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: 15,
                lineHeight: 1,
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: 'text.primary',
              }}
            >
              ¶
              <Iconify icon="eva:arrow-forward-fill" width={12} sx={{ opacity: 0.85 }} />
            </Box>
          </ToolbarButton>
          <ToolbarButton label="Right to left" active={textDir === 'rtl'} onClick={() => applyDir('rtl')}>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: 15,
                lineHeight: 1,
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: 'text.primary',
              }}
            >
              <Iconify icon="eva:arrow-back-fill" width={12} sx={{ opacity: 0.85 }} />
              ¶
            </Box>
          </ToolbarButton>
        </ToolbarGroup>
      </ToolbarRow>

      {fullItem && (
        <ToolbarRow divider={false}>
          <ToolbarGroup>
            <ToolbarButton
              label="Code"
              icon={toolbarIcons.code}
              active={toolbarState.isCode}
              onClick={() => chainCommands().toggleCode().run()}
            />
            <ToolbarButton
              label="Code block"
              icon={toolbarIcons.codeBlock}
              active={toolbarState.isCodeBlock}
              onClick={() => chainCommands().toggleCodeBlock().run()}
            />
            <ToolbarButton
              label="Blockquote"
              icon={toolbarIcons.blockquote}
              active={toolbarState.isBlockquote}
              onClick={() => chainCommands().toggleBlockquote().run()}
            />
            <ToolbarButton
              label="Horizontal rule"
              icon={toolbarIcons.horizontalRule}
              onClick={() => chainCommands().setHorizontalRule().run()}
            />
          </ToolbarGroup>
        </ToolbarRow>
      )}
    </>
  );
}
