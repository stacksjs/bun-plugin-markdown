export interface BinaryConfig {
  from: string
  verbose: boolean
}

export interface MarkdownItOptions {
  html?: boolean
  xhtmlOut?: boolean
  [key: string]: any
}

export interface VueOptions {
  root?: string
  transformAssetUrls?: boolean | object
}

export interface ReactOptions {
  root?: string
}

export interface LoaderOptions {
  mode?: string[] | string
  markdown?: (body: string) => string
  markdownIt?: any
  vue?: VueOptions
  react?: ReactOptions
}

export interface FrontMatterResult {
  attributes: Record<string, any>
  body: string
  html?: string
  bodyBegin: number
  frontmatter: string
}
