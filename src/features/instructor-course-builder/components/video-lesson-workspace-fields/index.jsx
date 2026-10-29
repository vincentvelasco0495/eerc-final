import { useDropzone } from 'react-dropzone';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { PremiumPlayableVideo } from 'src/components/common/premium-playable-video';

import { styles } from './styles';
import {
  VIDEO_WATERMARK_MAX_LENGTH,
  normalizeVideoWatermarkColor,
  DEFAULT_VIDEO_WATERMARK_COLOR,
  DEFAULT_VIDEO_WATERMARK_OPACITY,
} from '../../utils/lesson-authoring-helpers';

const SOURCE_OPTIONS = [{ value: 'html-mp4', label: 'HTML (MP4)' }];

function WatermarkAppearanceFields({ color, opacity, onColorChange, onOpacityChange }) {
  const normalizedColor = normalizeVideoWatermarkColor(color);
  const [colorDraft, setColorDraft] = useState(normalizedColor);

  useEffect(() => {
    setColorDraft(normalizedColor);
  }, [normalizedColor]);

  const commitColor = (next) => {
    const resolved = normalizeVideoWatermarkColor(next);
    setColorDraft(resolved);
    onColorChange?.(resolved);
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1.5 }}>
      <Box sx={{ minWidth: { sm: 200 } }}>
        <Typography sx={styles.fieldLabel}>Text color</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            component="input"
            type="color"
            value={normalizedColor}
            aria-label="Watermark text color"
            onChange={(event) => commitColor(event.target.value)}
            sx={{
              width: 40,
              height: 40,
              p: 0.25,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
              cursor: 'pointer',
            }}
          />
          <TextField
            size="small"
            value={colorDraft}
            onChange={(event) => {
              const next = event.target.value;
              setColorDraft(next);
              if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(next.trim())) {
                onColorChange?.(normalizeVideoWatermarkColor(next));
              }
            }}
            onBlur={() => commitColor(colorDraft)}
            slotProps={{ htmlInput: { maxLength: 7, 'aria-label': 'Watermark color hex' } }}
            sx={{ width: 120 }}
          />
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={styles.fieldLabel}>Opacity</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Slider
            value={Number.isFinite(Number(opacity)) ? Number(opacity) : DEFAULT_VIDEO_WATERMARK_OPACITY}
            min={0}
            max={100}
            aria-label="Watermark opacity"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            onChange={(_, value) => onOpacityChange?.(Array.isArray(value) ? value[0] : value)}
            sx={{ flex: 1 }}
          />
          <Typography variant="body2" sx={{ width: 42, flexShrink: 0, fontWeight: 600 }}>
            {Number.isFinite(Number(opacity)) ? Number(opacity) : DEFAULT_VIDEO_WATERMARK_OPACITY}%
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

function MediaDropzone({
  accept,
  hint,
  hintWhenPreview,
  uploadButtonLabel,
  replaceButtonLabel,
  icon,
  onFiles,
  isVideo = false,
  disabled = false,
  previewUrl = '',
  previewSources = [],
  uploading = false,
  uploadPercent = null,
  previewLoading = false,
  watermarkText = '',
  watermarkColor = DEFAULT_VIDEO_WATERMARK_COLOR,
  watermarkOpacity = DEFAULT_VIDEO_WATERMARK_OPACITY,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFiles?.(acceptedFiles);
    },
    [onFiles]
  );

  const showPreview = Boolean(previewUrl);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept,
    disabled: disabled || uploading,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={[
        (theme) => styles.dropzone(theme),
        isDragActive ? (theme) => styles.dropzoneActive(theme) : null,
      ]}
    >
      <input {...getInputProps()} />
      <Stack sx={{ alignItems: 'center', width: 1, gap: showPreview ? 1.5 : 0 }}>
        {showPreview ? (
          <Box sx={{ position: 'relative', width: 1 }}>
            {isVideo ? (
              <PremiumPlayableVideo
                key={previewUrl}
                src={previewUrl}
                sources={previewSources}
                title="Lesson video"
                aspectRatio="16 / 9"
                watermarkText={watermarkText}
                watermarkColor={watermarkColor}
                watermarkOpacity={watermarkOpacity}
              />
            ) : (
              <Box component="img" src={previewUrl} alt="" sx={styles.posterPreview} loading="lazy" />
            )}
            {uploading ? (
              <Box sx={(theme) => styles.uploadingOverlay(theme)}>
                <Stack spacing={1.25} sx={{ alignItems: 'center', px: 3, width: 1, maxWidth: 360 }}>
                  <CircularProgress size={40} sx={{ color: 'common.white' }} />
                  {Number.isFinite(Number(uploadPercent)) ? (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={Math.max(0, Math.min(100, Number(uploadPercent)))}
                        sx={{ width: 1, height: 8, borderRadius: 99 }}
                      />
                      <Typography sx={{ ...styles.hint, mt: 0, mb: 0, color: 'common.white' }}>
                        {Number(uploadPercent) >= 99
                          ? 'Assembling video… keep this tab open.'
                          : `Uploading ${Math.round(Number(uploadPercent))}% — large files resume if interrupted.`}
                      </Typography>
                    </>
                  ) : null}
                </Stack>
              </Box>
            ) : null}
          </Box>
        ) : uploading || previewLoading ? (
          <Stack spacing={1.25} sx={{ alignItems: 'center', width: 1, maxWidth: 360, my: 2 }}>
            <CircularProgress />
            {Number.isFinite(Number(uploadPercent)) ? (
              <>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, Number(uploadPercent)))}
                  sx={{ width: 1, height: 8, borderRadius: 99 }}
                />
                <Typography sx={styles.hint}>
                  {Number(uploadPercent) >= 99
                    ? 'Assembling video… keep this tab open.'
                    : `Uploading ${Math.round(Number(uploadPercent))}%`}
                </Typography>
              </>
            ) : (
              <Typography sx={styles.hint}>
                {previewLoading ? 'Loading lesson video…' : 'Uploading…'}
              </Typography>
            )}
          </Stack>
        ) : (
          <Iconify
            icon={icon}
            width={isVideo ? 44 : 40}
            sx={{ color: isVideo ? 'text.secondary' : 'primary.main' }}
          />
        )}

        <Typography sx={styles.hint}>
          {showPreview || uploading || previewLoading ? hintWhenPreview ?? hint : hint}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} sx={styles.actionRow}>
          {!showPreview && !uploading && !previewLoading ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              sx={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              {uploadButtonLabel}
            </Button>
          ) : null}
          {showPreview && !uploading ? (
            <Button
              type="button"
              variant="outlined"
              color="primary"
              sx={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              {replaceButtonLabel}
            </Button>
          ) : null}
          {uploading ? (
            <Button type="button" variant="contained" color="primary" sx={styles.actionButton} disabled>
              {Number.isFinite(Number(uploadPercent))
                ? `Uploading ${Math.round(Number(uploadPercent))}%`
                : 'Uploading…'}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

export function VideoLessonWorkspaceFields({
  sourceType,
  onSourceTypeChange,
  duration,
  onDurationChange,
  onVideoFiles,
  videoSecondaryHint = null,
  videoPreviewUrl = '',
  videoPreviewSources = [],
  videoUploading = false,
  videoUploadPercent = null,
  videoPreviewLoading = false,
  onVideoRemove,
  showVideoRemove = false,
  watermarkText = '',
  onWatermarkTextChange,
  watermarkColor = DEFAULT_VIDEO_WATERMARK_COLOR,
  onWatermarkColorChange,
  watermarkOpacity = DEFAULT_VIDEO_WATERMARK_OPACITY,
  onWatermarkOpacityChange,
}) {
  return (
    <Stack sx={styles.root}>
      <Box>
        <Typography sx={styles.fieldLabel}>Source type</Typography>
        <FormControl fullWidth size="small">
          <Select
            value={sourceType}
            onChange={(e) => onSourceTypeChange(e.target.value)}
            displayEmpty
          >
            {SOURCE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography sx={styles.fieldLabel}>Lesson video</Typography>
        <MediaDropzone
          accept={{ 'video/*': ['.mp4', '.webm', '.ogg'] }}
          hint="Drag and drop a video here. Large files upload in chunks and can resume if the connection drops."
          hintWhenPreview="Drag and drop to replace the video file, or use Replace."
          uploadButtonLabel="Browse files"
          replaceButtonLabel="Replace video"
          icon="solar:video-frame-play-horizontal-bold"
          onFiles={onVideoFiles}
          isVideo
          disabled={videoUploading}
          previewUrl={videoPreviewUrl}
          previewSources={videoPreviewSources}
          uploading={videoUploading}
          uploadPercent={videoUploadPercent}
          previewLoading={videoPreviewLoading}
          watermarkText={watermarkText}
          watermarkColor={watermarkColor}
          watermarkOpacity={watermarkOpacity}
        />
        {videoSecondaryHint ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
            {videoSecondaryHint}
          </Typography>
        ) : null}
        {showVideoRemove ? (
          <Button
            type="button"
            size="small"
            color="error"
            sx={{ ...styles.removeLink, mt: 0.5, alignSelf: 'flex-start' }}
            disabled={videoUploading}
            onClick={onVideoRemove}
          >
            Remove video
          </Button>
        ) : null}
      </Box>

      <Box>
        <Typography sx={styles.fieldLabel}>Video watermark</Typography>
        <TextField
          fullWidth
          size="small"
          value={watermarkText}
          onChange={(e) => onWatermarkTextChange?.(e.target.value)}
          placeholder="Text tiled over this video"
          helperText="Shown on this video only. Leave blank for no watermark. Color and opacity update the preview now. Click Save lesson to keep them."
          slotProps={{ htmlInput: { maxLength: VIDEO_WATERMARK_MAX_LENGTH } }}
        />
        <WatermarkAppearanceFields
          color={watermarkColor}
          opacity={watermarkOpacity}
          onColorChange={onWatermarkColorChange}
          onOpacityChange={onWatermarkOpacityChange}
        />
      </Box>

      <Box>
        <Typography sx={styles.fieldLabel}>Lesson duration</Typography>
        <TextField
          fullWidth
          size="small"
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          placeholder="Example: 2h 45m"
        />
      </Box>
    </Stack>
  );
}
