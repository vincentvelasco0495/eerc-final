import axios from 'src/lib/axios';

export async function authLoginApi(payload = {}) {
  const { data } = await axios.post('/api/auth/login', payload);
  return data;
}

export async function authLogoutApi(payload = {}) {
  const { data } = await axios.post('/api/auth/logout', payload);
  return data;
}
