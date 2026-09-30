import { Controller, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

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
      minRows={multiline ? 4 : 1}
      {...register(name)}
    />
  );
}

export function ContactDetailsEditor() {
  return (
    <SectionShell title="Contact details & map" sectionKey="details">
      <Stack spacing={2}>
        <TextRow name="sections.details.contactInfoTitle" label="Contact info heading" />
        <TextRow name="sections.details.locationTitle" label="Location heading" />
        <TextRow name="sections.details.address" label="Address (all branches)" multiline />
        <TextRow name="sections.details.phone" label="Phone (display)" />
        <TextRow name="sections.details.email" label="Email address" />
        <TextRow name="sections.details.facebookDisplay" label="Facebook link text" />
        <TextRow name="sections.details.facebookUrl" label="Facebook URL" />
        <TextRow name="sections.details.mapEmbedUrl" label="Google Maps embed URL" />
        <TextRow name="sections.details.mapIframeTitle" label="Map iframe title (accessibility)" />
      </Stack>
    </SectionShell>
  );
}

export function ContactFeedbackEditor() {
  return (
    <SectionShell title="Feedback form" sectionKey="feedback">
      <Stack spacing={2}>
        <TextRow name="sections.feedback.feedbackTitle" label="Section heading" />
        <TextRow name="sections.feedback.placeholderName" label="Name placeholder" />
        <TextRow name="sections.feedback.placeholderEmail" label="Email placeholder" />
        <TextRow name="sections.feedback.placeholderPhone" label="Phone placeholder" />
        <TextRow name="sections.feedback.placeholderMessage" label="Message placeholder" multiline />
        <TextRow name="sections.feedback.submitButtonLabel" label="Submit button label" />
      </Stack>
    </SectionShell>
  );
}

export function ContactRepresentativeEditor() {
  const { control } = useFormContext();

  return (
    <SectionShell title="Sidebar contact card" sectionKey="representative">
      <Stack spacing={2}>
        <TextRow name="sections.representative.sidebarTitle" label="Sidebar heading" />
        <TextRow name="sections.representative.name" label="Name" />
        <TextRow name="sections.representative.role" label="Role / subtitle" />
        <TextRow name="sections.representative.phone" label="Phone (display)" />
        <TextRow name="sections.representative.email" label="Email" />
        <TextRow name="sections.representative.extra" label="Note (plain text)" multiline />
        <Controller
          name="sections.representative.avatar"
          control={control}
          render={({ field }) => (
            <CmsImageUploadField label="Photo (optional)" value={field.value} onChange={field.onChange} />
          )}
        />
      </Stack>
    </SectionShell>
  );
}
