import fs from "node:fs";
import path from "node:path";
import { escapeHtml, getContactEmail, sendEmail } from "../../utils/email.js";

// PARA VOLVER A SSR: Borra o comenta la siguiente línea
export const prerender = false;

export const POST = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email")?.toString().trim();
  const name = data.get("name")?.toString().trim();
  const pdfUrl = new URL("/Vence-la-ansiedad.pdf", request.url).toString();

  const localPdfPath = path.join(process.cwd(), "public", "Vence-la-ansiedad.pdf");
  const attachmentPath = fs.existsSync(localPdfPath) ? localPdfPath : pdfUrl;

  if (!email || !name) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  try {
    await sendEmail({
      to: getContactEmail(),
      subject: "Nueva suscripción a la newsletter",
      html: `
        <h1>Nueva suscripción a la newsletter</h1>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      `,
      replyTo: email,
    });

    await sendEmail({
      to: [email],
      subject: "Tu guía para comprender y gestionar la ansiedad",
      html: `
        <p>Hola ${escapeHtml(name)},</p>
        <p>Gracias por suscribirte a mi newsletter.</p>
        <p>Te envío adjunta la guía <strong>Vence la ansiedad</strong> para que puedas empezar a comprender mejor qué es la ansiedad y cómo gestionarla.</p>
        <p>Un saludo,<br>Reyes García Miró</p>
      `,
      attachments: [
        {
          filename: "Vence-la-ansiedad.pdf",
          path: attachmentPath
        }
      ],
    });

    return new Response(JSON.stringify({ success: true, message: "Suscrito con éxito" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error interno del servidor al enviar la suscripción" }), { status: 500 });
  }
};
