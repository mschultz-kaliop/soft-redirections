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
// Funcs
const getAllArticles = async (dataSources: { strapiDataSource: StrapiDataSource })=> {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getCollectionContents<Article>(ARTICLE_CONTENT_TYPE_NAME)
}

const getArticleBySlug = async (dataSources: { strapiDataSource: StrapiDataSource }, slug: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentBySlug<Article>(ARTICLE_CONTENT_TYPE_NAME, slug)
}

//////////////
// Routes
export const ArticleRoutes = (app, dataSources) => {
  app.get('/articleBySlug/:slug', async (req, res) => {
    try {
      const article = await getArticleBySlug(dataSources, req.params.slug)
      console.log(`[LOG][Article][articleBySlug][SUCESS] ${req.params.slug}`)

      res.send(article)
    } catch (e) {
      console.log(`[LOG][Article][articleBySlug][ERROR]  ${req.params.slug}`)
      console.log(e)
      res.status(404).send('Not found')
    }
  })

  app.get('/articles', async (req, res) => {
    try {
      const articles = await getAllArticles(dataSources)
      console.log('[LOG][Article][articles][SUCESS]')

      res.send(articles)
    } catch (e) {
      console.log('[LOG][Article][articles][ERROR]')
      console.log(e)
      res.status(404).send('Not found')
    }
  })
}
