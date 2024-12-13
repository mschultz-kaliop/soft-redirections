import type { NuxtError } from '#app'

export const useApiError = (error: NuxtError | null) => {
  if (!error) {
    return
  }

  if (error?.statusCode === 404) {
    console.log('TODO SPECIFIC CODE')
  }

  throw createError({
    statusCode: error?.statusCode ?? 500,
    statusMessage: error?.statusMessage ?? 'An error occurred',
  })
}