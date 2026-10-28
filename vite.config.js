import dns from 'node:dns';
import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Windows often resolves `localhost` to IPv6 (::1) first. Vite binds IPv4 when
// `host: true`, so the browser tab can spin until that lookup times out.
dns.setDefaultResultOrder('ipv4first');

// ----------------------------------------------------------------------

const PORT = 3030;

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
    watch: {
      // Laravel logs and sessions live under backend/. Watching them reloads the
      // page on every API call, so the first visit looks like it never finishes.
      ignored: ['**/node_modules/**', '**/.git/**', '**/backend/**', '**/dist/**'],
    },
    warmup: {
      clientFiles: ['./src/main.jsx', './src/pages/home.jsx'],
    },
  },
  preview: { port: PORT, host: true },
});
