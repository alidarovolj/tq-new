import { useAuthStore } from '~/stores/auth';
import { stringify } from 'qs'
import { getQuery } from 'ufo'
import { defu } from 'defu'

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
        if (route.name === `login`) return
        await navigateTo( useLocalePath({ name: `login` }))
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