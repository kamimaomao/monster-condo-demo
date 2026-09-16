import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

let html = readFileSync('dist/index.html', 'utf8');
html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, path) => {
  const script = readFileSync(resolve('dist', path), 'utf8').replaceAll('</script', '<\\/script');
  return `<script type="module">${script}</script>`;
});
html = html.replace(/<link[^>]*href="([^"]+\.css)"[^>]*>/g, (_, path) => `<style>${readFileSync(resolve('dist', path), 'utf8')}</style>`);
mkdirSync('delivery', { recursive: true });
writeFileSync('delivery/怪兽公寓-demo.html', html);
mkdirSync('docs', { recursive: true });
writeFileSync('docs/index.html', html);
writeFileSync('docs/.nojekyll', '');
console.log(`Standalone: delivery/怪兽公寓-demo.html (${Buffer.byteLength(html)} bytes)`);
