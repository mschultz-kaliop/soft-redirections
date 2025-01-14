import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'

import PostgresDatasource from './datasource/postgres/PostgresDatasource'
import StrapiDatasource from './datasource/strapi/StrapiDatasource'
import { ArticleRoutes } from './api/Article'
import { RedirectionRoutes } from './api/Redirection'

async function start(){
  const app = express()
  const httpServer = http.createServer(app)

  const postgresDataSource = new PostgresDatasource()
  await postgresDataSource.authenticate()
  await postgresDataSource.models.UrlsRedirections.sync({ alter: true })
  const strapiDataSource = new StrapiDatasource()

  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(bodyParser.json())
  app.use(cors({ origin: '*' }))

  //////////////
  // Routes
  app.get('/debug', (_req, res) => {
    res.send('Welcome to the server')
  })

  ArticleRoutes(app, { strapiDataSource })
  RedirectionRoutes(app, { postgresDataSource, strapiDataSource })

  //////////////
  // Server
  await new Promise<void>(resolve =>
    httpServer.listen(
      Number(process.env.BACKEND_PORT),
      process.env.BACKEND_HOST,
      () => resolve()
    )
  )
  console.log(
    `🚀 Server ready at http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`
  )
}

;(async () => {
  await start()
})()
