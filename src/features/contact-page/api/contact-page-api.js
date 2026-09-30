import axios from 'src/lib/axios';

export async function fetchContactPagePublic(preview = false) {
  const { data } = await axios.get('/api/contact-page', {
    params: preview ? { preview: 1 } : undefined,
  });
  return data;
}

export async function fetchContactPageAdmin() {
  const { data } = await axios.get('/api/admin/contact-page');
  return data;
}

export async function updateContactPageSection(sectionKey, payload) {
  const { data } = await axios.put(`/api/admin/contact-page/${encodeURIComponent(sectionKey)}`, payload);
  return data;
}

export async function publishAllContactPageSections() {
  const { data } = await axios.post('/api/admin/contact-page/publish-all');
  return data;
}
