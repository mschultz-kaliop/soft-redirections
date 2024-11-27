import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest'
import qs from 'qs'

export default class StrapiDataSource extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.CMS_URL
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers['authorization'] = `Bearer ${process.env.CMS_CDA_TOKEN}`
  }

  /**
   * Get content for a content type and slug
   */
  async getOneCollectionContentBySlug<T>(
    contentType: string,
    slug: string
  ): Promise<T> {
    const options = {
      filters: {
        slug: {
          '$eq': slug
        }
      }
    }
    const query = qs.stringify(options, { encodeValuesOnly: true })
    const contentsBySlug = await this.get(`api/${contentType}?${query}`)

    const index = contentsBySlug.data.findIndex(el => el.slug === slug)

    if (index === -1) {
      throw new Error(`Content ${slug} doesn't exist`)
    }

    return contentsBySlug.data[index]
  }

  /**
   * Get all contents for a content type
   */
  async getCollectionContents<T>(
    contentType: string
  ): Promise<T[]>  {
    return this.get(`api/${contentType}`)
  }
}
