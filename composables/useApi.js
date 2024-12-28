import { useAuthStore } from '~/stores/auth';
import { stringify } from 'qs'
import { getQuery } from 'ufo'
import { defu } from 'defu'
import {navigateTo} from "#app";

export function useApi(url, options = {}) {
  const auth = useAuthStore()

  const defaults = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: auth.token
      ? { Authorization: `Bearer ${auth.token}`, accept: 'application/json' }
      : { accept: 'application/json' },
    watch: false,
    retry: 0,
    async onResponseError({ response }) {
      if ([400, 401].includes(response.status)) {
        const route = useRoute()
        auth.token = null

        switch(route.name) {
          case 'login___ru-RU':
            await navigateTo({ name: 'login___ru-RU' })
            break
          case 'login___en-US':
            await navigateTo({ name: 'login___en-US' })
            break
          default:
            await navigateTo({name: 'login___kz-KZ'})
        }
      }
    }
  }
  if (options.params) {
    options.params = getQuery(
      stringify(
        options.params,
        {
          arrayFormat: 'indices',
          addQueryPrefix: true
        }
      )
    )
  }

  const config = defu(options, defaults)

  return useFetch(url, config)
}