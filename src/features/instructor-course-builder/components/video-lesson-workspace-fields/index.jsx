import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
import { VIDEO_WATERMARK_MAX_LENGTH } from '../../utils/lesson-authoring-helpers';

const SOURCE_OPTIONS = [{ value: 'html-mp4', label: 'HTML (MP4)' }];

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
          helperText="Shown on this video only. Leave blank for no watermark. Click Save lesson after editing."
          slotProps={{ htmlInput: { maxLength: VIDEO_WATERMARK_MAX_LENGTH } }}
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
