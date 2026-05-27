import { defineField, defineType } from 'sanity';

export const commentType = defineType({
  name: 'comment',
  title: 'Comentario',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'content',
      title: 'Comentario',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'post',
      title: 'Post al que pertenece',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      description: 'Los comentarios deben ser aprobados antes de mostrarse en la web.',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'content',
      approved: 'approved'
    },
    prepare({ title, subtitle, approved }) {
      return {
        title: `${title} ${approved ? '✅' : '⏳'}`,
        subtitle
      }
    }
  }
});
