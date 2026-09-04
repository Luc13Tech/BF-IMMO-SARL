import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'BF IMMO SARL',
        short_name: 'BF IMMO',
        description: 'Achat, location, gérance, vente, conseils, construction BTP et suivi de chantier à Dakar.',
        theme_color: '#1E2027',
        background_color: '#F7F7F5',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Indispensable pour une SPA : toute navigation vers une page qui
        // n'est pas en cache (ex: /admin/login, /biens/:id) doit retomber
        // sur index.html pour que React Router prenne le relais, au lieu
        // que le Service Worker ne renvoie une erreur.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
