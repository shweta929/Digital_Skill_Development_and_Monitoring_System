import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/students/login': 'http://localhost:5100',
      '/api/students/register': 'http://localhost:5100',
      '/api/students/education': 'http://localhost:5100',
      '/api/students/submit': 'http://localhost:5100',
      '/api/students/result': 'http://localhost:5100',
      '/api/test': 'http://localhost:5100',
      '/api/admin': 'http://localhost:5100',
      '/api/crm': 'http://localhost:5100',
      '/api/ai': 'http://localhost:8080',
      '/api': 'http://localhost:5100',
      '/auth': 'http://localhost:5100',
    },
  },
})
