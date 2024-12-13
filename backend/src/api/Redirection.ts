import { Express } from 'express'

import PostgresDatasource from '../datasource/postgres/PostgresDatasource'
import { Redirection } from '../types/redirection'

//////////////
// Routes
export const RedirectionRoutes = (app: Express, dataSources: { postgresDatasource: PostgresDatasource }): void => {
  app.get('/isOneRedirectionExists/:slug', async (req, res): Promise<void> => {
    try {
      const redirections = await isOneRedirectionExists(dataSources, req.params.slug)
      console.log('[BACKEND][LOG][Redirection][isOneRedirectionExists][SUCESS]')

      res.send(redirections)
    } catch (e) {
      console.log(`[BACKEND][LOG][Redirection][isOneRedirectionExists][ERROR] ${req.params.slug}`)
      console.log(e)
      res.status(404).send('Not found')
    }
  })
}

//////////////
// Funcs
const isOneRedirectionExists = async (dataSources: { postgresDatasource: PostgresDatasource }, slug: string) => {
  const { postgresDatasource } = dataSources
  return postgresDatasource.findAll<Redirection>('UrlsRedirections', { where: { source: slug }})
}
