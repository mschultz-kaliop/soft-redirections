import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize'

//////////////
// Class
export default (sequelize: Sequelize) => {
  class UrlsRedirections extends Model<InferAttributes<UrlsRedirections>, InferCreationAttributes<UrlsRedirections>> {
    declare id: number
    declare source: string | null
    declare redirection: string
    declare code: string
    declare strapi_content_id: string | null
    declare updatedAt: Date | null
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
