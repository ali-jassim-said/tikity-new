import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        {
          name: 'description',
          content: 'tickity'
        }
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'in-out'
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-swiper',
     'usebootstrap'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
   
  },
  plugins: [
    '~/plugins/pinia.js',
    '~/plugins/iconify.js',
  ],
  css: [
    './assets/css/style.css',
    'remixicon/fonts/remixicon.css',
  ],
  runtimeConfig: {
    public: {
      BASEURL: process.env.BASEURL,
    },
  },
})
