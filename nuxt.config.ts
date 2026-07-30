// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  vite: {
    define: {
      'GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY)
    }
  },
  modules: [
    'nuxt-swiper',
    "@vueuse/nuxt",
    '@nuxt/ui',
    'nuxt-gtag',
  ],
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  fonts: {
    providers: {
      // Wallpaper fonts are lazy-injected by composables/googlefonts.js, so
      // @nuxt/fonts only needs to resolve the UI font — skip fontshare lookups.
      fontshare: false,
    },
  },
  colorMode: {
    preference: 'dark'
  },
  gtag: {
    id: 'G-5V36NE6QMX'
  }
})
