export default ({ app, route, redirect }) => {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken && route.path !== '/') {
    redirect('/')
  }
}
