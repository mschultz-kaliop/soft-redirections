import { Request, Response } from 'express';
import StrapiDataSource from '../datasource/strapi/StrapiDataSource'
import PostgresDatasource from '../datasource/postgres/PostgresDatasource';
import { Article } from '../api/Article';

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
   * @param strapiId 
   * @param finalSlug 
   * @param existingSlug 
   * @param type 
   */
  async createAndUpdateRedirections (
    strapiId: string,
    finalSlug: string,
    existingSlug: string,
    type: string | null = null
  ): Promise<void> {
    // create redirection rule from last to new slug
    await this.postgresDatasource.models.UrlsRedirections.create({
      source: existingSlug,
      redirection: finalSlug,
      code: '301',
      strapi_content_id: strapiId,
      updatedAt: new Date()
    })

    // fetch existing redirections matching contentful content id
    const searchExistingRedirections =
      await this.postgresDatasource.models.UrlsRedirections.findAll({
        where: {
          strapi_content_id: strapiId
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
              `[LOG][HandleRedirectionUrlController][createAndUpdateRedirections][UPDATE][SUCCESS] successfully updated existing redirection rule with redirection = ${finalSlug}`
            )
          } catch (error) {
            console.log(
              `[LOG][HandleRedirectionUrlController][createAndUpdateRedirections][UPDATE][ERROR] can't update existing redirection rule with redirection = ${finalSlug}`
            )
            console.log(error)
          }
        } else {
          try {
            // remove redirection rule to the same slug to prevent redirection loop
            await existingRedirection.destroy()

            console.log(
              `[LOG][HandleRedirectionUrlController][createAndUpdateRedirections][DELETE][SUCCESS] successfully removed existing redirection rule with source = ${finalSlug}`
            )
          } catch (error) {
            console.log(
              `[LOG][HandleRedirectionUrlController][createAndUpdateRedirections][DELETE][ERROR] can't remove existing redirection rule with source = ${finalSlug}`
            )
            console.log(error)
          }
        }
      }
    }

    console.log(
      `[LOG][HandleRedirectionUrlController][createAndUpdateRedirections][SUCCESS] successfully created/updated redirections rules for ${strapiId}`
    )
  }

  /**
   * Get ElasticSearch index name from a content type
   * 
   * @param type 
   * @returns 
   */
  getIndexName (type: string): string | null {
    const indexMapping: Record<string, string> = {
      article: 'articles',
    }
    return indexMapping[type] || null
  }

  /**
   * Get existing slug for content in table urls_redirections
   * 
   * @param indexName 
   * @param strapiId 
   * @returns 
   */
  async getExistingSlug (indexName: string, strapiId: string): Promise<string | null> {
    const exists = await this.postgresDatasource.models.UrlsRedirections.findAll({
      where: {
        strapi_content_id: strapiId
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
   * @param contentFromStrapi 
   * @returns 
   */
  async getFinalSlug (contentFromStrapi: any): Promise<string> {
    let finalSlug = contentFromStrapi.data.slug

    return `/${finalSlug}`
  }

  /**
   * Get redirections rules in database from a source url
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
    console.log(
      '### [Redirection Handler - DEBUG] handleRedirectionUrl - body'
    )
    console.log(req.body)
    console.log('#####################################################')

    const { strapiId, type } = req.body

    try {
      await this.postgresDatasource.authenticate()
      const indexName = this.getIndexName(type)

      // TODO get Strapi entry by id
      const contentFromStrapi = await this.strapiDatasource.getOneCollectionContentById<Article>('articles', strapiId)
      console.log('contentFromStrapi', contentFromStrapi)
      // const contentFromContentful =
      //   await this.contentfulDatasource.getEntryById(contentfulId, 2)

      const finalSlug = await this.getFinalSlug(contentFromStrapi)
      console.log('finalSlug', finalSlug)
      const existingSlug = await this.getExistingSlug(indexName, strapiId)
      console.log('existingSlug', existingSlug)

      const alreadyExistRedirection = await this.postgresDatasource.models.UrlsRedirections.findAll({
        where: {
          source: existingSlug,
          redirection: finalSlug
        }
      })

      // we continue redirection process only if same redirection rule doesn't already exist in database to avoid duplicates
      if (alreadyExistRedirection.length === 0) {
        if (existingSlug && finalSlug !== existingSlug) {
          await this.createAndUpdateRedirections(
            strapiId,
            finalSlug,
            existingSlug
          )
        } else {
          console.log(
            `[LOG][HandleRedirectionUrlController][handleRedirectionUrl][INFO] do nothing because source ${existingSlug} and redirection ${finalSlug} are the same`
          )  
        }
      } else {
        console.log(
          `[LOG][HandleRedirectionUrlController][handleRedirectionUrl][INFO] do nothing because redirection rule with source ${existingSlug} and redirection ${finalSlug} already exist`
        )
      }

      console.log(
        `[LOG][HandleRedirectionUrlController][handleRedirectionUrl][SUCCESS] successfully handled redirections rules for ${strapiId}`
      )

      res.send({
        success: `Successfully handled redirections rules for ${strapiId}`
      })
    } catch (error) {
      console.log(
        `[LOG][HandleRedirectionUrlController][handleRedirectionUrl][ERROR] while trying to create/update redirections rules for ${strapiId}`
      )
      console.log(error)

      res.send({
        error: `Error while create/update redirections rules for ${strapiId}`
      })
    }
  }
}

export { HandleRedirectionUrlController };
