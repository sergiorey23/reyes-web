import { escapeHtml, getEmailRecipients, sendEmail } from "../../utils/resend.js";

// PARA VOLVER A SSR: Borra o comenta la siguiente línea
export const prerender = false;

export const POST = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email")?.toString().trim();
  const name = data.get("name")?.toString().trim();
  const phone = data.get("phone")?.toString().trim();
  const message = data.get("message")?.toString().trim();
  const turnstileResponse = data.get("cf-turnstile-response")?.toString();

  if (!email || !name || !message) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  if (!turnstileResponse) {
    return new Response(JSON.stringify({ error: "Falta la validación del Captcha" }), { status: 400 });
  }

  try {
    // 1. Validar Captcha con Cloudflare Turnstile
    const TURNSTILE_SECRET = import.meta.env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for");

    const turnstileFormData = new URLSearchParams();
    turnstileFormData.append("secret", TURNSTILE_SECRET);
    turnstileFormData.append("response", turnstileResponse);
    if (ip) turnstileFormData.append("remoteip", ip);

    const turnstileVerify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: turnstileFormData,
    });

    const turnstileResult = await turnstileVerify.json();

    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ error: "Fallo en la validación del Captcha" }), { status: 400 });
    }

    // 2. Enviar el email
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
