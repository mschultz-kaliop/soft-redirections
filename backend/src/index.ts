import express from 'express'
import http from 'http'

import StrapiDataSource from './datasource/StrapiDataSource'
import { ArticleRoutes } from './api/Article'

async function start(){
  const app = express()
  const httpServer = http.createServer(app)

  const strapiDataSource = new StrapiDataSource()

  //////////////
  // Routes
  app.get('/debug', (_req, res) => {
    res.send('Welcome to the server')
  })
  ArticleRoutes(app, { strapiDataSource })

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
