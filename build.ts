import { build } from 'bun'
import dtsPlugin from 'bun-plugin-dtsx'

// The rule guards published entrypoints, where a top-level await breaks a
// consumer's binary build. This is a build script, and `files` ships only
// README.md and dist, so it never reaches a consumer.
// eslint-disable-next-line ts/no-top-level-await
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
