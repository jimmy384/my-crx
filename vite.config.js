import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import eslintPlugin from 'vite-plugin-eslint';
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), crx({ manifest })/*, eslintPlugin()*/],
  server: {
    staticPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173
    }
  }
})
