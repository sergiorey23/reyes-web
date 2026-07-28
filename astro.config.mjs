// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://reyesgarciamiro.es',
  // PARA VOLVER A SSR: Cambia 'static' por 'server'
  output: 'static',
  redirects: {
    '/contacto-reyes-garcia-miro': '/contacto',
    '/servicios_psicoterapia-on-line': '/servicios',
    '/nuevos-cerebros': '/blog',
    '/mindfulness-como-la-atencion-plena-transforma-tu-bienestar': '/blog/mindfulness-como-la-atencion-plena-transforma-tu-bienestar',
    '/la-ansiedad-entenderla-para-superarla': '/blog/la-ansiedad-entenderla-para-superarla',
    '/enfoques-terapeuticos-en-psicologia-como-elegir-el-tratamiento-que-mejor-se-adapta-a-ti': '/blog/enfoques-terapeuticos-en-psicologia-como-elegir-el-tratamiento-que-mejor-se-adapta-a-ti',
    '/el-adulto-con-tdah-desafios-y-oportunidades': '/blog/el-adulto-con-tdah-desafios-y-oportunidades',
    '/depresion-entendiendo-el-dolor-invisible-y-como-encontrar-el-camino-hacia-la-recuperacion': '/blog/depresion-entendiendo-el-dolor-invisible-y-como-encontrar-el-camino-hacia-la-recuperacion',
    '/mi-relacion-de-pareja-es-toxica': '/blog/mi-relacion-de-pareja-es-toxica',
    '/la-salud-mental-como-problema-de-salud-publica': '/blog/la-salud-mental-como-problema-de-salud-publica',
    '/cuidar-la-mente-de-tu-hijo-guia-practica-de-psicologia-infantil-para-padres': '/blog/cuidar-la-mente-de-tu-hijo-guia-practica-de-psicologia-infantil-para-padres',
    '/tdah-trastorno-o-altas-capacidades': '/blog/tdah-trastorno-o-altas-capacidades',
    '/pensamientos-obsesivos-pensamientos-obsesivos-por-que-ocurren-y-como-gestionarlos': '/blog/pensamientos-obsesivos-pensamientos-obsesivos-por-que-ocurren-y-como-gestionarlos',
    '/pornografia-y-prostitucion-dos-caras-de-una-misma-moneda': '/blog/pornografia-y-prostitucion-dos-caras-de-una-misma-moneda',
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
  security: {
    checkOrigin: false,
  },
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
      cors: true,
    },
  },
  adapter: vercel({
    imageService: true,
  }),
  integrations: [
    sitemap(),
    sanity({
      projectId: '1arljs9t',
      dataset: 'production',
      useCdn: false, // `false` si quieres asegurarte de ver datos frescos, o true para mejor rendimiento
      studioBasePath: '/admin', // Ruta para acceder al CMS incrustado
    }),
    react()
  ],
});
