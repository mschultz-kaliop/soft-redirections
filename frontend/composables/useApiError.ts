import type { NuxtError } from '#app'

import type { Redirection } from '~/types/redirection'

export const useApiError = async (error: NuxtError | null) => {
  if (!error) {
    return
  }

  if (error?.statusCode === 404) {
    const route = useRoute()
    const { $axios } = useNuxtApp()

    const response = await $axios.get<Redirection[]>(`/redirectionsBySlug/${encodeURIComponent(route.path)}`)
    const redirectionData = response?.data.pop() ?? null

    if (redirectionData) {
      await navigateTo(redirectionData.redirection)
      return
    }
  }

  throw showError({
    statusCode: error?.statusCode ?? 500,
    statusMessage: error?.statusMessage ?? 'An error occurred',
  })
}