import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@brush': 'https://unpkg.com/@frova_happy/brush@0.0.8/dist/web/index.js'
    }
  }
})