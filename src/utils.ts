import type { LoaderOptions, MarkdownItOptions } from './types'
import MarkdownIt from 'markdown-it'

// Helper function to stringify data safely
export function stringify(src: any): string {
  return JSON.stringify(src)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function getNormalizedMarkdownCompiler(options: LoaderOptions, isReactEnabled: boolean): { render: (text: string) => string } {
  if (options.markdown && options.markdownIt) {
    throw new Error(
      'Both markdown and markdownIt options were specified. This is not supported. \n'
      + 'Please refer to the documentation for usage: \n'
      + 'https://hmsk.github.io/frontmatter-markdown-loader/options.html#markdown-compilation',
    )
  }

  // If you've specified the markdown option, hand over control
  if (options.markdown) {
    return { render: options.markdown }
  }

  // If you've passed in a MarkdownIt instance, just use that
  if (options.markdownIt instanceof MarkdownIt || (options.markdownIt && options.markdownIt.constructor && options.markdownIt.constructor.name === 'MarkdownIt')) {
    return options.markdownIt
  }

  // Configuration object? Pass it to our default compiler
  if (typeof options.markdownIt === 'object') {
    return new MarkdownIt(options.markdownIt)
  }

  // If no configuration is passed - use a sensible default
  const mdOptions: MarkdownItOptions = isReactEnabled
    ? { html: true, xhtmlOut: true }
    : { html: true }

  return new MarkdownIt(mdOptions)
}
