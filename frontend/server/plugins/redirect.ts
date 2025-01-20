import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { H3Event } from 'h3'
import { NitroRuntimeConfig } from 'nitropack'

import { Redirection } from '~/types/redirection'

export default defineNitroPlugin((nitroApp) => {
  const config: NitroRuntimeConfig = useRuntimeConfig()
  const baseURL: string = config.apiBackendHost

  const axiosInstance: AxiosInstance = axios.create({
    baseURL
  })

  nitroApp.hooks.hook('beforeResponse', async (event: H3Event, { body }) => {
    let params: URLSearchParams = new URLSearchParams(event.node.req.url)
    let path: string = params.get('/__nuxt_error?url') || ''

    if (
      event.context.matchedRoute?.path === '/__nuxt_error' &&
      params.get('statusCode') === '404'
    ) {
      try {
        const response: AxiosResponse = await axiosInstance.get<Redirection[]>(`/redirectionsBySlug/${encodeURIComponent(path)}`)
        const redirectionData: Redirection = response?.data.pop() ?? null

        if (redirectionData) {
          event.node.res.writeHead(
            redirectionData.code || 307,
            redirectionData.code === 301 ? 'Moved Permanently' : 'Temporary Redirect',
            { Location: redirectionData.redirection }
          )
          event.node.res.end()
        }
      } catch (error) {
        console.warn('Failed to handle redirection', error)
      }
    }
  })
})
