import axios from 'src/lib/axios';

export async function fetchAboutUsPublic(preview = false) {
  const { data } = await axios.get('/api/about-us', {
    params: preview ? { preview: 1 } : undefined,
  });
  return data;
}

export async function fetchAboutUsAdmin() {
  const { data } = await axios.get('/api/admin/about-us');
  return data;
}

export async function updateAboutUsSection(sectionKey, payload) {
  const { data } = await axios.put(`/api/admin/about-us/${encodeURIComponent(sectionKey)}`, payload);
  return data;
}

export async function publishAllAboutUsSections() {
  const { data } = await axios.post('/api/admin/about-us/publish-all');
  return data;
}
