import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { CONFIG } from 'src/global-config';
import { submitContactFeedback } from 'src/features/contact-feedback/api/contact-feedback-api';

import { toast } from 'src/components/snackbar';

import { styles } from 'src/sections/contact/view/contact-view.styles';

function formatValidationMessage(data) {
  if (!data?.errors || typeof data.errors !== 'object') {
    return data?.message ?? null;
  }
  const parts = Object.values(data.errors).flat().filter(Boolean);
  return parts.length ? parts.join(' ') : data?.message ?? null;
}

export function ContactFeedbackForm({ feedback }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasApi = Boolean(CONFIG.serverUrl?.trim());

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!hasApi) {
        toast.error('Contact form requires the API (set VITE_SERVER_URL).');
        return;
      }
      if (!name.trim() || !email.trim() || !message.trim()) {
        toast.error('Please fill in your name, email, and message.');
        return;
      }

      setSubmitting(true);
      try {
        await submitContactFeedback({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          message: message.trim(),
        });
        toast.success('Thank you — your message was sent.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } catch (e) {
        const msg = formatValidationMessage(e?.response?.data) ?? e?.message ?? 'Submit failed.';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [email, hasApi, message, name, phone]
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.formCard}>
      <TextField
        fullWidth
        placeholder={feedback.placeholderName ?? 'Your Name'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
        sx={styles.input}
      />

      <Box sx={styles.formRow}>
        <TextField
          fullWidth
          placeholder={feedback.placeholderEmail ?? 'Your Email'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          sx={styles.input}
        />
        <TextField
          fullWidth
          type="tel"
          placeholder={feedback.placeholderPhone ?? 'Your phone number'}
          inputProps={{ inputMode: 'tel', autoComplete: 'tel' }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
          sx={styles.input}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        minRows={7}
        placeholder={
          feedback.placeholderMessage ??
          'Tell us how we can help with EERC LMS, your program setup, learner support, or course delivery needs.'
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={submitting}
        sx={styles.textArea}
      />

      <Stack direction="row" justifyContent="flex-end" sx={styles.formActionsRow}>
        <Button type="submit" variant="contained" size="large" sx={styles.submitButton} disabled={submitting}>
          {submitting ? 'Sending…' : feedback.submitButtonLabel ?? 'Submit'}
        </Button>
      </Stack>
    </Box>
  );
}
