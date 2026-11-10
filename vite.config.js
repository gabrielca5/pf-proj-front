import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Em dev, /api/... vai para o back local. Em producao quem faz isso e o vercel.json.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.236.181.241:8080',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
