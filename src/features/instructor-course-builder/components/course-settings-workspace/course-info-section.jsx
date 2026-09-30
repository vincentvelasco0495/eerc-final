import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

import { css } from './styles';

function resolveServerAssetUrl(value) {
  return resolveApiAssetUrl(value);
}

export function CourseInfoSection({
  courseName,
  onCourseNameChange,
  slug,
  onSlugChange,
  slugReadOnly = false,
  fullCourseUrlPrefix,
  programId,
  onProgramIdChange,
  programDisabled = false,
  programOptions = [],
  onBannerImageFileChange,
  courseCoverSrc,
  courseCoverMediaId = '',
  courseDuration,
  onCourseDurationChange,
  videoDuration,
  onVideoDurationChange,
  descriptionHtml,
  onDescriptionHtmlChange,
  lockLessonsInOrder,
  onLockLessonsInOrderChange,
}) {
  const displayUrlPrefix = `${fullCourseUrlPrefix.replace(/\/$/, '')}/`;
  const mediaId = String(courseCoverMediaId ?? '').trim();
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  const coverSrcResolved =
    mediaId && base ? `${base}/api/media/${encodeURIComponent(mediaId)}/file` : resolveServerAssetUrl(courseCoverSrc);

  return (
    <>
      <Typography sx={css.pageTitle} component="h1">
        Main
      </Typography>

      <Typography sx={css.sectionHeadingCourseInfo} component="h2">
        Course info
      </Typography>

      <Box>
        <Typography sx={css.fieldLabel} component="label" htmlFor="course-name-settings">
          Course name
        </Typography>
        <TextField
          id="course-name-settings"
          fullWidth
          size="small"
          value={courseName}
          onChange={(e) => onCourseNameChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography sx={css.fieldLabel} component="label" htmlFor="course-slug">
          Url:
        </Typography>
        <Typography sx={css.urlHelper}>{displayUrlPrefix}</Typography>
        <TextField
          id="course-slug"
          fullWidth
          size="small"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          disabled={slugReadOnly}
          InputProps={{
            readOnly: slugReadOnly,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" edge="end" aria-label="Edit slug">
                  <Iconify icon="solar:pen-bold" width={20} sx={{ opacity: 0.55 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: '8px' },
          }}
        />
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography sx={css.fieldLabel}>Programs</Typography>
        <FormControl fullWidth size="small" disabled={programDisabled}>
          <Select
            value={programId}
            onChange={(e) => onProgramIdChange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            {programOptions.map((o) => (
              <MenuItem key={o.id} value={o.id} disabled={o.disabled}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography sx={css.fieldLabel}>Banner image</Typography>
        <Button variant="outlined" component="label" sx={{ borderRadius: '8px' }}>
          Upload banner image
          <input
            type="file"
            hidden
            accept="image/*"
            onClick={(event) => {
              event.currentTarget.value = '';
            }}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              if (!file) return;
              onBannerImageFileChange?.(file);
            }}
          />
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography sx={css.fieldLabel}>Image</Typography>
        <Box sx={[css.imageDropzone, !coverSrcResolved && css.imageDropzoneEmpty]}>
          {coverSrcResolved ? (
            <Box
              component="img"
              alt=""
              src={coverSrcResolved}
              sx={{ width: 1, maxHeight: 320, objectFit: 'cover' }}
            />
          ) : null}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={css.fieldLabel} component="label" htmlFor="course-duration-setting">
            Course duration
          </Typography>
          <TextField
            id="course-duration-setting"
            fullWidth
            size="small"
            value={courseDuration}
            onChange={(e) => onCourseDurationChange(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={css.fieldLabel} component="label" htmlFor="video-duration-setting">
            Video duration
          </Typography>
          <TextField
            id="video-duration-setting"
            fullWidth
            size="small"
            value={videoDuration}
            onChange={(e) => onVideoDurationChange(e.target.value)}
          />
        </Grid>
      </Grid>

      <Typography sx={[css.sectionHeadingMuted, { mt: 4 }]} component="h2">
        Description
      </Typography>
      <Editor
        value={descriptionHtml}
        onChange={onDescriptionHtmlChange}
        chrome="tinymce"
        sx={{
          mt: 1,
          minHeight: 280,
          maxHeight: 520,
        }}
        tinymceResizeBounds={{
          min: 120,
          max: 400,
        }}
      />

      <Divider sx={css.dividerSection} component="hr" />

      <LockLessonsToggle
        checked={lockLessonsInOrder}
        onChange={(e) => onLockLessonsInOrderChange(e.target.checked)}
      />
    </>
  );
}

function LockLessonsToggle({ checked, onChange }) {
  return (
    <FormControlLabel
      sx={{
        m: 0,
        mr: 'auto!important',
        alignItems: 'flex-start',
        gap: 0.75,
        py: 0.75,
        '& .MuiFormControlLabel-label': {
          mt: 0.5,
          fontWeight: 500,
          fontSize: 14,
          color: 'text.primary',
        },
      }}
      control={<Switch checked={checked} color="primary" onChange={onChange} />}
      label={
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}>
          <Typography component="span" fontWeight={500} fontSize={14}>
            Lock lessons in order
          </Typography>
          <Tooltip title="Learners must finish lessons sequentially before unlocking the next.">
            <IconButton size="small" aria-label="About Lock lessons in order" sx={{ p: 0.25 }}>
              <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'brand.accentText' }} />
            </IconButton>
          </Tooltip>
        </Box>
      }
    />
  );
}
