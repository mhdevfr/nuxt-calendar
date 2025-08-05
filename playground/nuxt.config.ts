export default defineNuxtConfig({
  compatibilityDate: '2025-08-05',
  modules: ['../src/module', '@nuxtjs/tailwindcss'],
  calendar: {
    prefix: 'Nuxt',
    defaultConfig: {
      locale: 'fr-FR',
      firstDayOfWeek: 1,
      showWeekNumbers: true,
      theme: 'auto'
    }
  },
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})