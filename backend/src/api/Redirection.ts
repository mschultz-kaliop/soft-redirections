import { Express } from 'express'

import PostgresDatasource from '../datasource/postgres/PostgresDatasource'
import StrapiDataSource, { ContentBySlug } from '../datasource/strapi/StrapiDataSource'
import { ARTICLE_ROUTE_PREFIX, ARTICLE_CONTENT_TYPE, ARTICLE_CONTENT_TYPE_PLURAL } from './Article'
import { Article } from '../types/article'
import { Redirection } from '../types/redirection'

//////////////
// Routes
export const RedirectionRoutes = (app: Express, dataSources: {
  postgresDataSource: PostgresDatasource,
  strapiDataSource: StrapiDataSource
}): void => {
  app.get('/redirectionsBySlug/:slug', async (req, res): Promise<void> => {
    try {
      const { postgresDataSource } = dataSources
      const redirections = await getRedirectionsBySlug(postgresDataSource, decodeURIComponent(req.params.slug))
      console.log('[BACKEND][LOG][Redirection][redirectionsBySlug][SUCESS]')

      res.send(redirections)
    } catch (e) {
      console.log(`[BACKEND][LOG][Redirection][redirectionsBySlug][ERROR] ${ req.params.slug }`)
      console.log(e)
      res.status(404).send('Not found')
    }
  })

  app.get('/redirections', async (req, res) => {
    try {
      const { postgresDataSource } = dataSources
      const redirections = await getAllRedirections(postgresDataSource)
      console.log('[BACKEND][LOG][Redirection][redirections][SUCESS]')

      res.send(redirections)
    } catch (e) {
      console.log('[BACKEND][LOG][Redirection][redirections][ERROR]')
      console.log(e)
      res.status(404).send('Not found')
    }
  })

  app.post('/handleRedirectionUrl', async (req, res): Promise<void> => {
    const { model } = req.body
    const { documentId } = req.body.entry
    const { postgresDataSource } = dataSources

    try {
      const contentFromStrapi = await dataSources.strapiDataSource.getOneCollectionContentById<Article>(ARTICLE_CONTENT_TYPE_PLURAL, documentId)

      const finalSlug = getFinalSlug(model, contentFromStrapi)
      const existingSlug = await getExistingSlug(postgresDataSource, documentId)

      const alreadyExistRedirection = await dataSources.postgresDataSource.findAll<Redirection>('UrlsRedirections', {
        where: {
          source: existingSlug,
          redirection: finalSlug
        }
      })

      // we continue redirection process only if same redirection rule doesn't already exist in database to avoid duplicates or if source is null (interpreted as a content creation)
      if (alreadyExistRedirection.length === 0) {
        if (finalSlug !== existingSlug) {
          await createAndUpdateRedirections(
            postgresDataSource,
            documentId,
            finalSlug,
            existingSlug
          )
        } else {
          console.log(
            `[BACKEND][LOG][Redirection][handleRedirectionUrl][INFO] Source ${existingSlug} and redirection ${finalSlug} are the same`
          )
        }
      } else {
        console.log(
          `[BACKEND][LOG][Redirection][handleRedirectionUrl][INFO] Source ${existingSlug} and redirection ${finalSlug} already exist`
        )
      }

      console.log(
        `[BACKEND][LOG][Redirection][handleRedirectionUrl][SUCCESS] Redirection rule success = ${documentId}`
      )

      res.send({
        success: `Successfully handled redirections rules for ${documentId}`
      })

    } catch (e) {
      console.log(
        `[BACKEND][LOG][Redirection][handleRedirectionUrl][ERROR] Redirection rule failed = ${documentId}`
      )
      console.log(e)
      console.log(req.body)

      res.send({
        error: `Error while create/update redirections rules for ${documentId}`
      })
    }
  })
}

//////////////
// Funcs
/**
 * Get all redirections corresponding to a source slug
 *
 * @param postgresDataSource
 * @param slug
 */
const getRedirectionsBySlug = async (postgresDataSource: PostgresDatasource, slug: string) => {
  console.log(slug)
  return postgresDataSource.findAll<Redirection>('UrlsRedirections', { where: { source: slug }})
}

/**
 * Get all redirections
 *
 * @param postgresDataSource
 */
const getAllRedirections = async (postgresDataSource: PostgresDatasource) => {
  return postgresDataSource.findAll<Redirection>('UrlsRedirections')
}

/**
 * Get final slug formatted function of content type
 *
 * @param type
 * @param contentFromStrapi
 * @returns
 */
const getFinalSlug = <T extends ContentBySlug>(type: string, contentFromStrapi: T) => {
  let finalSlug = contentFromStrapi.slug

  if (type === ARTICLE_CONTENT_TYPE) {
    finalSlug = `${ARTICLE_ROUTE_PREFIX}/${contentFromStrapi.slug}`
  }

  return `/${finalSlug}`
}

/**
 * Get existing slug for content in table urls_redirections
 *
 * @param postgresDataSource
 * @param documentId
 */
const getExistingSlug = async (postgresDataSource: PostgresDatasource, documentId: string) => {
  const exists = await postgresDataSource.findAll<Redirection>('UrlsRedirections', {
    where: {
      strapi_content_id: documentId
    },
    limit: 1
  })

  if (exists.length > 0) {
    return exists[0].redirection
  }

  return null
}

/**
 * Create and update redirections rules in database
 *
 * @param postgresDataSource
 * @param documentId
 * @param finalSlug
 * @param existingSlug
 */
const createAndUpdateRedirections = async (
  postgresDataSource: PostgresDatasource,
  documentId: string,
  finalSlug: string,
  existingSlug: string
): Promise<void> => {
  // create redirection rule from last to new slug
  await postgresDataSource.models.UrlsRedirections.create({
    source: existingSlug,
    redirection: finalSlug,
    code: '301',
    strapi_content_id: documentId,
    updatedAt: new Date()
  })

  // fetch existing redirections matching contentful content id
  const searchExistingRedirections =
    await postgresDataSource.findAll<Redirection>('UrlsRedirections',{
      where: {
        strapi_content_id: documentId
      }
    })

  if (searchExistingRedirections && searchExistingRedirections.length > 0) {
    // we update old redirections rules matching contentful content id
    for (const existingRedirection of searchExistingRedirections) {
      if (existingRedirection.source !== finalSlug) {
        try {
          await existingRedirection.update({
            redirection: finalSlug,
            updatedAt: new Date()
          })
          await existingRedirection.save()

          console.log(
            `[BACKEND][LOG][Redirection][createAndUpdateRedirections][UPDATE][SUCCESS] Redirection rule updated with = ${finalSlug}`
          )
        } catch (error) {
          console.log(
            `[BACKEND][LOG][Redirection][createAndUpdateRedirections][UPDATE][ERROR] Redirection rule update failed = ${finalSlug}`
          )
          console.log(error)
        }
      } else {
        try {
          // remove redirection rule to the same slug to prevent redirection loop
          await existingRedirection.destroy()

          console.log(
            `[BACKEND][LOG][Redirection][createAndUpdateRedirections][DELETE][SUCCESS] Redirection rule removed with = = ${finalSlug}`
          )
        } catch (error) {
          console.log(
            `[BACKEND][LOG][Redirection][createAndUpdateRedirections][DELETE][ERROR] Redirection rule remove failed = ${finalSlug}`
          )
          console.log(error)
        }
      }
    }
  }

  console.log(
    `[BACKEND][LOG][HandleRedirectionUrlController][createAndUpdateRedirections][SUCCESS] ${documentId}`
  )
}
