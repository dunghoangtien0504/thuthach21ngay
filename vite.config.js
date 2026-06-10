import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';

// Helper to recursively find all HTML files
function getHtmlFiles(dir, fileList = {}) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && !file.startsWith('.')) {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      // Create a relative path for Rollup entry key
      const relativePath = filePath.replace(__dirname, '').replace(/^[\\/]/, '');
      const key = relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
      fileList[key] = resolve(__dirname, relativePath);
    }
  });
  
  return fileList;
}

const htmlFiles = getHtmlFiles(__dirname);

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
});
