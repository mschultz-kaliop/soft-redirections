import { Request, Response } from 'express'

import StrapiDataSource from '../datasource/strapi/StrapiDataSource'
import PostgresDatasource from '../datasource/postgres/PostgresDatasource'

import { Article, ARTICLE_CONTENT_TYPE, ARTICLE_CONTENT_TYPE_NAME } from '../api/Article'

class HandleRedirectionUrlController {
  private strapiDatasource: StrapiDataSource;
  private postgresDatasource: PostgresDatasource;

  constructor () {
    this.strapiDatasource = new StrapiDataSource()
    this.postgresDatasource = new PostgresDatasource()
  }

  /**
   * Create and update redirections rules in database
   * 
   * @param documentId 
   * @param finalSlug 
   * @param existingSlug 
   */
  async createAndUpdateRedirections (
    documentId: string,
    finalSlug: string,
    existingSlug: string
  ): Promise<void> {
    // create redirection rule from last to new slug
    await this.postgresDatasource.models.UrlsRedirections.create({
      source: existingSlug,
      redirection: finalSlug,
      code: '301',
      strapi_content_id: documentId,
      updatedAt: new Date()
    })

    // fetch existing redirections matching contentful content id
    const searchExistingRedirections =
      await this.postgresDatasource.models.UrlsRedirections.findAll({
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
              `[BACKEND][LOG][HandleRedirectionUrlController][createAndUpdateRedirections][UPDATE][SUCCESS] Redirection rule updated with = ${finalSlug}`
            )
          } catch (error) {
            console.log(
              `[BACKEND][LOG][HandleRedirectionUrlController][createAndUpdateRedirections][UPDATE][ERROR] Redirection rule update failed = ${finalSlug}`
            )
            console.log(error)
          }
        } else {
          try {
            // remove redirection rule to the same slug to prevent redirection loop
            await existingRedirection.destroy()

            console.log(
              `[BACKEND][LOG][HandleRedirectionUrlController][createAndUpdateRedirections][DELETE][SUCCESS] Redirection rule removed with = = ${finalSlug}`
            )
          } catch (error) {
            console.log(
              `[BACKEND][LOG][HandleRedirectionUrlController][createAndUpdateRedirections][DELETE][ERROR] Redirection rule remove failed = ${finalSlug}`
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

  /**
   * Get existing slug for content in table urls_redirections
   * 
   * @param documentId 
   * @returns 
   */
  async getExistingSlug (documentId: string): Promise<string | null> {
    const exists = await this.postgresDatasource.models.UrlsRedirections.findAll({
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
   * Get final slug formatted function of content type
   * 
   * @param type 
   * @param contentFromStrapi 
   * @returns 
   */
  async getFinalSlug (type: string, contentFromStrapi: any): Promise<string> {
    let finalSlug = contentFromStrapi.data.slug

    if (type === ARTICLE_CONTENT_TYPE) {
      finalSlug = `${type}/${contentFromStrapi.data.slug}`
    }

    return `/${finalSlug}`
  }

  /**
   * Get redirections rules in database from a source url
   * TODO a supprimer ??
   * 
   * @param req 
   * @param res 
   */
  async getRedirections (req: Request, res: Response): Promise<void> {
    const searchExistingRedirection =
      await this.postgresDatasource.models.UrlsRedirections.findAll({
        where: {
          source: req.body.sourceUrl
        }
      })

    const redirections = searchExistingRedirection.map((item) => {
      return {
        from: item.source,
        to: item.redirection,
        code: parseInt(item.code)
      }
    })

    res.send({
      success: `Successfully get redirections rules for ${req.body.sourceUrl}`,
      redirections
    })
  }

  /**
   * Handle redirection url creation/update
   * 
   * @param req 
   * @param res 
   */
  async handleRedirectionUrl (req: Request, res: Response): Promise<void>{
    const { model } = req.body
    const { documentId } = req.body.entry

    try {
      await this.postgresDatasource.authenticate()

      const contentFromStrapi = await this.strapiDatasource.getOneCollectionContentById<Article>(ARTICLE_CONTENT_TYPE_NAME, documentId)

      const finalSlug = await this.getFinalSlug(model, contentFromStrapi)
      const existingSlug = await this.getExistingSlug(documentId)

      const alreadyExistRedirection = await this.postgresDatasource.models.UrlsRedirections.findAll({
        where: {
          source: existingSlug,
          redirection: finalSlug
        }
      })

      // we continue redirection process only if same redirection rule doesn't already exist in database to avoid duplicates or if source is null (interpreted as a content creation)
      if (alreadyExistRedirection.length === 0) {
        if (finalSlug !== existingSlug) {
          await this.createAndUpdateRedirections(
            documentId,
            finalSlug,
            existingSlug
          )
        } else {
          console.log(
            `[BACKEND][LOG][HandleRedirectionUrlController][handleRedirectionUrl][INFO] Source ${existingSlug} and redirection ${finalSlug} are the same`
          )  
        }
      } else {
        console.log(
          `[BACKEND][LOG][HandleRedirectionUrlController][handleRedirectionUrl][INFO] Source ${existingSlug} and redirection ${finalSlug} already exist`
        )
      }

      console.log(
        `[BACKEND][LOG][HandleRedirectionUrlController][handleRedirectionUrl][SUCCESS] Redirection rule success = ${documentId}`
      )

      res.send({
        success: `Successfully handled redirections rules for ${documentId}`
      })
    } catch (error) {
      console.log(
        `[BACKEND][LOG][HandleRedirectionUrlController][handleRedirectionUrl][ERROR] Redirection rule failed = ${documentId}`
      )
      console.log(error)
      console.log(req.body)

      res.send({
        error: `Error while create/update redirections rules for ${documentId}`
      })
    }
  }
}

export { HandleRedirectionUrlController }
