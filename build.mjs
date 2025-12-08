import * as esbuild from 'esbuild';

const builds = [
  // CJS builds
  {
    entryPoints: ['src/web.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: 'dist/web/index.cjs.js',
    external: ['@napi-rs/canvas'],
  },
  {
    entryPoints: ['src/node.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: 'dist/node/index.cjs.js',
    external: ['@napi-rs/canvas'],
  },
  // ESM builds
  {
    entryPoints: ['src/web.ts'],
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    outfile: 'dist/web/index.js',
    external: ['@napi-rs/canvas', 'zod'],
  },
  {
    entryPoints: ['src/node.ts'],
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    outfile: 'dist/node/index.js',
    external: ['@napi-rs/canvas'],
  },
];

async function runBuilds() {
  for (const config of builds) {
    console.log(`Building ${config.entryPoints[0]} to ${config.outdir}...`);
    await esbuild.build(config);
  }
  console.log('All builds completed.');
}

runBuilds().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});