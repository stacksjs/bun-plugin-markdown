# API Reference

Complete API reference for bun-plugin-markdown.

## Exports

### markdownPlugin

Pre-configured plugin with default settings (HTML mode).

```typescript
import { markdownPlugin } from 'bun-plugin-markdown'

Bun.plugin(markdownPlugin)
```

### frontmatterMarkdownPlugin

Factory function to create a configured plugin.

```typescript
import { frontmatterMarkdownPlugin } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin(options?: LoaderOptions))
```

### bunFrontmatterMarkdownLoader

The raw loader function for advanced usage.

```typescript
import { bunFrontmatterMarkdownLoader } from 'bun-plugin-markdown'
```

### Mode

Enum of available output modes.

```typescript
import { Mode } from 'bun-plugin-markdown'

enum Mode {
  HTML = 'html',
  BODY = 'body',
  META = 'meta',
  REACT = 'react',
  VUE_COMPONENT = 'vue-component',
  VUE_RENDER_FUNCTIONS = 'vue-render-functions'
}
```

## Types

### LoaderOptions

Configuration options for the plugin.

```typescript
interface LoaderOptions {
  /**
   * Output modes to enable
   * @default [Mode.HTML]
   */
  mode?: Mode[]

  /**
   * React-specific options
   */
  react?: ReactOptions

  /**
   * Vue-specific options
   */
  vue?: VueOptions

  /**
   * Markdown-it configuration
   */
  markdownIt?: MarkdownItOptions

  /**
   * Markdown-it plugins
   */
  markdownItPlugins?: MarkdownItPlugin[]
}
```

### ReactOptions

React component configuration.

```typescript
interface ReactOptions {
  /**
   * Root CSS class for the wrapper div
   * @default 'frontmatter-markdown'
   */
  root?: string
}
```

### VueOptions

Vue component configuration.

```typescript
interface VueOptions {
  /**
   * Root CSS class for the wrapper div
   * @default 'frontmatter-markdown'
   */
  root?: string

  /**
   * Transform asset URLs in templates
   * @default true
   */
  transformAssetUrls?: boolean | object
}
```

### MarkdownModule

The structure of an imported markdown module.

```typescript
interface MarkdownModule {
  /**
   * Parsed frontmatter attributes
   */
  attributes: Record<string, any>

  /**
   * Rendered HTML (Mode.HTML)
   */
  html?: string

  /**
   * Raw markdown body (Mode.BODY)
   */
  body?: string

  /**
   * File metadata (Mode.META)
   */
  meta?: {
    resourcePath: string
  }

  /**
   * React component function (Mode.REACT)
   */
  react?: (props?: Record<string, any>) => JSX.Element

  /**
   * Vue component/render functions (Mode.VUE_*)
   */
  vue?: {
    component?: any
    render?: Function
    staticRenderFns?: Function[]
  }
}
```

## Output Modes

### Mode.HTML

Renders markdown to HTML.

```typescript
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML]
}))

import content from './page.md'
console.log(content.html) // '<h1>Title</h1><p>Content</p>'
```

### Mode.BODY

Includes raw markdown body.

```typescript
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.BODY]
}))

import content from './page.md'
console.log(content.body) // '# Title\n\nContent'
```

### Mode.META

Includes file metadata.

```typescript
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.META]
}))

import content from './page.md'
console.log(content.meta.resourcePath) // '/path/to/page.md'
```

### Mode.REACT

Generates a React component.

**Requirements**: `@babel/core`, `@babel/preset-react`

```typescript
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.REACT],
  react: { root: 'md-content' }
}))

import content from './page.md'

function Page() {
  return <div>{content.react()}</div>
}
```

### Mode.VUE_COMPONENT

Generates a Vue component.

**Requirements**: `vue-template-compiler`, `@vue/component-compiler-utils`

```typescript
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.VUE_COMPONENT],
  vue: { root: 'md-content' }
}))

import content from './page.md'

export default {
  components: {
    Content: content.vue.component
  }
}
```

### Mode.VUE_RENDER_FUNCTIONS

Generates Vue render functions.

```typescript
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.VUE_RENDER_FUNCTIONS]
}))

import content from './page.md'

export default {
  render: content.vue.render,
  staticRenderFns: content.vue.staticRenderFns
}
```

## Usage Examples

### Basic HTML Rendering

```typescript
import { markdownPlugin } from 'bun-plugin-markdown'

Bun.plugin(markdownPlugin)

import page from './content/page.md'

const html = `
<!DOCTYPE html>
<html>
<body>
  <h1>${page.attributes.title}</h1>
  <div>${page.html}</div>
</body>
</html>
`
```

### React Application

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.REACT],
  react: { root: 'prose' }
}))
```

```tsx
import post from './posts/hello-world.md'

export function BlogPost() {
  const { title, date, author } = post.attributes

  return (
    <article>
      <header>
        <h1>{title}</h1>
        <p>By {author} on {date}</p>
      </header>
      <div className="content">
        {post.react()}
      </div>
    </article>
  )
}
```

### Vue Application

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.VUE_COMPONENT],
  vue: { root: 'prose' }
}))
```

```vue
<script>
import post from './posts/hello-world.md'

export default {
  components: {
    PostContent: post.vue.component
  },
  computed: {
    title() { return post.attributes.title },
    date() { return post.attributes.date }
  }
}
</script>

<template>
  <article>
    <h1>{{ title }}</h1>
    <time>{{ date }}</time>
    <post-content />
  </article>
</template>
```

### Build Configuration

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [
    frontmatterMarkdownPlugin({
      mode: [Mode.HTML, Mode.BODY, Mode.META]
    })
  ]
})
```

### Fullstack Server

```toml
# bunfig.toml
[serve.static]
plugins = [ "bun-plugin-markdown/plugin" ]
```

```typescript
import { serve } from 'bun'

serve({
  port: 3000,
  development: true,
  routes: {
    '/': async () => {
      const content = await import('./index.md')
      return new Response(content.html, {
        headers: { 'Content-Type': 'text/html' }
      })
    }
  }
})
```

## TypeScript Declaration

Add to your project for type support:

```typescript
// markdown.d.ts
declare module '*.md' {
  const content: {
    attributes: Record<string, any>
    html?: string
    body?: string
    meta?: { resourcePath: string }
    react?: (props?: any) => JSX.Element
    vue?: {
      component?: any
      render?: Function
      staticRenderFns?: Function[]
    }
  }
  export default content
}
```

## Peer Dependencies

| Feature | Required Packages |
|---------|------------------|
| React | `@babel/core`, `@babel/preset-react` |
| Vue | `vue-template-compiler`, `@vue/component-compiler-utils` |

## Error Handling

```typescript
try {
  import content from './broken.md'
} catch (error) {
  if (error.message.includes('vue-template-compiler')) {
    console.error('Vue dependencies not installed')
  }
  if (error.message.includes('@babel/core')) {
    console.error('React dependencies not installed')
  }
}
```
