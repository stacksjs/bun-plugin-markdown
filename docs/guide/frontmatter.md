# Frontmatter

Learn about frontmatter parsing and configuration in bun-plugin-markdown.

## What is Frontmatter?

Frontmatter is YAML metadata at the beginning of a markdown file, delimited by `---`:

```markdown
---
title: My Article
author: John Doe
date: 2024-01-15
published: true
tags:
  - javascript
  - bun
---

# Article Content

Your markdown content here...
```

## Accessing Frontmatter

The frontmatter is parsed and available as the `attributes` property:

```typescript
import article from './article.md'

console.log(article.attributes)
// {
//   title: 'My Article',
//   author: 'John Doe',
//   date: '2024-01-15',
//   published: true,
//   tags: ['javascript', 'bun']
// }
```

## Supported Data Types

### Strings

```yaml
---
title: "My Title"
description: Plain string without quotes works too
---
```

### Numbers

```yaml
---
views: 1234
rating: 4.5
---
```

### Booleans

```yaml
---
published: true
draft: false
---
```

### Dates

```yaml
---
date: 2024-01-15
datetime: 2024-01-15T10:30:00Z
---
```

### Arrays

```yaml
---
tags:
  - javascript
  - bun
  - markdown
---
```

Or inline:

```yaml
---
tags: [javascript, bun, markdown]
---
```

### Objects

```yaml
---
author:
  name: John Doe
  email: john@example.com
  social:
    twitter: "@johndoe"
---
```

### Null

```yaml
---
description: null
summary: ~
---
```

## TypeScript Types

### Typing Frontmatter

```typescript
interface ArticleFrontmatter {
  title: string
  author: string
  date: string
  published: boolean
  tags: string[]
}

import article from './article.md'

const attrs = article.attributes as ArticleFrontmatter
console.log(attrs.title) // Type-safe access
```

### Creating a Type Module

```typescript
// markdown.d.ts
declare module '*.md' {
  interface MarkdownModule {
    attributes: Record<string, any>
    html: string
    body?: string
    meta?: {
      resourcePath: string
    }
    react?: () => JSX.Element
    vue?: {
      component: any
      render?: Function
      staticRenderFns?: Function[]
    }
  }

  const content: MarkdownModule
  export default content
}
```

## Custom Markdown Options

### Markdown-it Configuration

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML],
  markdownIt: {
    html: true,        // Enable HTML in markdown
    linkify: true,     // Auto-convert URLs to links
    typographer: true, // Smart quotes and dashes
    breaks: false      // Convert \n to <br>
  }
}))
```

### Markdown-it Plugins

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'
import highlightPlugin from 'markdown-it-highlightjs'
import anchorPlugin from 'markdown-it-anchor'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML],
  markdownItPlugins: [
    highlightPlugin,
    [anchorPlugin, { level: [2, 3] }]
  ]
}))
```

## Advanced Frontmatter

### Multi-line Strings

```yaml
---
description: |
  This is a multi-line description
  that preserves line breaks.

summary: >
  This is a folded string that
  will become a single line.
---
```

### Anchors and Aliases

```yaml
---
defaults: &defaults
  layout: post
  author: John

post:
  <<: *defaults
  title: My Post
---
```

## Examples

### Blog Post

```markdown
---
title: Getting Started with Bun
slug: getting-started-bun
author:
  name: Jane Smith
  avatar: /images/jane.jpg
date: 2024-01-15
category: tutorials
tags:
  - bun
  - javascript
  - beginners
excerpt: Learn how to set up and use Bun for your next project.
featured: true
---

# Getting Started with Bun

Welcome to this tutorial...
```

```typescript
import post from './posts/getting-started-bun.md'

const { title, author, tags, featured } = post.attributes

// Use in your application
const postCard = {
  title,
  authorName: author.name,
  authorAvatar: author.avatar,
  tags,
  isFeatured: featured,
  content: post.html
}
```

### Documentation Page

```markdown
---
title: API Reference
order: 3
section: Reference
toc: true
editUrl: https://github.com/repo/edit/main/docs/api.md
---

# API Reference

This page documents the API...
```

### Product Page

```markdown
---
name: Premium Widget
price: 99.99
currency: USD
sku: WIDGET-001
inStock: true
images:
  - /products/widget-1.jpg
  - /products/widget-2.jpg
specifications:
  weight: 500g
  dimensions: 10x10x5cm
  material: Aluminum
---

# Premium Widget

The best widget you can buy...
```

## Frontmatter Validation

### Runtime Validation

```typescript
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string(),
  date: z.string(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([])
})

import post from './post.md'

const validated = PostSchema.parse(post.attributes)
```

### Build-time Validation

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.META],
  validate: (attributes, filePath) => {
    if (!attributes.title) {
      throw new Error(`Missing title in ${filePath}`)
    }
    return true
  }
}))
```

## Best Practices

1. **Consistent Schema**: Use the same frontmatter structure across similar content
2. **Type Safety**: Create TypeScript types for your frontmatter
3. **Validation**: Validate frontmatter at build time
4. **Defaults**: Provide sensible defaults for optional fields
5. **Documentation**: Document your frontmatter schema

## Next Steps

- See the [API reference](/api/reference)
- Go back to [Getting Started](./getting-started.md)
