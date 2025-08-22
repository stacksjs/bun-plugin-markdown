---
title: Markdown Example for Bun Fullstack Server
date: 2025-04-08
author: Bun User
tags:
  - markdown
  - bun
  - fullstack
---

# Markdown Example for Bun Fullstack Server

This is a demonstration of using the **bun-plugin-markdown** with Bun's fullstack server.

## Features

- Renders markdown content in the browser
- Displays frontmatter data
- Uses Bun's built-in bundling capability
- Works with Bun.serve() routes

### Code Example

```typescript
import { serve } from 'bun'
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

// Import markdown content
import content from './content.md'

// Register the plugin
Bun.plugin(frontmatterMarkdownPlugin())

// Use in your server
serve({
  routes: {
    '/': createHtmlTemplate('./content.md')
  },
  development: true
})
```
