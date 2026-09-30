import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ReorderControls } from '../../components/ReorderControls';
import { CmsImageUploadField } from '../../components/CmsImageUploadField';

function SectionShell({ title, sectionKey, children }) {
  const { watch, setValue } = useFormContext();
  const visible = watch(`sections.${sectionKey}.visible`);
  const status = watch(`sections.${sectionKey}.status`);

  return (
    <Card variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <Typography variant="h6">{title}</Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(visible)}
                  onChange={(e) => setValue(`sections.${sectionKey}.visible`, e.target.checked, {
                    shouldDirty: true,
                  })}
                />
              }
              label="Visible"
            />
            <TextField
              select
              size="small"
              label="Status"
              value={status ?? 'published'}
              sx={{ minWidth: 140 }}
              onChange={(e) =>
                setValue(`sections.${sectionKey}.status`, e.target.value, { shouldDirty: true })
              }
            >
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </TextField>
          </Stack>
        </Stack>
        <Divider />
        {children}
      </Stack>
    </Card>
  );
}

function TextRow({ name, label, multiline = false }) {
  const { register } = useFormContext();
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      multiline={multiline}
      minRows={multiline ? 3 : 1}
      {...register(name)}
    />
  );
}

function ParagraphsEditor({ sectionKey, label = 'Paragraph' }) {
  const { control, register } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `sections.${sectionKey}.paragraphs`,
  });

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2">Body paragraphs</Typography>
      {fields.map((field, index) => (
        <Stack key={field.id} spacing={1}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              fullWidth
              size="small"
              label={`${label} ${index + 1}`}
              multiline
              minRows={3}
              {...register(`sections.${sectionKey}.paragraphs.${index}`)}
            />
            <ReorderControls
              index={index}
              total={fields.length}
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
            />
          </Stack>
          {fields.length > 1 ? (
            <Button size="small" color="error" onClick={() => remove(index)} sx={{ alignSelf: 'flex-start' }}>
              Remove
            </Button>
          ) : null}
        </Stack>
      ))}
      <Button
        size="small"
        variant="outlined"
        onClick={() => append('')}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add paragraph
      </Button>
    </Stack>
  );
}

export function CompanyOverviewEditor() {
  const { control } = useFormContext();

  return (
    <SectionShell title="Company Overview" sectionKey="company_overview">
      <Stack spacing={2}>
        <TextRow name="sections.company_overview.title" label="Section title" />
        <TextRow
          name="sections.company_overview.leadParagraph"
          label="Lead paragraph (beside banner image)"
          multiline
        />
        <Controller
          name="sections.company_overview.logo"
          control={control}
          render={({ field }) => (
            <CmsImageUploadField
              label="Banner image"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <ParagraphsEditor sectionKey="company_overview" />
      </Stack>
    </SectionShell>
  );
}

export function MissionEditor() {
  return (
    <SectionShell title="Mission" sectionKey="mission">
      <Stack spacing={2}>
        <TextRow name="sections.mission.title" label="Section title" />
        <ParagraphsEditor sectionKey="mission" />
      </Stack>
    </SectionShell>
  );
}
