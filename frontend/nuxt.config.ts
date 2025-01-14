export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    plugins: ['~/server/plugins/redirect']
  },

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
