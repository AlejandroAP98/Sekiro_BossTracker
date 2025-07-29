import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
     VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'sounds/efect.mp3'
      ],
      manifest: {
        name: 'Sekiro Boss Tracker',
        short_name: 'Sekiro Tracker',
        description: 'Lleva el control de jefes y minijefes de Sekiro: Shadows Die Twice.',
        start_url: '/',
        display: 'standalone', 
        orientation: 'portrait',
        background_color: '#000000',
        theme_color: '#111827',
        lang: 'es-CO',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache'
            }
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'asset-cache'
            }
          },
          {
            urlPattern: /\/sounds\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'custom-cache'
            }
          }
        ]
      }
    })   
  ],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    },
  }
});