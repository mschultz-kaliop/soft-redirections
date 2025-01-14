import type { NuxtError } from '#app'

export const useApiError = async (error: NuxtError | null) => {
  if (!error) {
    return
  }

  throw showError({
    statusCode: error?.statusCode ?? 500,
    statusMessage: (error?.statusMessage || error?.message) ?? 'An error occurred',
  })
}
