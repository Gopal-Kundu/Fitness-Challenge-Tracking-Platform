import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
let url = "https://fitness-challenge-tracking-platform-beta.vercel.app"
// let url = 'http://localhost:5000'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: url,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
