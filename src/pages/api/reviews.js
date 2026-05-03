import { addReview } from '../../db.js';

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

  try {
    addReview({ name, title, content, rating, date });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}
