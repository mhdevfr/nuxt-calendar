export default defineNuxtConfig({
  compatibilityDate: '2025-08-05',
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', 'nuxt-calendar-module/runtime/assets/calendar.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})