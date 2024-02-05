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
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // '@xyflow/react': ['@xyflow/react'],
          // "@mantine/core": ['@mantine/core'],
          // "axios": ["axios"],
          // "react-ui-scrollspy": ["react-ui-scrollspy"],
          // "react-sortablejs": ["react-sortablejs"]
        }
      },
    },
  }

})
