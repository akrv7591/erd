import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    })
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "routes": `${path.resolve(__dirname, "./src/routes/")}`,
      "services": `${path.resolve(__dirname, "./src/services/")}`,
      "components": `${path.resolve(__dirname, "./src/components/")}`,
    }
  }

})
