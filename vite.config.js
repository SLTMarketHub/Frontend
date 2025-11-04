import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tmf-api': {
        target: 'https://markethub-api-gateway.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
})