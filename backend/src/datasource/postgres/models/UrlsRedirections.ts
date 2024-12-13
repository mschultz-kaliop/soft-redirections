import { Model, DataTypes, Sequelize } from 'sequelize'

import { Redirection } from '../../../types/redirection'

//////////////
// Class
export default (sequelize: Sequelize) => {
  class UrlsRedirections extends Model<Redirection>
    implements Redirection {
    public id!: number
    public source!: string
    public redirection!: string
    public code!: string
    public strapi_content_id!: string
    public updatedAt!: Date
  }

  UrlsRedirections.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING(2048),
        allowNull: true,
      },
      redirection: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      strapi_content_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'urls_redirections',
      tableName: 'urls_redirections',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  )

  return UrlsRedirections
}
