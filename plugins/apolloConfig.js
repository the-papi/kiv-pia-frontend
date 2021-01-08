import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import graphqlIntrospection from '~/generated/introspection-graphql'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: graphqlIntrospection
})

export default function (context) {
  return {
    httpEndpoint: 'http://192.168.1.123:4000',
    wsEndpoint: 'ws://192.168.1.123:4000/graphql',
    cache: new InMemoryCache({ fragmentMatcher })
  }
}
