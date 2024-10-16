export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      httpHost: 'http://soft-redirections-backend:8080'
    }
  },

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})
