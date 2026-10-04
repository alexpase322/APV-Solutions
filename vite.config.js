import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // On Vercel, a missing API URL would ship a site that silently calls localhost (login, cards, admin all broken)
  if (process.env.VERCEL && mode === 'production' && !env.VITE_API_URL) {
    throw new Error(
      'VITE_API_URL is not set. Add it in Vercel → Project Settings → Environment Variables (e.g. https://apv-nfc-api.onrender.com) and redeploy.'
    )
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
