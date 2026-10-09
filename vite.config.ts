import { defineConfig, type Plugin } from 'vite';
import { tailwindConfig } from './src/config/tailwind.config';
function tailwindConfigPlugin(): Plugin {
  return {
    name: 'opentunes:tailwind-config',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          injectTo: 'head',
          children: `tailwind.config = ${JSON.stringify(tailwindConfig)}`
        }
      ];
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [tailwindConfigPlugin()],
  server: {
    open: true
  }
});