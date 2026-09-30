/** Quiz builder workspace — reference layout tokens */

import { varAlpha } from 'minimal-shared/utils';

import { brandVars, themeConfig } from 'src/theme';

export const quizColors = {
  pageBg: brandVars.page,
  border: brandVars.borderSubtle,
  muted: brandVars.textMuted,
  text: brandVars.textPrimary,
  /** Brand accent (gold) — key names kept for API stability. */
  primaryBlue: brandVars.accent,
  primaryBlueHover: themeConfig.palette.primary.dark,
  success: themeConfig.palette.success.main,
  successHover: themeConfig.palette.success.dark,
};

export const styles = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    maxWidth: '100%',
    overflowX: 'hidden',
    bgcolor: quizColors.pageBg,
    p: { xs: 2, sm: 2.5 },
    boxSizing: 'border-box',
  },

  header: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    justifyContent: 'space-between',
    gap: 2,
    px: { xs: 2, sm: 2.5 },
    py: { xs: 1.75, sm: 2 },
    bgcolor: brandVars.surface,
    borderBottom: `1px solid ${quizColors.border}`,
    borderRadius: '10px 10px 0 0',
    flexShrink: 0,
  },

  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: { xs: 1, sm: 1.5 },
    minWidth: 0,
    flex: 1,
    width: { xs: '100%', sm: 'auto' },
  },

  headerQuizBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: { xs: 0.5, sm: 0.75 },
    flexShrink: 0,
    px: { xs: 1, sm: 1.25 },
    py: { xs: 0.375, sm: 0.5 },
    borderRadius: '999px',
    bgcolor: brandVars.sunken,
    border: `1px solid ${quizColors.border}`,
  },

  headerQuizIconWrap: {
    width: { xs: 22, sm: 26 },
    height: { xs: 22, sm: 26 },
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: brandVars.elevated,
    border: `1px solid ${quizColors.border}`,
    color: quizColors.muted,
  },

  headerQuizBadgeLabel: {
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 600,
    color: quizColors.text,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: quizColors.text,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  headerTitleField: {
    flex: 1,
    minWidth: 0,
    m: 0,
    '& .MuiOutlinedInput-root': {
      bgcolor: 'background.paper',
      borderRadius: 2,
      fontSize: { xs: 14, sm: 15 },
      fontWeight: 600,
    },
    '& .MuiOutlinedInput-input': {
      py: { xs: 0.875, sm: 1 },
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },

  saveBtn: {
    textTransform: 'none',
    fontWeight: 600,
    px: 2.5,
    py: 1,
    borderRadius: '999px',
    fontSize: 14,
    width: { xs: '100%', sm: 'auto' },
    alignSelf: { xs: 'stretch', sm: 'auto' },
  },

  tabsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: { xs: 1, sm: 1.5, md: 2 },
    flexWrap: 'wrap',
    minWidth: 0,
    maxWidth: '100%',
    mt: 0,
    pt: { xs: 1.5, sm: 2 },
    pb: { xs: 1.5, sm: 2 },
    flexShrink: 0,
  },

  tabsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    p: '4px',
    bgcolor: brandVars.sunken,
    borderRadius: '10px',
    flex: { xs: '1 1 100%', sm: '1 1 0%' },
    minWidth: 0,
    maxWidth: '100%',
    flexShrink: 1,
  },

  tabActions: {
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 0.75, sm: 1.25 },
    flexShrink: 0,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },

  listIconBtn: {
    width: 40,
    height: 40,
    border: `1px solid ${quizColors.border}`,
    borderRadius: '8px',
    bgcolor: brandVars.elevated,
    color: brandVars.accentText,
  },

  libraryBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: { xs: 13, sm: 14 },
    px: { xs: 1.25, sm: 2 },
    py: 1,
    borderRadius: '8px',
    borderColor: brandVars.accentText,
    color: brandVars.accentText,
    whiteSpace: 'nowrap',
  },

  tabBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: { xs: 13, sm: 14 },
    px: { xs: 1.5, sm: 2.25 },
    py: { xs: 1, sm: 1.125 },
    borderRadius: '8px',
    color: quizColors.muted,
    border: 'none',
    bgcolor: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  tabBtnIdle: {
    bgcolor: 'transparent',
    color: quizColors.muted,
    '&:hover': {
      color: quizColors.text,
      bgcolor: brandVars.hover,
    },
  },

  tabBtnActive: {
    bgcolor: brandVars.elevated,
    color: quizColors.text,
    boxShadow: (theme) =>
      `inset 0 0 0 1px ${brandVars.borderDefault}, 0 1px 3px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
    '&:hover': {
      bgcolor: brandVars.elevated,
      color: quizColors.text,
    },
  },

  tabLabelRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
  },

  tabCountBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    height: 22,
    px: 0.75,
    borderRadius: '999px',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
  },

  tabCountBadgeActive: {
    bgcolor: brandVars.accent,
    color: brandVars.onAccent,
  },

  tabCountBadgeIdle: {
    bgcolor: brandVars.borderSubtle,
    color: brandVars.textSecondary,
  },

  mainColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minHeight: 0,
    minWidth: 0,
    maxWidth: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    pb: 2,
  },

  card: {
    bgcolor: brandVars.surface,
    border: `1px solid ${quizColors.border}`,
    borderRadius: '10px',
    boxShadow: (theme) => `0 1px 2px ${varAlpha(theme.vars.palette.common.blackChannel, 0.2)}`,
    overflow: 'hidden',
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
  },

  cardActionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 0.75,
    px: 2,
    pt: 1.5,
    pb: 0,
  },

  cardChromeInline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 0.75,
    flexShrink: 0,
  },

  questionCollapsedBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
    px: 2,
    py: 1.5,
    minWidth: 0,
    bgcolor: brandVars.elevated,
    borderBottom: `1px solid ${quizColors.border}`,
  },

  collapsedBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    minWidth: 0,
    flex: 1,
  },

  collapsedQuestionText: {
    fontSize: 15,
    fontWeight: 600,
    color: quizColors.text,
    minWidth: 0,
    flex: 1,
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
  },

  questionImageHint: {
    px: 2.5,
    pb: 2,
    pt: 0,
    fontSize: 13,
    color: 'text.secondary',
    textAlign: 'center',
  },

  trashBtn: {
    width: 36,
    height: 36,
    borderRadius: '8px',
    bgcolor: 'error.main',
    color: 'error.contrastText',
    '&:hover': { bgcolor: 'error.dark' },
  },

  cardChromeBtn: {
    width: 36,
    height: 36,
    borderRadius: '8px',
    border: `1px solid ${quizColors.border}`,
    bgcolor: brandVars.elevated,
    color: quizColors.muted,
    '&:hover': { bgcolor: brandVars.hover, color: quizColors.text },
  },

  stemLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: quizColors.text,
    mb: 1,
  },

  questionEditorWrap: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
  },

  editorMainFull: {
    p: { xs: 1.75, sm: 2.5 },
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },

  editorShell: {
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    '& .ProseMirror': {
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
    },
    '& table': {
      maxWidth: '100%',
      tableLayout: 'fixed',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
  },

  editorTop: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 1.5, sm: 2 },
    p: { xs: 1.75, sm: 2.5 },
    alignItems: { xs: 'stretch', sm: 'flex-start' },
  },

  questionImagesRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr)' },
    borderTop: `1px solid ${quizColors.border}`,
    minWidth: 0,
    maxWidth: '100%',
  },

  questionImageField: {
    p: { xs: 2, sm: 2.5 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.5,
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    bgcolor: brandVars.sunken,
  },

  questionImageFieldBorderRight: {
    borderRight: { xs: 'none', sm: `1px solid ${quizColors.border}` },
    borderBottom: { xs: `1px solid ${quizColors.border}`, sm: 'none' },
  },

  questionImageLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: quizColors.text,
    textAlign: 'center',
  },

  questionImagePreview: {
    width: '100%',
    maxWidth: 560,
    maxHeight: 360,
    objectFit: 'contain',
    borderRadius: '6px',
    border: `1px solid ${quizColors.border}`,
    bgcolor: brandVars.sunken,
  },

  questionImageFileRow: {
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  questionImageChooseBtn: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: 13,
    flexShrink: 0,
  },

  questionImageFileName: {
    maxWidth: 280,
    fontSize: 13,
  },

  imageTile: {
    width: { xs: '100%', sm: 52 },
    height: { xs: 52, sm: 52 },
    maxWidth: { xs: 76, sm: 'none' },
    flexShrink: 0,
    border: `1px solid ${quizColors.border}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: brandVars.elevated,
    color: quizColors.muted,
    cursor: 'pointer',
    alignSelf: { xs: 'flex-start', sm: 'auto' },
  },

  diagramColumn: {
    width: { xs: '100%', sm: 140 },
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 0.75,
    alignSelf: { xs: 'flex-start', sm: 'auto' },
  },

  diagramDropzone: {
    width: '100%',
    minHeight: { xs: 120, sm: 140 },
    border: `1px dashed ${quizColors.border}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: brandVars.sunken,
    color: quizColors.muted,
    overflow: 'hidden',
    p: 1,
    boxSizing: 'border-box',
  },

  diagramDropzoneActive: {
    borderColor: quizColors.primaryBlue,
    bgcolor: brandVars.hoverWash,
  },

  diagramDropzoneHasImage: {
    borderStyle: 'solid',
    p: 0,
  },

  diagramPreview: {
    width: '100%',
    height: '100%',
    minHeight: { xs: 120, sm: 140 },
    objectFit: 'contain',
    display: 'block',
    bgcolor: brandVars.sunken,
  },

  diagramActionBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 12,
    flex: 1,
    minWidth: 0,
  },

  diagramRemoveBtn: {
    border: `1px solid ${quizColors.border}`,
    borderRadius: '8px',
    color: 'error.main',
  },

  editorMain: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },

  settingsRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
    px: 2.5,
    py: 2,
    borderTop: `1px solid ${quizColors.border}`,
  },

  settingsRowTop: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
    px: 2.5,
    py: 2,
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${quizColors.border}`,
  },

  questionTypeSelect: {
    minWidth: 0,
    maxWidth: { xs: '100%', sm: 280 },
    flex: { xs: '1 1 100%', sm: '1 1 220px' },
  },

  settingsRequiredLabel: {
    m: 0,
    ml: { xs: 0, sm: 'auto' },
    flex: { xs: '1 1 100%', sm: '0 0 auto' },
    '& .MuiFormControlLabel-label': {
      whiteSpace: 'normal',
    },
  },

  answersSection: {
    bgcolor: brandVars.surface,
    border: `1px solid ${quizColors.border}`,
    borderRadius: '10px',
    p: 2.5,
    boxShadow: (theme) => `0 1px 2px ${varAlpha(theme.vars.palette.common.blackChannel, 0.2)}`,
  },

  answersInCard: {
    borderTop: `1px solid ${quizColors.border}`,
    pt: 2.5,
    px: 2.5,
    pb: 2.5,
    bgcolor: brandVars.surface,
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
  },

  answersHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },

  answersTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: quizColors.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  answersTools: {
    display: 'flex',
    gap: 0.5,
  },

  answerToolBtn: {
    width: 32,
    height: 32,
    color: quizColors.muted,
  },

  answerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },

  answerRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1.5,
    minHeight: 52,
    px: 2,
    py: 1,
    minWidth: 0,
    maxWidth: '100%',
    border: `1px solid ${quizColors.border}`,
    borderRadius: '8px',
    bgcolor: brandVars.elevated,
    boxSizing: 'border-box',
  },

  answerRowMain: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    flex: '1 1 180px',
    minWidth: 0,
  },

  dragHandle: {
    color: quizColors.muted,
    cursor: 'grab',
    display: 'flex',
    p: 0.5,
  },

  answerInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiInputBase-input': {
      py: 0.75,
    },
  },

  answerCorrect: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flex: { xs: '1 1 100%', sm: '0 0 auto' },
    minWidth: { xs: 0, sm: 120 },
    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
  },

  correctLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: quizColors.muted,
  },

  letterBadge: {
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: brandVars.sunken,
    border: `1px solid ${quizColors.border}`,
  },

  letterBadgeText: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1,
    color: quizColors.text,
  },

  addAnswerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 1,
    mt: 1.5,
    px: 2,
    py: 1.25,
    minWidth: 0,
    maxWidth: '100%',
    border: `1px solid ${quizColors.border}`,
    borderRadius: '8px',
    bgcolor: brandVars.sunken,
    boxSizing: 'border-box',
  },

  addAnswerBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 14,
    px: 2,
    borderRadius: '8px',
  },

  addAnswerPlusBtn: {
    width: 40,
    height: 40,
    minWidth: 40,
    p: 0,
    borderRadius: '8px',
    bgcolor: quizColors.primaryBlue,
    color: brandVars.onAccent,
    '&:hover': { bgcolor: quizColors.primaryBlueHover },
  },

  footer: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
    alignItems: 'center',
    gap: { xs: 1.5, sm: 2 },
    pt: { xs: 2, sm: 3 },
    mt: 'auto',
    flexShrink: 0,
  },

  footerCenter: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'center',
    gap: 2,
    flexWrap: 'wrap',
    gridColumn: { xs: '1 / -1', sm: 'auto' },
    order: { xs: -1, sm: 0 },
    '& .MuiButton-root': {
      width: { xs: 1, sm: 'auto' },
    },
  },

  footerBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 14,
    px: 2.5,
    py: 1.125,
    borderRadius: '999px',
  },

  footerEnd: {
    justifySelf: { xs: 'stretch', sm: 'end' },
    width: { xs: '100%', sm: 'auto' },
  },

  importProgress: {
    mt: 2,
    px: { xs: 0.5, sm: 1 },
  },

  importProgressLabel: {
    display: 'block',
    mb: 1,
    fontSize: 13,
    fontWeight: 600,
    color: quizColors.muted,
  },

  /** Quiz → Settings tab (MasterStudy-style form) */
  quizSettingsRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'auto',
  },

  quizSettingsCard: {
    bgcolor: brandVars.surface,
    border: `1px solid ${quizColors.border}`,
    borderRadius: '10px',
    boxShadow: (theme) => `0 1px 2px ${varAlpha(theme.vars.palette.common.blackChannel, 0.2)}`,
    p: { xs: 2, sm: 2.5, md: 3 },
    maxWidth: 960,
    width: '100%',
    mx: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    boxSizing: 'border-box',
  },

  quizSettingsFieldLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: quizColors.text,
    display: 'block',
    mb: 0.75,
  },

  quizSettingsTextArea: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      alignItems: 'flex-start',
    },
  },

  quizSettingsNumberInput: {
    borderRadius: '8px',
  },

  quizSettingsSelect: {
    borderRadius: '8px',
  },

  quizSettingsToggleGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    columnGap: 3,
    rowGap: 0,
    my: 2,
    px: { xs: 0, sm: 0 },
  },

  quizSettingsToggleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },

  quizSettingsSwitchRow: {
    m: 0,
    mr: 'auto!important',
    alignItems: 'center',
    '& .MuiFormControlLabel-label': {
      fontSize: 14,
      fontWeight: 500,
      color: quizColors.text,
    },
  },

  quizSettingsSaveRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    pt: 2.5,
    mt: 1,
  },

  quizSettingsFooterSaveBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 15,
    px: 4,
    py: 1.25,
    borderRadius: 1,
    bgcolor: quizColors.primaryBlue,
    '&:hover': {
      bgcolor: quizColors.primaryBlueHover,
    },
  },
};
