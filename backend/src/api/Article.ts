import { Express } from 'express'
import StrapiDataSource from '../datasource/strapi/StrapiDataSource'

//////////////
// Types
export interface Article {
  id: number
  title: string
  slug: string
  body: string
}

//////////////
// Consts
export const ARTICLE_CONTENT_TYPE = 'article'
export const ARTICLE_CONTENT_TYPE_NAME = 'articles'

//////////////
// Routes
export const ArticleRoutes = (app: Express, dataSources: { strapiDataSource: StrapiDataSource }): void => {
  app.get('/articleBySlug/:slug', async (req, res): Promise<void> => {
    try {
      const article = await getArticleBySlug(dataSources, req.params.slug)
      console.log(`[BACKEND][LOG][Article][articleBySlug][SUCESS] ${req.params.slug}`)

      res.send(article)
    } catch (e) {
      console.log(`[BACKEND][LOG][Article][articleBySlug][ERROR] ${req.params.slug}`)
      console.log(e)
      res.status(404).send('Not found')
    }
  })

  app.get('/articles', async (req, res): Promise<void> => {
    try {
      const articles = await getAllArticles(dataSources)
      console.log('[BACKEND][LOG][Article][articles][SUCESS]')

      res.send(articles)
    } catch (e) {
      console.log('[BACKEND][LOG][Article][articles][ERROR]')
      console.log(e)
      res.status(404).send('Not found')
    }
  })
}

//////////////
// Funcs
/**
 * Get all articles
 *
 * @param dataSources
 */
const getAllArticles = async (dataSources: { strapiDataSource: StrapiDataSource })=> {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getCollectionContents<Article>(ARTICLE_CONTENT_TYPE_NAME)
}

/**
 * Get article by its slug
 *
 * @param dataSources
 * @param slug
 */
const getArticleBySlug = async (dataSources: { strapiDataSource: StrapiDataSource }, slug: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentBySlug<Article>(ARTICLE_CONTENT_TYPE_NAME, slug)
}
