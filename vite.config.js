import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Tự động kiểm tra: nếu có file public/CNAME (dùng custom domain) -> base là '/'
  const hasCname = fs.existsSync(path.resolve(__dirname, 'public/CNAME'));
  const basePath = process.env.VITE_BASE_PATH || (hasCname ? '/' : (mode === 'production' ? '/tool_ai_writer/' : '/'));

  return {
    base: basePath,
    server: {
      port: 3000,
      open: false,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
    },
  };
});
