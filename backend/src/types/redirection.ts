export interface Redirection {
  id: number
  source: string | null
  redirection: string
  code: string
  strapi_content_id: string | null
  updatedAt: Date | null
  // function for postgres instance
  // update: () => Promise<void>
  // save: () => Promise<void>
  // destroy: () => Promise<void>
}