import nodemailer from "nodemailer";

const getEnv = (key) => import.meta.env[key] || process.env[key];

export const getContactEmail = () => getEnv("CONTACT_EMAIL") || "reyes_garcia_miro@hotmail.com";

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendEmail = async ({ to, subject, html, replyTo, attachments }) => {
  const host = getEnv("SMTP_HOST") || "smtp.mail.ovh.net";
  const port = Number(getEnv("SMTP_PORT")) || 465;
  const user = getEnv("SMTP_USER") || "info@reyesgarciamiro.com";
  const pass = getEnv("SMTP_PASSWORD");

  if (!pass) {
    console.warn("SMTP no configurado. Revisa SMTP_PASSWORD en las variables de entorno.");
    return { skipped: true };
  }

  const recipients = Array.isArray(to) ? to.join(", ") : to;

  if (!recipients) {
    console.warn("No se han especificado destinatarios para el envío de correo.");
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true para puerto 465 (SSL/TLS), false para 587 (STARTTLS)
    auth: {
      user,
      pass
    }
  });

  const mailOptions = {
    from: `"Reyes García Miró" <${user}>`,
    to: recipients,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
    ...(attachments?.length ? { attachments } : {})
  };

  const info = await transporter.sendMail(mailOptions);

  return { skipped: false, data: info };
};
