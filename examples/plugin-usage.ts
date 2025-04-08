// Example demonstrating how to use the bun-plugin-markdown plugin

import { frontmatterMarkdownPlugin, Mode } from '../src/index'

// Register the plugin globally
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.BODY, Mode.META],
}))

// This assumes you have a content.md file
async function runExample() {
  try {
    console.log('Importing markdown file...')

    // Now you can import markdown files directly
    // This works because we've registered the plugin above
    const markdownModule = await import('./content.md')
    const content = markdownModule.default

    console.log('\n--- Markdown Content ---')
    console.log('Title:', content.attributes.title)
    console.log('Author:', content.attributes.author)
    console.log('\nHTML Preview:')
    console.log(`${content.html.substring(0, 150)}...`)

    console.log('\n--- Raw Markdown ---')
    console.log(`${content.body.substring(0, 150)}...`)

    console.log('\n--- Metadata ---')
    console.log(content.meta)
  }
  catch (error) {
    console.error('Error importing markdown:', error)
  }
}

// Create a simple content.md file if it doesn't exist
async function ensureContentFileExists() {
  const contentPath = './examples/content.md'

  try {
    await Bun.file(contentPath).text()
    console.log('Content file exists, using existing file.')
  }
  catch (error) {
    console.log('Creating example content.md file...')

    const exampleContent = `---
title: Example Markdown Document
author: Bun User
date: ${new Date().toISOString().split('T')[0]}
tags:
  - markdown
  - bun
  - plugin
---

# Example Markdown Document

This is an example markdown document with frontmatter to demonstrate the bun-plugin-markdown plugin.

## Features

- Extracts frontmatter metadata
- Converts markdown to HTML
- Makes data available in your JavaScript/TypeScript code

You can use **bold text**, *italic text*, or \`inline code\`.

\`\`\`typescript
// Example code block
import { markdownPlugin } from 'bun-plugin-markdown'

// Register the plugin
Bun.plugin(markdownPlugin)
\`\`\`
`

    await Bun.write(contentPath, exampleContent)
    console.log('Created example content.md file.')
  }
}

// Run the example
await ensureContentFileExists()
await runExample()
