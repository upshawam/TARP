import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages, change base to your repo name, for example:
// base: "/personal-tarp-app/"
export default defineConfig({
  base: "/",
  plugins: [react()]
});
