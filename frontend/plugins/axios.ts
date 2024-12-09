import axios from "axios";
import type { AxiosInstance } from "axios";

declare module "#app" {
  interface NuxtApp {
    $axios: AxiosInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config
  const baseURL: string = import.meta.env.SSR
    ? config.apiBackendHost
    : config.public.apiBackendHost;

  const axiosInstance = axios.create({
    baseURL
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})