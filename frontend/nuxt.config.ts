export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    apiBackendHost: '',
    public: {
      apiBackendHost: ''
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
