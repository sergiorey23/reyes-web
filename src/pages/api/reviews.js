import { sanityClient } from "sanity:client";
import { escapeHtml, getEmailRecipients, sendEmail } from "../../utils/resend.js";

export const POST = async ({ request }) => {
  const data = await request.formData();

  const rating = Number(data.get("rating"));
  const title = data.get("title")?.toString().trim();
  const content = data.get("content")?.toString().trim();
  const name = data.get("name")?.toString().trim() || "Anónimo";
  const date = new Date().toISOString().split("T")[0];

  if (!rating || !title || !content) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  // Lógica de aprobación automática si tiene 5 estrellas
  const isApproved = rating === 5;

  try {
    // Para escribir en Sanity necesitamos inicializar un cliente con el token de escritura
    // sanityClient por defecto (importado de sanity:client) es de solo lectura.
    // Necesitamos usar la variable de entorno SANITY_API_TOKEN

    // Importante: En Astro podemos acceder a variables de entorno con import.meta.env
    const SANITY_API_TOKEN = import.meta.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN;

    if (!SANITY_API_TOKEN) {
       console.error("Falta SANITY_API_TOKEN en el entorno");
       return new Response(JSON.stringify({ error: 'Error de configuración del servidor' }), { status: 500 });
    }

    const writeClient = sanityClient.withConfig({
      token: SANITY_API_TOKEN,
      useCdn: false,
    });

    const review = await writeClient.create({
      _type: "review",
      name,
      title,
      content,
      rating,
      date,
      approved: isApproved
    });

    try {
      await sendEmail({
        to: getEmailRecipients("RESEND_REVIEWS_TO_EMAIL", "RESEND_TO_EMAIL"),
        subject: `Nueva reseña recibida (${rating}/5)`,
        html: `
          <h1>Nueva reseña recibida</h1>
          <p><strong>Estado:</strong> ${isApproved ? "Publicada automáticamente" : "Pendiente de moderación"}</p>
          <p><strong>Puntuación:</strong> ${rating}/5</p>
          <p><strong>Título:</strong> ${escapeHtml(title)}</p>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Reseña:</strong></p>
          <p>${escapeHtml(content).replaceAll("\n", "<br>")}</p>
        `,
        idempotencyKey: `review/${review._id}`
      });
    } catch (emailError) {
      console.error("La reseña se guardó, pero falló el aviso por email:", emailError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error interno del servidor al guardar en Sanity" }), { status: 500 });
  }
};
