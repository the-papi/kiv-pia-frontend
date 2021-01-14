import refreshLogin from '~/apollo/mutations/refreshLogin'

export default ({ app }) => {
  function refresh () {
    app.apolloProvider.defaultClient.mutate({ mutation: refreshLogin }).then(async (data) => {
      if (data.data.refreshLogin) {
        await app.$apolloHelpers.onLogin(data.data.refreshLogin.accessToken)
      }
    })

    setTimeout(refresh, 120000)
  }

  setTimeout(refresh, 120000)
}
