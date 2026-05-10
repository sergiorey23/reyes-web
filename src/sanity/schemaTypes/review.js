export const reviewType = {
  name: 'review',
  title: 'Reseña',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre del cliente',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'title',
      title: 'Título de la reseña',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'content',
      title: 'Contenido',
      type: 'text',
      validation: (rule) => rule.required(),
    },
    {
      name: 'rating',
      title: 'Puntuación (1-5)',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
    },
    {
      name: 'approved',
      title: 'Aprobado para publicación',
      type: 'boolean',
      description: 'Si está marcado, la reseña se mostrará en la web.',
      initialValue: false, // Por defecto no se publican
    },
    {
      name: 'date',
      title: 'Fecha',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    },
  ],
};
