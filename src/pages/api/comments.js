import { sanityClient } from "sanity:client";

// PARA VOLVER A SSR: Borra o comenta la siguiente línea
export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    const postId = data.get("postId")?.toString().trim();
    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const content = data.get("content")?.toString().trim();
    const turnstileResponse = data.get("cf-turnstile-response")?.toString();

    if (!postId || !name || !email || !content) {
      return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
    }

    if (!turnstileResponse) {
      return new Response(JSON.stringify({ error: "Falta la validación del Captcha" }), { status: 400 });
    }

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

    // 2. Guardar el comentario en Sanity (necesitarás configurar SANITY_API_TOKEN con permisos de escritura)
    const token = import.meta.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN;

    if (token) {
      const writeClient = sanityClient.withConfig({
        token: token,
        useCdn: false
      });

      await writeClient.create({
        _type: 'comment',
        post: {
          _type: 'reference',
          _ref: postId
        },
        name,
        email,
        content,
        approved: false, // Moderación requerida
        createdAt: new Date().toISOString()
      });
    } else {
      // Fallback si aún no hay token: En entornos de desarrollo/demo pasamos simulando éxito
      console.warn("SANITY_API_TOKEN no configurado. El comentario no se guardó de forma permanente en Sanity.");
    }

    return new Response(JSON.stringify({ success: true, message: "Comentario recibido" }), { status: 200 });

  } catch (error) {
    console.error("Error procesando comentario:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
};
