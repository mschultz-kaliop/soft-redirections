import { Model } from 'sequelize'

export interface Redirection extends Model {
  id: number
  source: string | null
  redirection: string
  code: number
  strapi_content_id: string | null
  updatedAt: Date | null
}