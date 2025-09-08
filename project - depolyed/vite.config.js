import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'pages/about.html'),
        contact: resolve(__dirname, 'pages/contact.html'),
        gallery: resolve(__dirname, 'pages/gallery.html'),
        services: resolve(__dirname, 'pages/services.html'),
      },
    },
  },
})