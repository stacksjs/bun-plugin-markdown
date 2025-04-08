import type { LoaderOptions } from './types'

interface BunLoader {
  loader: string
  load: (this: any, path: string) => Promise<string>
  options: LoaderOptions
}

/**
 * Creates a Bun Frontmatter Markdown Loader with the given options
 * @param options Configuration options for the loader
 * @returns A Bun loader function
 */
export function bunFrontmatterMarkdownLoader(options: LoaderOptions = {}): BunLoader {
  return {
    loader: 'module',
    async load(this: any, path: string): Promise<string> {
      const content = await Bun.file(path).text()
      const { default: loader } = await import('./index.js')
      return loader.call(this, content)
    },
    options,
  }
}
