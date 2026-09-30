export const styles = {
  root: {
    gap: 2.5,
    py: 0.5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'text.primary',
    mb: 0.75,
  },
  row: {
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: { xs: 'stretch', sm: 'flex-start' },
  },
  previewRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    m: 0,
  },
  /** Switch + wrapping label: pin switch to first line instead of vertical center of block. */
  toggleRowAlignStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 1,
    m: 0,
  },
  /**
   * Small Switch keeps a large switchBase padding for hit area; flex `center`
   * then lines up the box, not the track, so the pill reads “high” vs label text.
   * Tighten padding slightly + nudge down so the track matches label cap-height.
   */
  switch: {
    flexShrink: 0,
    mt: '3px',
    '& .MuiSwitch-switchBase': {
      padding: '4px',
    },
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.43,
    color: 'text.primary',
  },
  /** Use on long / wrapping labels so text uses space after the switch. */
  toggleLabelFill: {
    flex: 1,
    minWidth: 0,
  },
  infoButton: {
    flexShrink: 0,
    color: 'text.disabled',
  },
};
