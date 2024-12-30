import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteImagemin from 'vite-plugin-imagemin'
import viteCompression from 'vite-plugin-compression'
import { GenerateSW } from 'workbox-webpack-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Image optimization
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      svgo: { plugins: [{ removeViewBox: false }] },
    }),
    // Enable compression (e.g., Brotli)
    viteCompression({
      algorithm: 'brotli',
      ext: '.br',
    }),
    // Service Worker (Workbox for caching)
    {
      name: 'workbox',
      apply: 'build',
      configResolved(config) {
        // Workbox configurations
        if (config.command === 'build') {
          config.plugins.push(
            new GenerateSW({
              clientsClaim: true,
              skipWaiting: true,
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/ec2-13-40-86-150.eu-west-2.compute.amazonaws.com/,
                  handler: 'NetworkFirst',
                  options: {
                    cacheName: 'api-cache',
                    expiration: {
                      maxEntries: 10,
                      maxAgeSeconds: 60 * 60 * 24,
                    },
                  },
                },
              ],
            })
          );
        }
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
