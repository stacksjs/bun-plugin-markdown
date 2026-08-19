import type { BunPressConfig } from '@stacksjs/bunpress'

export default {
  title: 'bun-plugin-markdown',
  description: 'A Bun loader and plugin for handling Markdown files with frontmatter',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/reference' },
      { text: 'GitHub', link: 'https://github.com/stacksjs/bun-plugin-markdown' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Frontmatter', link: '/guide/frontmatter' },
            { text: 'Code Highlighting', link: '/features/code-highlighting' },
            { text: 'Custom Components', link: '/features/components' },
            { text: 'Hot Reload', link: '/features/hot-reload' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom Parsers', link: '/advanced/parsers' },
            { text: 'Plugin Extensions', link: '/advanced/extensions' },
            { text: 'Build Optimization', link: '/advanced/optimization' },
            { text: 'Integration Patterns', link: '/advanced/integration' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'API Reference', link: '/api/reference' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stacksjs/bun-plugin-markdown' },
      { icon: 'discord', link: 'https://discord.gg/stacksjs' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2024-present Stacks.js'
    }
  }
} satisfies BunPressConfig
