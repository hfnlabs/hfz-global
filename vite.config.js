import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      name: "hfzGlobal",
      entry: "./src/index.ts",
      formats: ["iife"],
      fileName: () => "index.js",
    },
    minify: false,
  },
});
