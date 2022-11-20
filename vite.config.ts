import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
      vue({
        script: {
          refSugar: true
        }
      })
  ],
  build:{
    rollupOptions:{
      plugins: [
      ]
    }
  },
  optimizeDeps:{
    include: [
    ]
  },
  resolve:{
    alias:{
      'simple-peer': 'simple-peer/simplepeer.min.js'
    }
  }
})
