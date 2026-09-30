import axios from 'src/lib/axios';

export async function fetchPublicPaymentMethods() {
  const { data } = await axios.get('/api/payment-methods');
  return data?.data ?? { banks: [], ewallets: [] };
}

export async function fetchBankPaymentMethods() {
  const { data } = await axios.get('/api/admin/bank-payment-methods');
  return data?.data ?? [];
}

export async function createBankPaymentMethod(payload) {
  const { data } = await axios.post('/api/admin/bank-payment-methods', payload);
  return data?.data;
}

export async function updateBankPaymentMethod(publicId, payload) {
  const { data } = await axios.patch(
    `/api/admin/bank-payment-methods/${encodeURIComponent(publicId)}`,
    payload
  );
  return data?.data;
}

export async function deleteBankPaymentMethod(publicId) {
  await axios.delete(`/api/admin/bank-payment-methods/${encodeURIComponent(publicId)}`);
}

export async function fetchEwalletPaymentMethods() {
  const { data } = await axios.get('/api/admin/ewallet-payment-methods');
  return data?.data ?? [];
}

export async function createEwalletPaymentMethod(payload) {
  const { data } = await axios.post('/api/admin/ewallet-payment-methods', payload);
  return data?.data;
}

export async function updateEwalletPaymentMethod(publicId, payload) {
  const { data } = await axios.patch(
    `/api/admin/ewallet-payment-methods/${encodeURIComponent(publicId)}`,
    payload
  );
  return data?.data;
}

export async function deleteEwalletPaymentMethod(publicId) {
  await axios.delete(`/api/admin/ewallet-payment-methods/${encodeURIComponent(publicId)}`);
}
