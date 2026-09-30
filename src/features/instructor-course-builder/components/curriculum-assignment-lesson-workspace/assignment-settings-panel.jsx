import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { AssignmentMaterialsField } from './assignment-materials-field';
import { TextLessonWorkspaceSettings } from '../text-lesson-workspace-settings';

const TIME_UNIT_OPTIONS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
];

export function AssignmentSettingsPanel({
  attemptsAllowed,
  onAttemptsAllowedChange,
  duration,
  onDurationChange,
  timeUnit,
  onTimeUnitChange,
  resetTimeLimitOnRetake,
  onResetTimeLimitOnRetakeChange,
  lessonPreview,
  onLessonPreviewChange,
  contentHtml,
  onContentHtmlChange,
  materials = [],
  onMaterialsChange,
  onCreate,
  createDisabled = false,
}) {
  return (
    <Box sx={styles.settingsRoot}>
      <Box sx={styles.settingsCard}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography component="label" sx={styles.quizSettingsFieldLabel} htmlFor="assignment-attempts">
              Assignment attempts
            </Typography>
            <TextField
              id="assignment-attempts"
              type="number"
              fullWidth
              size="small"
              value={attemptsAllowed}
              onChange={(e) => onAttemptsAllowedChange(Number(e.target.value) || 1)}
              inputProps={{ min: 1, max: 99 }}
              InputProps={{ sx: styles.quizSettingsNumberInput }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography component="label" sx={styles.quizSettingsFieldLabel} htmlFor="assignment-duration">
              Assignment duration
            </Typography>
            <TextField
              id="assignment-duration"
              type="number"
              fullWidth
              size="small"
              value={duration}
              onChange={(e) => onDurationChange(Number(e.target.value) || 0)}
              inputProps={{ min: 0 }}
              InputProps={{ sx: styles.quizSettingsNumberInput }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography component="label" sx={styles.quizSettingsFieldLabel}>
              Time unit
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={timeUnit}
                onChange={(e) => onTimeUnitChange(e.target.value)}
                sx={styles.quizSettingsSelect}
              >
                {TIME_UNIT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControlLabel
          sx={{ ...styles.quizSettingsSwitchRow, mt: 1.5 }}
          control={
            <Switch
              checked={resetTimeLimitOnRetake}
              onChange={(e) => onResetTimeLimitOnRetakeChange(e.target.checked)}
            />
          }
          label={
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
              Reset time limit when retaking an assignment
              <Tooltip title="When enabled, the countdown restarts on each retake attempt.">
                <Box component="span" sx={{ display: 'inline-flex', color: 'info.main' }}>
                  <Iconify icon="solar:info-circle-bold" width={18} />
                </Box>
              </Tooltip>
            </Box>
          }
        />

        <TextLessonWorkspaceSettings
          lessonPreview={lessonPreview}
          onLessonPreviewChange={onLessonPreviewChange}
          showUnlockAfterPurchase={false}
          hideDuration
        />

        <Typography component="label" sx={{ ...styles.quizSettingsFieldLabel, mt: 2 }}>
          Assignment content
        </Typography>
        <Box sx={styles.editorShell}>
          <Editor
            value={contentHtml}
            onChange={onContentHtmlChange}
            placeholder="Describe the assignment instructions for learners…"
            fullItem
            chrome="tinymce"
            sx={{ minHeight: 320, maxHeight: 560 }}
            tinymceResizeBounds={{ min: 180, max: 420 }}
          />
        </Box>

        <AssignmentMaterialsField
          materials={materials}
          onMaterialsChange={onMaterialsChange}
          disabled={createDisabled}
        />

        <Box sx={styles.contentCreateRow}>
          <Button
            variant="contained"
            color="primary"
            sx={styles.contentCreateBtn}
            onClick={onCreate}
            disabled={createDisabled}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
