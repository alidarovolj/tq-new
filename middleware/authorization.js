export default defineNuxtRouteMiddleware(() => {

  const { $cookie } = useNuxtApp()

  if ($cookie.token.value) return

  return navigateTo({ name: 'index' })
})