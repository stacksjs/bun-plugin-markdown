import type { BunPlugin } from 'bun'
import type { LoaderOptions } from './types'
import { Mode } from './mode'

/**
 * Creates a Bun plugin for processing markdown files with frontmatter
 *
 * @param options Configuration options for the markdown frontmatter loader
 * @returns A Bun plugin that can be used with Bun.build() or Bun.plugin()
 *
 * @example
 * ```ts
 * // Register the plugin globally
 * import { frontmatterMarkdownPlugin } from 'bun-plugin-markdown'
 *
 * Bun.plugin(frontmatterMarkdownPlugin({
 *   mode: [Mode.HTML, Mode.BODY, Mode.META]
 * }))
 *
 * // Then in your code, you can import markdown files
 * import myMarkdown from './content/page.md'
 * console.log(myMarkdown.html) // Rendered HTML
 * console.log(myMarkdown.attributes) // Frontmatter attributes
 * ```
 *
 * @example
 * ```ts
 * // Use with Bun.build
 * import { frontmatterMarkdownPlugin } from 'bun-plugin-markdown'
 *
 * await Bun.build({
 *   entrypoints: ['./src/index.ts'],
 *   outdir: './dist',
 *   plugins: [
 *     frontmatterMarkdownPlugin({ mode: [Mode.HTML, Mode.BODY] })
 *   ]
 * })
 * ```
 */
export function frontmatterMarkdownPlugin(options: LoaderOptions = {}): BunPlugin {
  // Process mode options (not used in the plugin itself, but included for reference)
  const _requestedMode = Array.isArray(options.mode)
    ? options.mode
    : options.mode
      ? [options.mode]
      : [Mode.HTML]

  return {
    name: 'bun-plugin-markdown',
    setup(build) {
      // Handle .md files
      build.onLoad({ filter: /\.md$/ }, async (args) => {
        // Read the markdown content
        const content = await Bun.file(args.path).text()

        // Process the markdown content
        const { default: loader } = await import('./index.js')
        const result = await loader.call(
          {
            resourcePath: args.path,
            getOptions: () => options,
          },
          content,
        )

        // Convert CommonJS module exports to ESM exports
        const esModule = result.replace('module.exports =', 'export default')

        return {
          contents: esModule,
          loader: 'js',
        }
      })
    },
  }
}

/**
 * A shorthand function to create a Bun plugin that processes markdown files with frontmatter
 * with default options (HTML mode)
 */
export const markdownPlugin: BunPlugin = frontmatterMarkdownPlugin()

/**
 * A shorthand function to create a Bun plugin that processes markdown files with all available
 * frontmatter modes
 */
export const markdownPluginFull: BunPlugin = frontmatterMarkdownPlugin({
  mode: [
    Mode.HTML,
    Mode.BODY,
    Mode.META,
    Mode.REACT,
    Mode.VUE_COMPONENT,
    Mode.VUE_RENDER_FUNCTIONS,
  ],
})
