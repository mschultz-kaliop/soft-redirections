import { Sequelize, FindOptions } from 'sequelize'
import { RESTDataSource } from '@apollo/datasource-rest'

import UrlsRedirections from './models/UrlsRedirections'

//////////////
// Class
class PostgresDatasource extends RESTDataSource {
  public models: { [key: string]: any } = {}
  private readonly sequelize: Sequelize

  constructor() {
    super()

    this.sequelize = new Sequelize(
      'backend',
      'admin',
      'admin',
      {
        host: 'soft-redirections-backend-postgres',
        dialect: 'postgres',
        logging: false,
      }
    )

    this.initModels()
  }

  public async authenticate(): Promise<void> {
    await this.sequelize.authenticate()
  }

  private initModels(): void {
    this.models.UrlsRedirections = UrlsRedirections(this.sequelize)
  }

  /**
   * Get all element for a model
   *
   * @param model
   * @param query
   */
  public findAll<T>(model: string, query: FindOptions = {}): Promise<T[]> {
    return this.models[model].findAll(query)
  }
}

export default PostgresDatasource
