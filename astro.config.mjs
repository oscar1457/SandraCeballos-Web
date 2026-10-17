import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://sandraceballos.com",
  build: {
    format: "directory"
  },
  image: {
    responsiveStyles: true
  }
});
