const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";

const getEnv = (key) => import.meta.env[key] || process.env[key];

export const getEmailRecipients = (...keys) => {
  const value = keys.map((key) => getEnv(key)).find(Boolean);

  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
};

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendEmail = async ({ to, subject, html, replyTo, attachments, idempotencyKey }) => {
  const apiKey = getEnv("RESEND_API_KEY");
  const from = getEnv("RESEND_FROM_EMAIL");

  if (!apiKey || !from || !to?.length) {
    console.warn("Resend no configurado. Revisa RESEND_API_KEY, RESEND_FROM_EMAIL y destinatarios.");
    return { skipped: true };
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      ...(attachments?.length ? { attachments } : {}),
      ...(replyTo ? { reply_to: [replyTo] } : {})
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Error al enviar email con Resend: ${response.status} ${JSON.stringify(payload)}`);
  }

  return { skipped: false, data: payload };
};