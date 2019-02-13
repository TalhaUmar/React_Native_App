import { ApolloClient, createNetworkInterface, addTypename } from 'react-apollo';

const httpNetworkInterface = createNetworkInterface({
    uri: 'https://customapistore.myshopify.com/api/graphql',
    opts: {
      // Additional fetch options like `credentials` or `headers`
      headers: { 'X-Shopify-Storefront-Access-Token': '67b8a8fb7f951e15fd467612c5c56616' },
    },
    queryTransformer: addTypename
});



export const client = new ApolloClient({
  networkInterface: httpNetworkInterface
});

export default client;
