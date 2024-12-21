import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/steam-market-profit-calculator/',
  build: {
    outDir: 'dist',
  }
})