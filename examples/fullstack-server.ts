import { serve } from 'bun'
import { frontmatterMarkdownPlugin, Mode } from '../src/index'

// Create an HTML template that imports a markdown file
function createHtmlTemplate(markdownPath: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Markdown Viewer</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      overflow: auto;
    }
    .frontmatter {
      background: #f0f7ff;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
    }
    .content {
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    // Import markdown file
    import content from '${markdownPath}';

    // Create app content
    const app = document.getElementById('app');

    // Create frontmatter section
    const frontmatter = document.createElement('div');
    frontmatter.className = 'frontmatter';
    frontmatter.innerHTML = '<h2>Frontmatter</h2>';

    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(content.attributes, null, 2);
    frontmatter.appendChild(pre);

    // Create content section
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.innerHTML = content.html;

    // Add sections to the app
    app.appendChild(frontmatter);
    app.appendChild(contentDiv);
  </script>
</body>
</html>
`
}

// Create example markdown file
const markdownContent = `---
title: Markdown Example for Bun Fullstack Server
date: ${new Date().toISOString().split('T')[0]}
author: Bun User
tags:
  - markdown
  - bun
  - fullstack
---

# ${`Markdown Example for Bun Fullstack Server`}

This is a demonstration of using the **bun-plugin-markdown** with Bun's fullstack server.

## Features

- Renders markdown content in the browser
- Displays frontmatter data
- Uses Bun's built-in bundling capability
- Works with Bun.serve() routes

### Code Example

\`\`\`typescript
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
\`\`\`
`

// Make sure the markdown file exists
async function setupServer() {
  const contentPath = './examples/content.md'
  await Bun.write(contentPath, markdownContent)

  // Create the HTML template
  const indexHtml = createHtmlTemplate('./content.md')

  // Register the plugin at runtime
  Bun.plugin(frontmatterMarkdownPlugin({
    mode: [Mode.HTML, Mode.BODY, Mode.META],
  }))

  // Start the server
  const server = serve({
    port: 3000,
    development: true,

    // Enable the static serving and bundling features
    routes: {
      '/': new Response(indexHtml, {
        headers: { 'Content-Type': 'text/html' },
      }),
    },

    // Handle other routes
    fetch(req) {
      const url = new URL(req.url)

      if (url.pathname === '/api/markdown-info') {
        return Response.json({
          message: 'This is data from the server API',
          timestamp: new Date().toISOString(),
        })
      }

      return new Response('Not found', { status: 404 })
    },
  })

  console.error(`Server running at ${server.url}`)
  console.error('Visit the URL in your browser to see the processed markdown')
}

// Run the setup without top-level await
setupServer().catch((err) => {
  console.error('Error setting up server:', err)
})
