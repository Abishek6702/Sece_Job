import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 server: {
    port: 5183,
    host: '0.0.0.0', // Allow external connections
    strictPort: false,
    hmr: {
      clientPort: 5183
    },
    allowedHosts: [
      '.trycloudflare.com', // Allow all Cloudflare tunnel domains
      'localhost',
      '127.0.0.1'
    ]
  }
})