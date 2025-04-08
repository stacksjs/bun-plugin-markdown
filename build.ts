import { build } from 'bun'
import dtsPlugin from 'bun-plugin-dtsx'

await build({
  entrypoints: [
    './src/index.ts',
    './src/loader.ts',
  ],
  outdir: './dist',
  minify: true,
  splitting: true,
  format: 'esm',
  target: 'bun',
  plugins: [
    dtsPlugin(),
  ],
})

console.log('✅ Build completed')
