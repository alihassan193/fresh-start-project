import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Critical CSS plugin using critters
const criticalCssPlugin = (): Plugin => {
  return {
    name: "vite-plugin-critical-css",
    enforce: "post",
    apply: "build",
    async transformIndexHtml(html, ctx) {
      // Only run in build mode when bundle is available
      if (!ctx.bundle) return html;
      
      try {
        // Dynamically import critters to avoid issues during dev
        // @ts-ignore - critters types are not properly exported
        const Critters = (await import("critters")).default;
        
        const critters = new Critters({
          // Inline critical CSS
          preload: "swap", // Use swap for async loading
          inlineFonts: false,
          pruneSource: false, // Keep original CSS for fallback
          reduceInlineStyles: true,
          mergeStylesheets: true,
          compress: true,
          logLevel: "silent",
        });
        
        return await critters.process(html);
      } catch (error) {
        console.warn("Critical CSS extraction failed:", error);
        return html;
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    criticalCssPlugin(),
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
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
          ],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: "esnext",
    minify: "esbuild",
  },
}));
