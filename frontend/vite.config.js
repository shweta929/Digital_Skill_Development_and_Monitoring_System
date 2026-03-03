import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/students/login': 'http://localhost:5000',
      '/api/students/register': 'http://localhost:5000',
      '/api/students/education': 'http://localhost:5000',
      '/api/students/submit': 'http://localhost:5000',
      '/api/students/result': 'http://localhost:5000',
      '/api/test': 'http://localhost:5000',
      '/api/admin': 'http://localhost:5000',
      '/api/crm': 'http://localhost:5000',
      '/api/ai': 'http://localhost:8080',
      '/api': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
    },
  },
})
