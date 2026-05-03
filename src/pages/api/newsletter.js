export const POST = async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');
  const name = data.get('name');

  // TODO: Integrar aquí el envío por SMTP (ej: nodemailer) a través del hosting de OVH
  // o integración con MailerLite/Mailchimp.
  console.log(`Nuevo suscriptor: ${name} (${email})`);

  return new Response(JSON.stringify({ success: true, message: 'Suscrito con éxito' }), { status: 200 });
}
