<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# bun-frontmatter-markdown-loader

A Bun loader for markdown files with YAML frontmatter.

This loader is designed to work with Bun's build system, making it easy to import markdown files with frontmatter in your projects.

## Features

- Parse markdown files with YAML frontmatter
- Output HTML, frontmatter attributes, and body content
- Support for Vue components/render functions
- Support for React components
- Configurable markdown compilation options
- TypeScript support

## Installation

```bash
bun add bun-frontmatter-markdown-loader
```

## Usage

```ts
// In your bun configuration
import { bunFrontmatterMarkdownLoader } from 'bun-frontmatter-markdown-loader'

const build = {
  // ...
  loaders: {
    '.md': bunFrontmatterMarkdownLoader({
      mode: ['html', 'body', 'meta'],
    }),
  },
}
```

Then in your code:

```ts
import article from './article.md'

console.log(article.attributes) // Frontmatter data
console.log(article.html) // Rendered HTML
console.log(article.body) // Raw markdown content
```

## Options

### `mode`

Type: `string[]` or `string`
Default: `['html']`

Specifies what to extract from the markdown file.

- `html`: Renders markdown to HTML
- `body`: Returns the raw markdown body
- `meta`: Include metadata about the resource
- `vue-component`: Generate a Vue component
- `vue-render-functions`: Include render functions for Vue
- `react-component`: Generate a React component

### `markdown`

Type: `Function`
Default: `undefined`

Custom function to compile the markdown into HTML.

### `markdownIt`

Type: `Object` or `MarkdownIt instance`
Default: `{ html: true }`

Configuration options for the MarkdownIt instance, or a custom MarkdownIt instance.

### `vue`

Type: `Object`
Default: `undefined`

Vue-specific options.

- `root`: Class name to add to the root element (default: `frontmatter-markdown`)
- `transformAssetUrls`: Transform URLs in the template (default: `true`)

### `react`

Type: `Object`
Default: `undefined`

React-specific options.

- `root`: Class name to add to the root element (default: `frontmatter-markdown`)

## Optional Dependencies

For Vue support, you'll need:

```bash
bun add vue-template-compiler @vue/component-compiler-utils
```

For React support, you'll need:

```bash
bun add @babel/core @babel/preset-react react
```

## Example

`article.md`:

```md
---
title: Hello World
date: 2023-01-01
---

# Hello World

This is a sample markdown file with frontmatter.
```

`app.ts`:

```ts
import article from './article.md'

console.log(article.attributes.title) // "Hello World"
console.log(article.attributes.date) // "2023-01-01"
console.log(article.html) // "<h1>Hello World</h1><p>This is a sample markdown file with frontmatter.</p>"
```

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

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/bun-ts-starter?style=flat-square
[npm-version-href]: https://npmjs.com/package/bun-ts-starter
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-starter/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-starter/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-starter/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-starter -->
