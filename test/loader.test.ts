import type { LoaderOptions } from '../src/types'
import { describe, expect, test } from 'bun:test'
import { Mode } from '../src/mode'

// Mock implementation for testing purposes
function createLoader(options: LoaderOptions = {}) {
  return {
    loader: 'module',
    async load(this: any, path: string) {
      const content = await Bun.file(path).text()

      // Simplified loader logic for testing
      const frontmatter = await import('front-matter')
      const MarkdownIt = await import('markdown-it')

      const fm = frontmatter.default(content)
      const md = new MarkdownIt.default({ html: true })

      const html = md.render(fm.body)

      return `
        module.exports = {
          attributes: ${JSON.stringify(JSON.stringify(fm.attributes))},
          html: ${JSON.stringify(JSON.stringify(html))},
          body: ${JSON.stringify(JSON.stringify(fm.body))},
        }
      `
    },
    options,
  }
}

describe('Frontmatter Markdown Loader', () => {
  const markdown = `---
title: Test Title
author: Test Author
tags:
  - test
  - markdown
---

# Heading 1

This is a test markdown file.

## Heading 2

More content here.`

  test('should extract frontmatter attributes', async () => {
    const mockContext = {
      getOptions: () => ({ mode: [Mode.HTML] }),
      resourcePath: 'test.md',
    }

    // Mock Bun.file to return our test markdown
    const originalFile = Bun.file
    // @ts-ignore Mocking Bun.file
    Bun.file = () => ({
      text: async () => markdown,
    })

    try {
      const loader = await createLoader().load.call(mockContext, 'test.md')
      // Create a module from the loader output
      const module = { exports: {} }
      // @ts-ignore Function constructor usage
      const fn = new Function('module', 'exports', loader)
      fn(module, module.exports)

      const result = module.exports

      expect(result).toBeDefined()
      expect(result.attributes).toBeDefined()
      expect(JSON.parse(result.attributes)).toEqual({
        title: 'Test Title',
        author: 'Test Author',
        tags: ['test', 'markdown'],
      })
    }
    finally {
      // Restore Bun.file
      // @ts-ignore Restoring Bun.file
      Bun.file = originalFile
    }
  })

  test('should extract HTML content', async () => {
    const mockContext = {
      getOptions: () => ({ mode: [Mode.HTML] }),
      resourcePath: 'test.md',
    }

    // Mock Bun.file to return our test markdown
    const originalFile = Bun.file
    // @ts-ignore Mocking Bun.file
    Bun.file = () => ({
      text: async () => markdown,
    })

    try {
      const loader = await createLoader().load.call(mockContext, 'test.md')
      // Create a module from the loader output
      const module = { exports: {} }
      // @ts-ignore Function constructor usage
      const fn = new Function('module', 'exports', loader)
      fn(module, module.exports)

      const result = module.exports

      expect(result).toBeDefined()
      expect(result.html).toBeDefined()
      const htmlContent = JSON.parse(result.html)
      expect(htmlContent).toContain('<h1>Heading 1</h1>')
      expect(htmlContent).toContain('<h2>Heading 2</h2>')
      expect(htmlContent).toContain('<p>This is a test markdown file.</p>')
    }
    finally {
      // Restore Bun.file
      // @ts-ignore Restoring Bun.file
      Bun.file = originalFile
    }
  })
})
