import { defineConfig, type Plugin } from 'vite';
import type { OutputAsset } from 'rollup';
import { tailwindConfig } from './src/config/tailwind.config';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function toDataUri(fileName: string, source: string | Uint8Array): string | null {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const mime = MIME_TYPES[ext];
  if (!mime) return null;

  const bytes = typeof source === 'string' ? new TextEncoder().encode(source) : source;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return `data:${mime};base64,${btoa(binary)}`;
}

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

function singleFilePlugin(): Plugin {
  return {
    name: 'opentunes:single-file',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const assets = Object.values(bundle).filter(
        (part): part is OutputAsset => part.type === 'asset' && !part.fileName.endsWith('.html')
      );

      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.html')) continue;

        let html = String(file.source);

        for (const part of Object.values(bundle)) {
          if (part === file) continue;

          if (part.type === 'chunk') {
            const scriptTag = new RegExp(
              `<script[^>]*\\ssrc="[^"]*${escapeRegExp(part.fileName)}"[^>]*>\\s*</script>`
            );
            html = html.replace(scriptTag, `<script type="module">\n${part.code}\n</script>`);
          } else if (part.fileName.endsWith('.css')) {
            const linkTag = new RegExp(
              `<link[^>]*\\shref="[^"]*${escapeRegExp(part.fileName)}"[^>]*>`
            );
            html = html.replace(linkTag, `<style>\n${String(part.source)}\n</style>`);
          }
        }

        for (const asset of assets) {
          if (asset.fileName.endsWith('.css')) continue;
          const dataUri = toDataUri(asset.fileName, asset.source);
          if (dataUri) html = html.split(`./${asset.fileName}`).join(dataUri);
        }

        file.source = html;
      }

      for (const fileName of Object.keys(bundle)) {
        if (!fileName.endsWith('.html')) delete bundle[fileName];
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const singleFile = mode === 'single';

  return {
    base: './',
    plugins: [tailwindConfigPlugin(), ...(singleFile ? [singleFilePlugin()] : [])],
    build: singleFile
      ? {
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          cssCodeSplit: false,
          modulePreload: false,
          reportCompressedSize: false
        }
      : {},
    server: {
      open: true
    }
  };
});