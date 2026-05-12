import { sanityClient } from "sanity:client";

export const POST = async ({ request }) => {
  const data = await request.formData();
  
  const rating = Number(data.get('rating'));
  const title = data.get('title')?.toString();
  const content = data.get('content')?.toString();
  const name = data.get('name')?.toString() || 'Anónimo';
  const date = new Date().toISOString().split('T')[0];

  if (!rating || !title || !content) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
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

    await writeClient.create({
      _type: 'review',
      name,
      title,
      content,
      rating,
      date,
      approved: isApproved
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor al guardar en Sanity' }), { status: 500 });
  }
}
