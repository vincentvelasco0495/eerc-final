import axios from 'src/lib/axios';

export async function fetchHomepageV2Public(preview = false) {
  const { data } = await axios.get('/api/homepage-v2', {
    params: preview ? { preview: 1 } : undefined,
  });
  return data;
}

export async function fetchHomepageV2Admin() {
  const { data } = await axios.get('/api/admin/homepage-v2');
  return data;
}

export async function updateHomepageV2Section(sectionKey, payload) {
  const { data } = await axios.put(`/api/admin/homepage-v2/${encodeURIComponent(sectionKey)}`, payload);
  return data;
}

export async function publishAllHomepageV2Sections() {
  const { data } = await axios.post('/api/admin/homepage-v2/publish-all');
  return data;
}

export async function uploadCmsMedia(file, alt = '') {
  const form = new FormData();
  form.append('file', file);
  if (alt) {
    form.append('alt', alt);
  }
  const { data } = await axios.post('/api/admin/upload', form);
  return data?.data ?? data;
}

export async function deleteCmsMedia(mediaId) {
  await axios.delete(`/api/admin/media/${encodeURIComponent(mediaId)}`);
}
