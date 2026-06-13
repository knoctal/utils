console.log('📦 Bundling JS into dist/index.js...');
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'browser',
  minify: true,
});

console.log('📝 Rolling up all types into dist/index.d.ts...');
const dtsProcess = Bun.spawn(
  ['bunx', 'dts-bundle-generator', '-o', './dist/index.d.ts', './src/index.ts', '--no-check'],
  {
    stdout: 'inherit',
    stderr: 'inherit',
  },
);

await dtsProcess.exited;
console.log('🚀 Build complete!');

export {};
