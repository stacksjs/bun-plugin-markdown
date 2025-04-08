import type { FrontMatterResult, LoaderOptions } from './types'
import frontmatter from 'front-matter'
import { Mode } from './mode'
import { getNormalizedMarkdownCompiler, stringify } from './utils'

export * from './config'
export { bunFrontmatterMarkdownLoader } from './loader'
export { Mode } from './mode'
export * from './types'

// Export the loader function for Bun
export default async function (this: any, source: string): Promise<string> {
  const options: LoaderOptions = this.getOptions ? this.getOptions() : {}
  const requestedMode = Array.isArray(options.mode) ? options.mode : [Mode.HTML]
  const enabled = (mode: string): boolean => requestedMode.includes(mode)

  let exported = ''
  let prependOutput = ''

  const addPrepend = (code: string): void => {
    prependOutput = prependOutput.concat(`${code}\n`)
  }

  const addProperty = (key: string, value: string): void => {
    exported += `
      ${key}: ${value},
    `
  }

  const fm = frontmatter(source) as FrontMatterResult
  const markdownCompiler = getNormalizedMarkdownCompiler(options, enabled(Mode.REACT))
  fm.html = markdownCompiler.render(fm.body)

  addProperty('attributes', stringify(fm.attributes))

  if (enabled(Mode.HTML))
    addProperty('html', stringify(fm.html))

  if (enabled(Mode.BODY))
    addProperty('body', stringify(fm.body))

  if (enabled(Mode.META)) {
    const meta = {
      resourcePath: this.resourcePath,
    }
    addProperty('meta', stringify(meta))
  }

  if ((enabled(Mode.VUE_COMPONENT) || enabled(Mode.VUE_RENDER_FUNCTIONS))) {
    let vueCompiler: any, compileVueTemplate: any
    try {
      // Using require instead of import for compatibility
      // @ts-expect-error No types available
      vueCompiler = require('vue-template-compiler')
      // @ts-expect-error No types available
      compileVueTemplate = require('@vue/component-compiler-utils').compileTemplate
    }
    catch (err: any) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error(
          'Failed to import vue-template-compiler or/and @vue/component-compiler-utils: \n'
          + 'If you intend to use \'vue-component\', `vue-render-functions` mode, install both to your project: \n'
          + 'https://hmsk.github.io/frontmatter-markdown-loader/vue.html',
        )
      }
      else {
        throw err
      }
    }

    const vueRootClass = options.vue && options.vue.root ? options.vue.root : 'frontmatter-markdown'
    const template = (fm.html || '')
      .replace(/<(code\s[^>]+)>/g, '<$1 v-pre>')
      .replace(/<code>/g, '<code v-pre>')

    const transformAssetUrls = (options.vue
      && (options.vue.transformAssetUrls === false || options.vue.transformAssetUrls))
      ? options.vue.transformAssetUrls
      : true

    const compileOptions = {
      source: `<div class="${vueRootClass}">${template}</div>`,
      filename: this.resourcePath,
      compiler: vueCompiler,
      compilerOptions: {
        outputSourceRange: true,
      },
      transformAssetUrls,
      isProduction: Bun.env.NODE_ENV === 'production',
    }

    const compiled = compileVueTemplate(compileOptions)
    addPrepend(`function extractVueFunctions () {\n${compiled.code}\nreturn { render: render, staticRenderFns: staticRenderFns }\n}\nconst vueFunctions = extractVueFunctions()`)

    let vueOutput = ''

    if (enabled(Mode.VUE_RENDER_FUNCTIONS)) {
      vueOutput += `
        render: vueFunctions.render,
        staticRenderFns: vueFunctions.staticRenderFns,
      `
    }

    if (enabled(Mode.VUE_COMPONENT)) {
      vueOutput += `
        component: {
          data: function () {
            return {
              templateRender: null
            }
          },
          render: function (createElement) {
            return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
          },
          created: function () {
            this.templateRender = vueFunctions.render;
            this.$options.staticRenderFns = vueFunctions.staticRenderFns;
          }
        }
      `
    }

    addProperty('vue', `{${vueOutput}}`)
  }

  if (enabled(Mode.REACT)) {
    let babelCore: any
    const reactRootClass = options.react && options.react.root ? options.react.root : 'frontmatter-markdown'

    try {
      // Using require instead of import for compatibility
      // @ts-expect-error No types available
      babelCore = require('@babel/core')
      // @ts-expect-error No types available
      require('@babel/preset-react')
    }
    catch {
      throw new Error(
        'Failed to import @babel/core or/and @babel/preset-react: \n'
        + 'If you intend to use \'react\' mode, install both to your project: \n'
        + 'https://hmsk.github.io/frontmatter-markdown-loader/react.html',
      )
    }

    addPrepend(`import React from 'react'`)

    const escape = (str: string): string => str.replace(/([\\`])/g, '\\$1')

    const template = (fm.html || '')
      .replace(/<code(\s[^>]+)>(.+?)<\/code>/gs, (match, p1, p2) =>
        `<code${p1} dangerouslySetInnerHTML={{ __html: \`${escape(p2)}\`}} />`)
      .replace(/<code>(.+?)<\/code>/gs, (match, p1) =>
        `<code dangerouslySetInnerHTML={{ __html: \`${escape(p1)}\`}} />`)
      .replace(/<(code|pre)([^\s>]*)\sclass=([^>]+)>/g, '<$1$2 className=$3>')

    const compiled = babelCore
      .transformSync(`
        const markdown =
          <div className="${reactRootClass}">
            ${template}
          </div>
        `, {
        presets: ['@babel/preset-react'],
      })

    const reactComponent = `
      function (props) {
        Object.keys(props).forEach(function (key) {
          this[key] = props[key]
        })
        ${compiled.code}
        return markdown
      }
    `
    addProperty('react', reactComponent)
  }

  return `${prependOutput}\nmodule.exports = { ${exported} }`
}
