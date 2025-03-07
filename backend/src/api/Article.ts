import { Express } from 'express'

import StrapiDatasource from '../datasource/strapi/StrapiDatasource'
import { Article } from '../types/article'

//////////////
// Consts
export const ARTICLE_ROUTE_PREFIX = 'article'
export const ARTICLE_CONTENT_TYPE = 'article'
export const ARTICLE_CONTENT_TYPE_PLURAL = 'articles'

//////////////
// Routes
export const ArticleRoutes = (app: Express, dataSources: { strapiDataSource: StrapiDatasource }): void => {
  app.get('/article/:id', async (req, res): Promise<void> => {
    try {
      const article = await getArticleById(dataSources, req.params.id)
      console.log(`[BACKEND][LOG][Article][articleById][SUCCESS] ${req.params.id}`)

      res.send(article)
    } catch (e) {
      console.log(`[BACKEND][LOG][Article][articleById][ERROR] ${req.params.id}`)
      console.log(e)
      res.status(404).send('Not found')
    }
  })

  app.get('/articleBySlug/:slug', async (req, res): Promise<void> => {
    try {
      const article = await getArticleBySlug(dataSources, req.params.slug)
      console.log(`[BACKEND][LOG][Article][articleBySlug][SUCCESS] ${req.params.slug}`)

      res.send(article)
    } catch (e) {
      console.log(`[BACKEND][LOG][Article][articleBySlug][ERROR] ${req.params.slug}`)
      console.log(e)
      res.status(404).send('Not found')
    }
  })

  app.get('/articles', async (_req, res): Promise<void> => {
    try {
      const articles = await getAllArticles(dataSources)
      console.log('[BACKEND][LOG][Article][articles][SUCCESS]')

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
const getAllArticles = async (dataSources: { strapiDataSource: StrapiDatasource })=> {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getCollectionContents<Article>(ARTICLE_CONTENT_TYPE_PLURAL)
}

/**
 * Get article by its ID
 *
 * @param dataSources
 * @param id
 */
const getArticleById = async (dataSources: { strapiDataSource: StrapiDatasource }, id: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentById<Article>(ARTICLE_CONTENT_TYPE_PLURAL, id)
}

/**
 * Get article by its slug
 *
 * @param dataSources
 * @param slug
 */
const getArticleBySlug = async (dataSources: { strapiDataSource: StrapiDatasource }, slug: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentBySlug<Article>(ARTICLE_CONTENT_TYPE_PLURAL, slug)
}
