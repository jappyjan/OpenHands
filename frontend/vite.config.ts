/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />
import { defineConfig, loadEnv } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { reactRouter } from "@react-router/dev/vite";
import { configDefaults } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const {
    VITE_BACKEND_HOST = "127.0.0.1:3000",
    VITE_USE_TLS = "false",
    VITE_FRONTEND_PORT = "3001",
    VITE_INSECURE_SKIP_VERIFY = "false",
  } = loadEnv(mode, process.cwd());

  const USE_TLS = VITE_USE_TLS === "true";
  const INSECURE_SKIP_VERIFY = VITE_INSECURE_SKIP_VERIFY === "true";
  const PROTOCOL = USE_TLS ? "https" : "http";
  const WS_PROTOCOL = USE_TLS ? "wss" : "ws";

  const API_URL = `${PROTOCOL}://${VITE_BACKEND_HOST}/`;
  const WS_URL = `${WS_PROTOCOL}://${VITE_BACKEND_HOST}/`;
  const FE_PORT = Number.parseInt(VITE_FRONTEND_PORT, 10);

  return {
    plugins: [
      !process.env.VITEST && reactRouter(),
      viteTsconfigPaths(),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'OpenHands - AI Software Engineer',
          short_name: 'OpenHands',
          description: 'OpenHands: Code Less, Make More. An AI-powered software engineer that can help you build, debug, and deploy applications.',
          theme_color: '#0c0e10',
          background_color: '#0c0e10',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png',
            },
            {
              src: 'favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png',
            },
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    server: {
      port: FE_PORT,
      host: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
          secure: !INSECURE_SKIP_VERIFY,
        },
        "/ws": {
          target: WS_URL,
          ws: true,
          changeOrigin: true,
          secure: !INSECURE_SKIP_VERIFY,
        },
        "/socket.io": {
          target: WS_URL,
          ws: true,
          changeOrigin: true,
          secure: !INSECURE_SKIP_VERIFY,
          // rewriteWsOrigin: true,
        },
      },
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
    },
    ssr: {
      noExternal: ["react-syntax-highlighter"],
    },
    clearScreen: false,
    test: {
      environment: "jsdom",
      setupFiles: ["vitest.setup.ts"],
      exclude: [...configDefaults.exclude, "tests"],
      coverage: {
        reporter: ["text", "json", "html", "lcov", "text-summary"],
        reportsDirectory: "coverage",
        include: ["src/**/*.{ts,tsx}"],
      },
    },
  };
});
