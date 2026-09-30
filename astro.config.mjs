// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";

// Vercel define VERCEL=1 automáticamente durante el build
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  site: "https://perlarosatimakeup.com",
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", es: "es" },
      },
      filter: (page) => !page.includes("/thank-you/"),
    }),
  ],
  adapter: isVercel ? vercel() : node({ mode: "standalone" }),
});
