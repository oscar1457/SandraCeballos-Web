import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://sandra-ceballos.vercel.app",
  build: {
    format: "directory"
  },
  image: {
    responsiveStyles: true
  }
});
