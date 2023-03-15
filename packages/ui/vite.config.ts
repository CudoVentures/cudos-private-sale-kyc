import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [alias(), react(), tsconfigPaths(), eslint(), svgr()],
  define: {
    'process.env': {}
  },
  server: {
    port: parseInt(process.env.PORT),
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  }
})
