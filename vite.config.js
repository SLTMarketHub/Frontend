import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PostCSS (postcss.config.js) already configures Tailwind CSS.
// No separate Vite plugin for Tailwind is necessary here.
export default defineConfig({
  plugins: [react()],
})
