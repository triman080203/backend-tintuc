import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from 'fs'
import child_process from 'child_process'
import { env } from 'process'

// Setup HTTPS certificates for development
const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "dxc_frontend";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit' });
}

// Determine backend target from environment or use default
const backendTarget = env.ASPNETCORE_HTTPS_PORT 
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS 
    ? env.ASPNETCORE_URLS.split(';')[0]
    : 'https://localhost:7030';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy API requests to backend
      '^/api': {
        target: backendTarget,
        secure: false,
        changeOrigin: true,
      },
      // Proxy uploads folder
      '^/uploads': {
        target: backendTarget,
        secure: false,
        changeOrigin: true,
      },
    },
    port: parseInt(env.DEV_SERVER_PORT || '62904'),
    strictPort: true,
    ...(fs.existsSync(keyFilePath) && fs.existsSync(certFilePath) ? {
      https: {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
      }
    } : {}),
  },
  build: {
    minify: "terser",
    terserOptions: {
      output: {
        comments: false,
      },
      mangle: true,
      compress: {
        drop_console: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
})
