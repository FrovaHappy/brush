import * as esbuild from 'esbuild';
import { stat } from 'fs/promises';

const builds = [
  // ESM builds
  {
    entryPoints: ['src/web.ts'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    minify: true,
    outfile: 'dist/web/index.js',
    external: ['@napi-rs/canvas'],
  },
  {
    entryPoints: ['src/node.ts'],
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    outfile: 'dist/node/index.js',
    external: ['@napi-rs/canvas', 'zod'],
  },
];

async function runBuilds() {
  let totalSize = 0;
  for (const config of builds) {
    console.log(`Building ${config.entryPoints[0]} to ${config.outfile}...`);
    await esbuild.build(config);
    const stats = await stat(config.outfile);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`Built ${config.outfile}, size: ${sizeKB} KB`);
    totalSize += stats.size;
  }
  const totalSizeKB = (totalSize / 1024).toFixed(2);
  console.log(`Total compiled size: ${totalSizeKB} KB`);
  console.log('All builds completed.');
}

runBuilds().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});