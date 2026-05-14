import { escapeHtml, getEmailRecipients, sendEmail } from "../../utils/resend.js";

export const POST = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email")?.toString().trim();
  const name = data.get("name")?.toString().trim();
  const phone = data.get("phone")?.toString().trim();
  const message = data.get("message")?.toString().trim();

  if (!email || !name || !message) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  try {
    await sendEmail({
      to: getEmailRecipients("RESEND_CONTACT_TO_EMAIL", "RESEND_TO_EMAIL"),
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(phone || "No indicado")}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
      `,
      replyTo: email,
      idempotencyKey: `contact/${email}/${Date.now()}`
    });

    return new Response(JSON.stringify({ success: true, message: "Mensaje enviado con éxito" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error interno del servidor al enviar el mensaje" }), { status: 500 });
  }
};
