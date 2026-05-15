// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  //site: 'https://reyesgarciamiro.es',
  output: 'server',
  server: {
    allowedHosts: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
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
