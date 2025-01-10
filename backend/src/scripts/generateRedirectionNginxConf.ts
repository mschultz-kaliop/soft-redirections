import { writeFileSync } from 'fs'

import PostgresDatasource from '../datasource/postgres/PostgresDatasource'
import { Redirection } from '../types/redirection'

async function run(): Promise<void> {
  try {
    const allRedirectionsUrls = await getAllRedirectionsUrls()

    await createNginxConfFile(allRedirectionsUrls)

    console.log('[BACKEND][SCRIPT][LOG][generateRedirectionNginxConf][SUCCESS] Nginx conf file generated')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/**
 * Create conf file and write data
 *
 * @param allRedirectionsUrls List of URL redirections
 */
async function createNginxConfFile(allRedirectionsUrls: Redirection[]): Promise<void> {
  const fileName = `/usr/src/app/gen-nginx/gen-nginx-from-bdd-${Date.now()}.conf`

  try {
    const slugRegex = /[{};]/g
    const routes = allRedirectionsUrls
      .filter(
        (route) =>
          !slugRegex.test(route.source) && !slugRegex.test(route.redirection)
      )
      .map((route) => {
        if (route.source.startsWith('^')) {
          return `location ~ ${route.source} {
    return ${route.code} ${route.redirection};
}`
        } else {
          return `location = ${route.source} {
    return ${route.code} ${route.redirection};
}`
        }
      })

    writeFileSync(fileName, routes.join('\n'))

    console.log(
      `[BACKEND][SCRIPT][LOG][generateRedirectionNginxConf][createNginxConfFile][SUCCESS] The nginx conf file ${fileName} was locally written successfully`
    )
  } catch (error) {
    console.error(
      `[BACKEND][SCRIPT][LOG][generateRedirectionNginxConf][createNginxConfFile][ERROR] The nginx conf file ${fileName} was not written`
    )
    console.error(error)
  }
}

/**
 * Retrieve all URL redirections from Postgres
 *
 * @returns List of URL redirections
 */
async function getAllRedirectionsUrls(): Promise<Redirection[]> {
  let postgresDatasource: PostgresDatasource = new PostgresDatasource()
  await postgresDatasource.authenticate()

  let queryOptions: any = {
    order: [['id', 'DESC']],
  }

  return await postgresDatasource.models.UrlsRedirections.findAll(queryOptions)
}

run()
