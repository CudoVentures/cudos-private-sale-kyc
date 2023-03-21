import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

const envFilePath = resolve(__dirname, '../config/.env');
const envFileContent = readFileSync(envFilePath, 'utf-8');
const parsedEnvVars = dotenv.parse(envFileContent);

Object.entries(parsedEnvVars).forEach(([key, value]) => {
  if (key && value && key.startsWith('VITE_APP_')) {
    process.env[key] = value;
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [alias(), react(), tsconfigPaths(), eslint(), svgr()],
  server: {
    port: parseInt(process.env.VITE_APP_PORT || "3000"),
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  }
})
