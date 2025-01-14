import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest'
import qs from 'qs'

//////////////
// Types
export interface ContentBySlug {
  slug: string
}

interface ApiResponse<T> {
  data: T[]
}

//////////////
// Class
export default class StrapiDatasource extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.CMS_URL
  }

  /**
   * @param _path
   * @param request
   */
  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers['authorization'] = `Bearer ${process.env.CMS_CDA_TOKEN}`
  }

  /**
   * Get content for a content type and slug
   *
   * @param contentType
   * @param slug
   */
  async getOneCollectionContentBySlug<T extends ContentBySlug>(
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
    const contentsBySlug: ApiResponse<T> = await this.get(`api/${contentType}?${query}`)

    const index = contentsBySlug.data.findIndex(el => el.slug === slug)

    if (index === -1) {
      throw new Error(`Content ${slug} doesn't exist`)
    }

    return contentsBySlug?.data[index] ?? null
  }

  /**
   * Get all contents for a content type
   *
   * @param contentType
   */
  async getCollectionContents<T>(
    contentType: string
  ): Promise<T[]>  {
    const contents = await this.get(`api/${contentType}`)

    return contents?.data ?? null
  }

  /**
   * Get content for a content type and id
   *
   * @param contentType
   * @param id
   */
  async getOneCollectionContentById<T>(
    contentType: string,
    id: string
  ): Promise<T>  {
    const content = await this.get(`api/${contentType}/${id}`)

    return content?.data ?? null
  }
}
