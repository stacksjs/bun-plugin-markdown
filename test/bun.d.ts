declare module '*.md' {
  const content: {
    attributes: Record<string, any>
    body: string
    html: string
    meta?: {
      resourcePath: string
    }
  }
  export default content
}
