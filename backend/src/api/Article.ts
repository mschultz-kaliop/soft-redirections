import { Express } from 'express'

import StrapiDataSource from '../datasource/strapi/StrapiDataSource'
import { Article } from '../types/article'

//////////////
// Consts
export const ARTICLE_ROUTE_PREFIX = 'article'
export const ARTICLE_CONTENT_TYPE = 'article'
export const ARTICLE_CONTENT_TYPE_PLURAL = 'articles'

//////////////
// Routes
export const ArticleRoutes = (app: Express, dataSources: { strapiDataSource: StrapiDataSource }): void => {
  app.get('/article/:id', async (req, res): Promise<void> => {
    try {
      const article = await getArticleById(dataSources, req.params.id)
      console.log(`[BACKEND][LOG][Article][articleById][SUCESS] ${req.params.id}`)

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
      console.log(`[BACKEND][LOG][Article][articleBySlug][SUCESS] ${req.params.slug}`)

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
  return strapiDataSource.getCollectionContents<Article>(ARTICLE_CONTENT_TYPE_PLURAL)
}

/**
 * Get article by its ID
 *
 * @param dataSources
 * @param id
 */
const getArticleById = async (dataSources: { strapiDataSource: StrapiDataSource }, id: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentById<Article>(ARTICLE_CONTENT_TYPE_PLURAL, id)
}

/**
 * Get article by its slug
 *
 * @param dataSources
 * @param slug
 */
const getArticleBySlug = async (dataSources: { strapiDataSource: StrapiDataSource }, slug: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentBySlug<Article>(ARTICLE_CONTENT_TYPE_PLURAL, slug)
}
