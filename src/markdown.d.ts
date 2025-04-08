/**
 * TypeScript declarations for markdown files
 * This allows TypeScript to understand imports of .md files when using the frontmatter markdown loader
 *
 * @example
 * ```ts
 * // This import will be properly typed
 * import content from './content.md'
 *
 * // TypeScript will know about these properties
 * content.attributes.title
 * content.html
 * content.body
 * ```
 */
declare module '*.md' {
  interface MarkdownFrontmatterResult {
    attributes: Record<string, any>
    body: string
    html?: string
    vue?: {
      render?: (h: any) => any
      staticRenderFns?: Array<(h: any) => any>
      component?: any
    }
    react?: () => JSX.Element
    meta?: {
      resourcePath: string
      [key: string]: any
    }
  }

  const content: MarkdownFrontmatterResult
  export default content
}
