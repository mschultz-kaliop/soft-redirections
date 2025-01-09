import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  // ---
  // WORKS BUT RUNS ON ALL REQUESTS, NOT JUST 404
  // ---

  // const { $axios } = useNuxtApp()
  //
  // try {
  //   const response = await $axios.get<Redirection[]>(`/redirectionsBySlug/${encodeURIComponent(to.path)}`)
  //   const redirectionData = response?.data.pop() ?? null
  //   console.log('redirectionData')
  //
  //   if (redirectionData) {
  //     return navigateTo(redirectionData.redirection, { redirectCode: redirectionData.code })
  //   }
  // } catch (error) {
  //   console.warn('Failed to handle redirection', error)
  // }
})
