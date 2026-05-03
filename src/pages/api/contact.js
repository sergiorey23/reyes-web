export const POST = async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');
  const name = data.get('name');
  const message = data.get('message');

  // TODO: Configurar envío SMTP de OVH con nodemailer.
  console.log(`Nuevo mensaje de contacto de: ${name} (${email}) - Mensaje: ${message}`);

  return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado con éxito' }), { status: 200 });
}
