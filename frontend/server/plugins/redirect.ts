import axios from 'axios'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const baseURL: string = config.apiBackendHost

  const axiosInstance = axios.create({
    baseURL
  })

  nitroApp.hooks.hook('beforeResponse', async (event, { body }) => {
    let params = new URLSearchParams(event.node.req.url)
    let path = params.get('/__nuxt_error?url')

    if (
      event.context.matchedRoute.path === '/__nuxt_error' &&
      params.get('statusCode') === '404'
    ) {
      try {
        const response = await axiosInstance.get<Redirection[]>(`/redirectionsBySlug/${encodeURIComponent(path)}`)
        const redirectionData = response?.data.pop() ?? null

        if (redirectionData) {
          await sendRedirect(event, redirectionData.redirection, parseInt(redirectionData.code) || 307)
        }
      } catch (error) {
        console.warn('Failed to handle redirection', error)
      }
    }
  })
})
