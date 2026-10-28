import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Tự động kiểm tra: nếu có file public/CNAME (custom domain) hoặc root domain -> base là '/'
  const hasCname = fs.existsSync(path.resolve(__dirname, 'public/CNAME'));
  const basePath = process.env.VITE_BASE_PATH || (hasCname ? '/' : '/');
  const port = process.env.VITE_DEV_PORT ? parseInt(process.env.VITE_DEV_PORT) : 3000;

  return {
    base: basePath,
    server: {
      port: port,
      strictPort: true, // Báo lỗi nếu port đã bị chiếm
      open: false,
      host: true, // Cho phép truy cập từ network
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
    },
  };
});
