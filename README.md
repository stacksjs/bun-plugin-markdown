<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# Bun Frontmatter Markdown Loader

A Bun loader and plugin for handling Markdown files with frontmatter.

## Features

- Parse frontmatter from markdown files
- Convert markdown to HTML
- Support for various output modes, including:
  - HTML rendering
  - Raw markdown body
  - Metadata
  - React component generation
  - Vue component and render functions

## Installation

```bash
bun add bun-plugin-markdown
```

## Usage

### As a Bun Plugin

The simplest way to use this package is as a Bun plugin:

```typescript
import { markdownPlugin } from 'bun-plugin-markdown'

// Now you can import markdown files directly
import myContent from './content/page.md'

// Register the plugin globally
Bun.plugin(markdownPlugin)

console.log(myContent.html) // Rendered HTML
console.log(myContent.attributes) // Frontmatter attributes
```

### Custom Plugin Configuration

You can customize the behavior of the plugin:

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

// Register the plugin with custom options
Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.BODY, Mode.META],
  // Add other options as needed
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

### With React Support

For React support, install the required peer dependencies:

```bash
bun add @babel/core @babel/preset-react -D
```

Then use the plugin with React mode:

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.REACT],
  react: {
    root: 'markdown-content'  // Optional custom root class
  }
}))

// In your component
import myContent from './content/page.md'

function MyComponent() {
  return (
    <div>
      <h1>{myContent.attributes.title}</h1>
      {/* Render the React component */}
      {myContent.react()}
    </div>
  )
}
```

### With Vue Support

For Vue support, install the required peer dependencies:

```bash
bun add vue-template-compiler @vue/component-compiler-utils -D
```

Then use the plugin with Vue mode:

```typescript
import { frontmatterMarkdownPlugin, Mode } from 'bun-plugin-markdown'

// In your component
import myContent from './content/page.md'

Bun.plugin(frontmatterMarkdownPlugin({
  mode: [Mode.HTML, Mode.VUE_COMPONENT],
  vue: {
    root: 'markdown-content' // Optional custom root class
  }
}))

export default {
  components: {
    MarkdownContent: myContent.vue.component
  },
  template: `
    <div>
      <h1>{{ title }}</h1>
      <markdown-content />
    </div>
  `,
  data() {
    return {
      title: myContent.attributes.title
    }
  }
}
```

### With Bun Fullstack Server

Bun's fullstack dev server can use the markdown plugin when configured in your `bunfig.toml`:

```toml
[serve.static]
plugins = [ "bun-plugin-markdown/plugin" ]
```

Then you can import markdown files directly in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Markdown Viewer</title>
  <style>
    /* Your styles here */
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    // Import markdown file directly
    import content from './content.md';

    // Use the processed content
    document.getElementById('app').innerHTML = content.html;
    console.log(content.attributes); // Access frontmatter
  </script>
</body>
</html>
```

And use it in your server:

```typescript
import { serve } from 'bun'

// Create your HTML template
const template = `/* HTML with markdown import */`

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

To see a complete example, run:

```bash
bun run fullstack
```

## Available Modes

The loader supports different output modes:

- `Mode.HTML`: Generates HTML from the markdown
- `Mode.BODY`: Includes the raw markdown body
- `Mode.META`: Includes metadata about the source file
- `Mode.REACT`: Generates a React component
- `Mode.VUE_COMPONENT`: Generates a Vue component
- `Mode.VUE_RENDER_FUNCTIONS`: Generates Vue render functions

## License

MIT

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/bun-ts-starter/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-starter/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/bun-ts-starter?style=flat-square
[npm-version-href]: https://npmjs.com/package/bun-ts-starter
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-starter/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-starter/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-starter/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-starter -->
