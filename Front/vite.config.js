import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Hook para copiar el archivo _redirects a dist/ después del build
  configResolved() {
    copyFileSync('public/_redirects', 'dist/_redirects');
  },
})
