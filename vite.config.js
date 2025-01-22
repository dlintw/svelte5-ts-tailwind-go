import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// https://vite.dev/config/
export default defineConfig({
  base: "svelte5-ts-tailwind-go",
  plugins: [svelte()],
});
