import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import graphqlIntrospection from '~/generated/introspection-graphql'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: graphqlIntrospection
})

export default function (context) {
  return {
    httpEndpoint: 'http://localhost:4000',
    wsEndpoint: 'ws://localhost:4000/graphql',
    cache: new InMemoryCache({ fragmentMatcher })
  }
}
