import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O GitHub Pages publica em https://in100tiva.github.io/mvp-vale/ (subpasta),
// enquanto a Vercel publica na raiz. O workflow de Pages define VITE_BASE_PATH;
// localmente e na Vercel o padrão continua sendo a raiz.
const base = process.env.VITE_BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
