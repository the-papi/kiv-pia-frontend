import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { onError } from '@apollo/client/link/error'
import graphqlIntrospection from '~/generated/introspection-graphql'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: graphqlIntrospection
})

export default function (context, foo, bar) {
  return {
    httpEndpoint: 'http://192.168.1.110:4000',
    wsEndpoint: 'ws://192.168.1.110:4000/graphql',
    cache: new InMemoryCache({ fragmentMatcher }),
    link: onError(({ graphQLErrors }) => {
      graphQLErrors.forEach((err) => {
        context.$snackbar.error('GraphQL error: ' + err.message)
      })
    })
  }
}
