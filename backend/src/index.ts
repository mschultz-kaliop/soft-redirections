import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'

import PostgresDatasource from './datasource/postgres/PostgresDatasource'
import StrapiDataSource from './datasource/strapi/StrapiDataSource'
import { ArticleRoutes } from './api/Article'
import { RedirectionRoutes } from './api/Redirection'
import { HandleRedirectionUrlController } from './controller/HandleRedirectionUrlController'

async function start(){
  const app = express()
  const httpServer = http.createServer(app)

  const postgresDatasource = new PostgresDatasource()
  await postgresDatasource.authenticate()
  await postgresDatasource.models.UrlsRedirections.sync({ alter: true })
  const strapiDataSource = new StrapiDataSource()

  const handleRedirectionUrlController = new HandleRedirectionUrlController()

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
  
  app.post(
    '/handleRedirectionUrl',
    handleRedirectionUrlController.handleRedirectionUrl.bind(
      handleRedirectionUrlController
    )
  )

  ArticleRoutes(app, { strapiDataSource })
  RedirectionRoutes(app, { postgresDatasource })

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
