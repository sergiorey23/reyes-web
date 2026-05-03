// Simulador de Base de Datos en Memoria para el Prototipo en Vercel
// En producción, aquí conectarías Turso (LibSQL) o una base de datos real.

export const reviewsDB = [
  {
    id: 1,
    name: 'Cristina',
    title: 'La mejor decisión de mi vida',
    content: 'La mejor decisión de mi vida? Ir a terapia con Reyes!! Te coge de la mano sin que te des cuenta y te acompaña por caminos que ni sabías que existían. Sin duda, 100% recomendable.',
    rating: 5,
    date: '2023-10-23',
    approved: 1
  },
  {
    id: 2,
    name: 'Cristina P.',
    title: 'Fue un regalo en mi vida',
    content: 'Honestidad, profesionalidad, versatilidad, cariño y apoyo es lo que he tenido siempre de su mano, sanando las cosas más dolorosas de mi vida.',
    rating: 5,
    date: '2023-11-03',
    approved: 1
  },
  {
    id: 3,
    name: 'Conrado',
    title: 'Crecimiento y madurez',
    content: 'Empecé a ir a terapia con Reyes hace cuatro años y he tomado algunas de las decisiones más importantes de mi vida. No puedo estar más agradecido.',
    rating: 5,
    date: '2023-10-28',
    approved: 1
  }
];

export const addReview = (review) => {
  const newReview = {
    ...review,
    id: reviewsDB.length + 1,
    approved: 1 // Por defecto en 1 para que se vea en el prototipo
  };
  // Lo añadimos al principio
  reviewsDB.unshift(newReview);
  return newReview;
};

export const getApprovedReviews = () => {
  return reviewsDB.filter(r => r.approved === 1);
};

