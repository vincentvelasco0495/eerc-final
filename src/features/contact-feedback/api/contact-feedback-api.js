import axios from 'src/lib/axios';

export async function submitContactFeedback(payload) {
  const { data } = await axios.post('/api/contact-feedback', payload);
  return data;
}

export async function fetchContactFeedbackAdmin({ page = 1, perPage = 20 } = {}) {
  const { data } = await axios.get('/api/admin/contact-feedback', {
    params: { page, per_page: perPage },
  });
  return data;
}
