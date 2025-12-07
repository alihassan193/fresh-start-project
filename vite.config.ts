import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router": ["react-router-dom"],
          "ui-core": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-slot",
          ],
          "ui-menu": [
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-navigation-menu",
          ],
          "ui-form": [
            "@radix-ui/react-select",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
          ],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "query": ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    reportCompressedSize: false,
  },
}));
