import { Resend } from "resend";

const getEnv = (key) => import.meta.env[key] || process.env[key];

export const getContactEmail = () => "reyes_garcia_miro@hotmail.com";

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendEmail = async ({ to, subject, html, replyTo, attachments }) => {
  const apiKey = getEnv("RESEND_API_KEY");

  if (!apiKey) {
    console.warn("Resend no configurado. Revisa RESEND_API_KEY en las variables de entorno.");
    return { skipped: true };
  }

  const recipients = Array.isArray(to) ? to : [to];

  if (!recipients.length || !recipients[0]) {
    console.warn("No se han especificado destinatarios para el envío de correo.");
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  const mailOptions = {
    from: "Reyes García Miró <info@reyesgarciamiro.com>",
    to: recipients,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
    ...(attachments?.length ? { attachments } : {}),
  };

  const { data, error } = await resend.emails.send(mailOptions);

  if (error) {
    throw new Error(`Error al enviar email con Resend: ${error.message}`);
  }

  return { skipped: false, data };
};
