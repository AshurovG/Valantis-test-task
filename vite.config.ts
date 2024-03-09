import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  base: "Valantis-test-task",
  plugins: [react()],
  resolve: {
    alias: {
      components: "/src/components",
      styles: "/src/styles",
      pages: "/src/pages",
      slices: "/src/slices",
      assets: "/src/assets",
    },
  },
})
