import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: { enabled: true },
      includeAssets: ['favicon.ico'],
      manifest: {
        "name": "English-Ukrainian Dictionary",
        "short_name": "EngDic",
        "icons": [
          {
            "src": "/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": "/",
        "display": "standalone",
        "background_color": "#006600",
        "theme_color": "#006600",
        "description": "My web dictionary, combining several good choises into a perfect one"
      },
      workbox: {
        runtimeCaching: [
            { // audio-cache
              urlPattern: ({ request }) => request.destination === 'audio',
              handler: 'CacheFirst',
              options: {
                cacheName: 'audio-cache',
                expiration: {
                  maxEntries: 200,
                }
              }
            },
            { // articles
              urlPattern: ({ url }) => url.pathname.includes('/article'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'articles',
                expiration: {
                  maxEntries: 200
                }
              }
            },
            { // scripts
              urlPattern: ({ request }) => request.destination === 'script',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'scripts'
              }
            },
            { // recordUrls
              urlPattern: ({ url }) => url.pathname.endsWith('/recordUrls.json'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'record-urls'
              }
            }
        ]
      }
    })
  ],
})
