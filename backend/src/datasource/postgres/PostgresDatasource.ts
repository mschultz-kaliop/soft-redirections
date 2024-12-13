import { Sequelize } from 'sequelize'
import { RESTDataSource } from '@apollo/datasource-rest'

import UrlsRedirections from './models/UrlsRedirections'

//////////////
// Types
interface Config {
  database: {
    database: string
    username: string
    password: string
    host: string
  }
}

//////////////
// Class
class PostgresDatasource extends RESTDataSource {
  public models: { [key: string]: any } = {}
  private config: Config
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
}

export default PostgresDatasource
