import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { onError } from '@apollo/client/link/error'
import graphqlIntrospection from '~/generated/introspection-graphql'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: graphqlIntrospection
})

export default function (context) {
  return {
    httpEndpoint: process.env.GRAPHQL_HTTP_ENDPOINT || 'http://localhost:4000',
    wsEndpoint: process.env.GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql',
    cache: new InMemoryCache({ fragmentMatcher }),
    link: onError(({ graphQLErrors }) => {
      graphQLErrors.forEach((err) => {
        context.$snackbar.error('GraphQL error: ' + err.message)

        if (err.extensions.code === 'UNAUTHENTICATED') {
          context.$apolloHelpers.onLogout()
          context.$router.push('/')
        }
      })
    })
  }
}
