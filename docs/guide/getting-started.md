# Getting Started

Learn how to use bun-plugin-markdown to import markdown files in your Bun projects.

## Installation

```bash
bun add bun-plugin-markdown
```

## Basic Usage

### Register the Plugin

```typescript
import { markdownPlugin } from 'bun-plugin-markdown'

// Register the plugin globally
Bun.plugin(markdownPlugin)

// Now you can import markdown files
import myContent from './content/page.md'

console.log(myContent.html)       // Rendered HTML
console.log(myContent.attributes) // Frontmatter attributes
```

### Markdown File Example

```markdown
---
title: My Page Title
author: John Doe
date: 2024-01-15
tags:
  - bun
  - markdown
---

# Hello World

This is my markdown content.
```

### Imported Content

```typescript
import content from './example.md'

console.log(content.attributes)
// {
//   title: 'My Page Title',
//   author: 'John Doe',
//   date: '2024-01-15',
//   tags: ['bun', 'markdown']
// }

console.log(content.html)
// '<h1>Hello World</h1>\n<p>This is my markdown content.</p>'
```

## Custom Configuration

### Using the Factory Function

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.BODY, Mode.META]
}))
```

### With Bun.build

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [
    frontmatterMarkdownPlugin({
      mode: [Mode.HTML, Mode.BODY]
    })
  ]
})
```

## Output Modes

The plugin supports multiple output modes:

| Mode | Description |
|------|-------------|
| `Mode.HTML` | Rendered HTML content |
| `Mode.BODY` | Raw markdown body (without frontmatter) |
| `Mode.META` | Metadata about the source file |
| `Mode.REACT` | React component from markdown |
| `Mode.VUE_COMPONENT` | Vue component |
| `Mode.VUE_RENDER_FUNCTIONS` | Vue render functions |

### Using Multiple Modes

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.BODY, Mode.META]
}))

// In your code:
import content from './page.md'

console.log(content.html)  // Rendered HTML
console.log(content.body)  // Raw markdown
console.log(content.meta)  // { resourcePath: '/path/to/page.md' }
```

## React Support

### Installation

```bash
bun add @babel/core @babel/preset-react -D
```

### Configuration

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.REACT],
  react: {
    root: 'markdown-content'
  }
}))
```

### Usage

```tsx
import myContent from './content/page.md'

function MyComponent() {
  return (
    <div>
      <h1>{myContent.attributes.title}</h1>
      {myContent.react()}
    </div>
  )
}
```

## Vue Support

### Installation

```bash
bun add vue-template-compiler @vue/component-compiler-utils -D
```

### Configuration

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.VUE_COMPONENT],
  vue: {
    root: 'markdown-content'
  }
}))
```

### Usage

```vue
<script>
import myContent from './content/page.md'

export default {
  components: {
    MarkdownContent: myContent.vue.component
  },
  data() {
    return {
      title: myContent.attributes.title
    }
  }
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <markdown-content />
  </div>
</template>
```

## Fullstack Server

### bunfig.toml Configuration

```toml
[serve.static]
plugins = [ "bun-plugin-markdown/plugin" ]
```

### HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>Markdown Viewer</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import content from './content.md'

    document.getElementById('app').innerHTML = content.html
    console.log(content.attributes)
  </script>
</body>
</html>
```

### Server Setup

```typescript
import { serve } from 'bun'

const template = `
<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>
  <script type="module">
    import content from './content.md'
    document.getElementById('app').innerHTML = content.html
  </script>
</body>
</html>
`

serve({
  port: 3000,
  development: true,
  routes: {
    '/': new Response(template, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
})
```

## Next Steps

- Learn about [frontmatter options](./frontmatter.md)
- See the [API reference](/api/reference)
