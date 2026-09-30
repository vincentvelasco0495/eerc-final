import { usePopover } from 'minimal-shared/hooks';
import { Fragment, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import DialogTitle from '@mui/material/DialogTitle';
import GlobalStyles from '@mui/material/GlobalStyles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListSubheader from '@mui/material/ListSubheader';
import useMediaQuery from '@mui/material/useMediaQuery';

import { brandVars } from 'src/theme';

import { Iconify } from 'src/components/iconify';

import { TINYMCE } from './tinymce-theme';

const MENUS = [
  {
    id: 'view',
    label: 'View',
    items: [
      { label: 'Source code', action: 'source' },
      { label: 'Visual aids', action: 'toggleVisualAids' },
    ],
  },
  {
    id: 'format',
    label: 'Format',
    items: [
      { label: 'Bold', action: 'bold' },
      { label: 'Italic', action: 'italic' },
      { label: 'Clear formatting', action: 'clearFormat' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { label: 'Word count', action: 'wordCount' },
      { label: 'Preview', action: 'preview' },
    ],
  },
];

// ----------------------------------------------------------------------

export function TinyMceMenuBar({ editor }) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [visualAids, setVisualAids] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceDraft, setSourceDraft] = useState('');
  const [wcOpen, setWcOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const el = editor?.view?.dom;
    if (!el) return undefined;
    el.setAttribute('data-visual-aids', visualAids ? 'true' : '');
    return () => {
      el.removeAttribute('data-visual-aids');
    };
  }, [editor, visualAids]);

  const runAction = useCallback(
    (action, closeMenu) => {
      closeMenu?.();
      if (!editor) return;

      const chain = () => editor.chain().focus();

      switch (action) {
        case 'source':
          setSourceDraft(editor.getHTML());
          setSourceOpen(true);
          break;
        case 'toggleVisualAids':
          setVisualAids((prev) => !prev);
          break;
        case 'bold':
          chain().toggleBold().run();
          break;
        case 'italic':
          chain().toggleItalic().run();
          break;
        case 'clearFormat':
          chain().clearNodes().unsetAllMarks().run();
          break;
        case 'wordCount':
          setWcOpen(true);
          break;
        case 'preview':
          setPreviewOpen(true);
          break;
        default:
          break;
      }
    },
    [editor]
  );

  const applySource = useCallback(() => {
    editor?.chain().focus().setContent(sourceDraft).run();
    setSourceOpen(false);
  }, [editor, sourceDraft]);

  const htmlPreview = editor?.getHTML?.() ?? '';
  const plain = editor?.getText?.() ?? '';
  const wordCount =
    plain.trim().length === 0 ? 0 : plain.trim().split(/\s+/).filter(Boolean).length;
  const charCount = plain.length;

  if (!editor) return null;

  return (
    <>
      <GlobalStyles
        styles={{
          '.ProseMirror[data-visual-aids="true"] p': {
            outline: `1px dashed ${brandVars.textDisabled}`,
            outlineOffset: '2px',
          },
          '.ProseMirror[data-visual-aids="true"] table': {
            outline: `1px dashed ${brandVars.textDisabled}`,
          },
        }}
      />

      {isSmDown ? (
        <MobileEditorMenuBar runAction={runAction} visualAids={visualAids} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            columnGap: 5,
            rowGap: 0.5,
            width: 1,
            px: 2,
            py: 0.75,
            minHeight: 40,
            backgroundColor: TINYMCE.chromeSurface,
            borderBottom: `1px solid ${TINYMCE.hairline}`,
          }}
        >
          {MENUS.map((m) => (
            <MenuDropdown key={m.id} label={m.label} items={m.items} onAction={runAction} visualAids={visualAids} />
          ))}
        </Box>
      )}

      <Dialog open={sourceOpen} onClose={() => setSourceOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Source code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            fullWidth
            minRows={14}
            value={sourceDraft}
            onChange={(e) => setSourceDraft(e.target.value)}
            placeholder="<p></p>"
            spellCheck={false}
            sx={{ mt: 0.5, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSourceOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applySource}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={wcOpen} onClose={() => setWcOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Word count</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Statistics for the document.
          </Typography>
          <Typography variant="body1">
            Words: <strong>{wordCount}</strong>
          </Typography>
          <Typography variant="body1">
            Characters: <strong>{charCount}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setWcOpen(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Preview</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box
            sx={{
              minHeight: 280,
              maxHeight: '60vh',
              overflow: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              bgcolor: 'background.paper',
              typography: 'body1',
              '& img': { maxWidth: '100%', height: 'auto' },
            }}
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function MobileEditorMenuBar({ runAction, visualAids }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 1,
        px: 0.75,
        py: 0.25,
        minHeight: 44,
        backgroundColor: TINYMCE.chromeSurface,
        borderBottom: `1px solid ${TINYMCE.hairline}`,
      }}
    >
      <IconButton
        color="inherit"
        size="large"
        edge="start"
        aria-label="View, format, and tools"
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="menu"
        onClick={onOpen}
        sx={{ borderRadius: 1 }}
      >
        <Iconify icon="eva:menu-2-fill" width={22} />
      </IconButton>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>
        View · Format · Tools
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: 'min(100vw - 24px, 320px)',
              maxHeight: 'min(72dvh, 420px)',
            },
          },
        }}
      >
        {MENUS.map((m) => (
          <Fragment key={m.id}>
            <ListSubheader disableSticky sx={{ typography: 'overline', lineHeight: 1.5, py: 1 }}>
              {m.label}
            </ListSubheader>
            {m.items.map((item) => {
              const secondaryLabel =
                item.action === 'toggleVisualAids' ? (visualAids ? 'On' : 'Off') : null;
              return (
                <MenuItem
                  key={item.action}
                  onClick={() => runAction(item.action, onClose)}
                  sx={{ justifyContent: 'space-between', gap: 2, minHeight: 48 }}
                >
                  {item.label}
                  {secondaryLabel ? (
                    <Typography component="span" variant="caption" color="text.secondary">
                      {secondaryLabel}
                    </Typography>
                  ) : null}
                </MenuItem>
              );
            })}
          </Fragment>
        ))}
      </Menu>
    </Box>
  );
}

function MenuDropdown({ label, items, onAction, visualAids }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();

  return (
    <>
      <ButtonBase onClick={onOpen} disableRipple sx={{ ...menuBtnSx }}>
        {label}
      </ButtonBase>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {items.map((item) => {
          const secondaryLabel =
            item.action === 'toggleVisualAids' ? (visualAids ? 'On' : 'Off') : null;
          return (
            <MenuItem
              key={item.action}
              dense
              onClick={() => onAction(item.action, onClose)}
              sx={{
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              {item.label}
              {secondaryLabel && (
                <Typography component="span" variant="caption" color="text.secondary">
                  {secondaryLabel}
                </Typography>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

const menuBtnSx = {
  px: 1.25,
  py: 0.75,
  borderRadius: TINYMCE.buttonRadius,
  typography: 'body2',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: TINYMCE.menuColor,
  '&:hover': { backgroundColor: 'action.hover' },
};
