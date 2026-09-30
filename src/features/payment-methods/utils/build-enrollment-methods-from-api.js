/**
 * Maps `GET /api/payment-methods` payload → `EnrollmentPaymentDialog` method blocks.
 * @param {{ banks?: Array<Record<string, unknown>>, ewallets?: Array<Record<string, unknown>> }} data
 * @returns {Array<{ title: string, details: string[] }>}
 */
export function buildEnrollmentMethodsFromPaymentApi(data) {
  const banks = Array.isArray(data?.banks) ? data.banks : [];
  const ewallets = Array.isArray(data?.ewallets) ? data.ewallets : [];

  const out = [];

  banks.forEach((b, i) => {
    const accountName = String(b?.accountName ?? '').trim();
    const bankName = String(b?.bankName ?? '').trim();
    const accountNumber = String(b?.accountNumber ?? '').trim();

    const title =
      banks.length === 1 ? 'Bank transfer' : `Bank transfer (${bankName || `Option ${i + 1}`})`;

    const details = [
      accountName ? `Account name: ${accountName}` : null,
      bankName ? `Bank: ${bankName}` : null,
      accountNumber ? `Account number: ${accountNumber}` : null,
    ].filter(Boolean);

    if (details.length) {
      out.push({ title, details });
    }
  });

  ewallets.forEach((w, i) => {
    const mobile = String(w?.mobileNumber ?? '').trim();
    const accountName = String(w?.accountName ?? '').trim();

    const title =
      ewallets.length === 1 ? 'GCash / Maya' : `E-wallet (${mobile || `Option ${i + 1}`})`;

    const details = [
      mobile ? `Mobile number: ${mobile}` : null,
      accountName ? `Account name: ${accountName}` : null,
    ].filter(Boolean);

    if (details.length) {
      out.push({ title, details });
    }
  });

  return out;
}
