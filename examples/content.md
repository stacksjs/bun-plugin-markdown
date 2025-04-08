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
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'
import { serve } from 'bun'

// Register the plugin
Bun.plugin(frontmatterMarkdownPlugin())

// Import markdown content
import content from './content.md'

// Use in your server
serve({
  routes: {
    "/": createHtmlTemplate('./content.md')
  },
  development: true
})
```
