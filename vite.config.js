import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // dev: forward API calls to a local PHP server
      // php -S localhost:8000 -t api
      '/api': { target: 'http://localhost:8000', changeOrigin: true }
    }
  }
})
