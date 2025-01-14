import PostgresDatasource from '../datasource/postgres/PostgresDatasource'
import StrapiDatasource from '../datasource/strapi/StrapiDatasource'

import { ARTICLE_ROUTE_PREFIX, ARTICLE_CONTENT_TYPE_PLURAL } from '../api/Article'
import { Article } from '../types/article'

//////////////
// Run
const run = async () => {
  console.log('[BACKEND][SCRIPT][LOG][addRedirectionMock][START]')

  const postgresDataSource = new PostgresDatasource()
  await postgresDataSource.authenticate()
  await postgresDataSource.models.UrlsRedirections.sync({ alter: true })
  const strapiDataSource = new StrapiDatasource()

  try {
    if (process.argv.includes('--clear')) {
      await postgresDataSource.models.UrlsRedirections.truncate()
      console.log('[BACKEND][SCRIPT][LOG][addRedirectionMock][Info] Redirections cleared')
    }

    const articles = await strapiDataSource.getCollectionContents<Article>(ARTICLE_CONTENT_TYPE_PLURAL)

    for (const article of articles) {
      await postgresDataSource.models.UrlsRedirections.create({
        source: `/${ARTICLE_ROUTE_PREFIX}/${article.slug}-old`,
        redirection: `/${ARTICLE_ROUTE_PREFIX}/${article.slug}`,
        code: 301,
        strapi_content_id: article.documentId,
        updatedAt: new Date()
      })
      console.log(`[BACKEND][SCRIPT][LOG][addRedirectionMock][Info] Old redirection created for ${article.documentId} / ${article.slug}`)
    }
  } catch (e) {
    console.log('[BACKEND][SCRIPT][LOG][addRedirectionMock][ERROR]')
    console.log(e)
  }

  console.log('[BACKEND][SCRIPT][LOG][addRedirectionMock][END]')
}

run()
