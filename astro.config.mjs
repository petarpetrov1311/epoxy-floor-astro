// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // Static pages do not need streaming. Render complete strings to avoid
  // corrupting Bulgarian text at React 18 stream chunk boundaries.
  integrations: [
    react({ experimentalDisableStreaming: true }),
    {
      name: 'separate-vite-caches',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          // Astro's build also starts Vite. Sharing its optimizer cache with a
          // running dev server invalidates lazy island imports (HTTP 504).
          updateConfig({ vite: { cacheDir: `node_modules/.vite/astro-${command}` } });
        },
      },
    },
  ],

  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
