import StrapiDataSource from '../datasource/StrapiDataSource'

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
const CONTENT_TYPE_NAME = 'articles'

//////////////
// Funcs
const getAllArticles = async (dataSources: { strapiDataSource: StrapiDataSource })=> {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getCollectionContents<Article>(CONTENT_TYPE_NAME)
}

const getArticleBySlug = async (dataSources: { strapiDataSource: StrapiDataSource }, slug: string) => {
  const { strapiDataSource } = dataSources
  return strapiDataSource.getOneCollectionContentBySlug<Article>(CONTENT_TYPE_NAME, slug)
}

//////////////
// Routes
export const ArticleRoutes = (app, dataSources) => {
  app.get('/articleBySlug/:slug', async (req, res) => {
    const article = await getArticleBySlug(dataSources, req.params.slug)
    res.send(article)
  })

  app.get('/articles', async (req, res) => {
    const articles = await getAllArticles(dataSources)
    res.send(articles)
  })
}