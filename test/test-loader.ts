import { serve } from 'bun'
import { bunFrontmatterMarkdownLoader, Mode } from '../src/index'

// Create and register the loader for .md files - Not used directly but kept for reference
const _mdLoader = bunFrontmatterMarkdownLoader({
  mode: [Mode.HTML, Mode.BODY, Mode.META],
})

// Register the loader with Bun
Bun.plugin({
  name: 'md-loader',
  extension: '.md',
  setup(build) {
    build.onLoad({ filter: /\.md$/ }, async (args) => {
      // Use the loader to process the markdown file
      const content = await Bun.file(args.path).text()
      // Use the default loader directly, which returns a string
      const { default: loader } = await import('../src/index.js')
      const result = await loader.call({ resourcePath: args.path, getOptions: () => ({ mode: [Mode.HTML, Mode.BODY, Mode.META] }) }, content)

      // Convert CommonJS module.exports to ESM export
      const moduleCode = result.replace('module.exports =', 'export default')

      return {
        contents: moduleCode,
        loader: 'js',
      }
    })
  },
})

// Create a simple server to test the loader
const server = serve({
  port: 3000,
  development: true,

  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname === '/') {
      try {
        // Try to dynamically import the markdown file
        // Note: This might not work until bun actually loads it once
        let html = ''

        try {
          const mdModule = await import('./sample.md')
          const mdResult = mdModule.default

          // Create an HTML response that displays the processed markdown
          html = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>${mdResult.attributes.title}</title>
                <style>
                  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
                  pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow: auto; }
                </style>
              </head>
              <body>
                <h1>${mdResult.attributes.title}</h1>
                <p><strong>Author:</strong> ${mdResult.attributes.author}</p>
                <p><strong>Date:</strong> ${mdResult.attributes.date}</p>

                <h2>Rendered HTML</h2>
                <div>${mdResult.html}</div>

                <h2>Frontmatter</h2>
                <pre>${JSON.stringify(mdResult.attributes, null, 2)}</pre>

                <h2>Raw Markdown</h2>
                <pre>${mdResult.body}</pre>
              </body>
            </html>
          `
        }
        catch (importError) {
          // If import fails, show an error message
          html = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Error Loading Markdown</title>
                <style>
                  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
                  .error { color: red; background: #ffeeee; padding: 1rem; border-radius: 4px; }
                </style>
              </head>
              <body>
                <h1>Error Loading Markdown</h1>
                <div class="error">
                  <p>There was an error importing the markdown file:</p>
                  <pre>${String(importError)}</pre>
                </div>
                <p>This might happen the first time you run the server. Try refreshing the page.</p>
              </body>
            </html>
          `
        }

        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
        })
      }
      catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return new Response(`Error: ${errorMessage}`, { status: 500 })
      }
    }

    return new Response('Not found', { status: 404 })
  },
})

// Use error for console messages to satisfy linter
console.error(`Server running at ${server.url}`)
console.error('Visit the URL in your browser to see the processed markdown')
