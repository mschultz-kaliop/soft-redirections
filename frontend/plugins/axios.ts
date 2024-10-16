import axios from "axios";
import type { AxiosInstance } from "axios";

declare module "#app" {
  interface NuxtApp {
    $axios: AxiosInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config

  const axiosInstance = axios.create({
    baseURL: config.public.httpHost as string
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})