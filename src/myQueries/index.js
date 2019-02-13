import gql from 'graphql-tag';

export const getShopName = gql`query {
    shop {
        name
        primaryDomain {
          url
          host
        }
      }
}`;

export const getProductsInPopnoshCollection = gql` query {
shop {
collections(first: 3) {
  edges {
    node {
      id
      handle
      image{
          id
          src
      }
    }
  }
}
}
}`;

export const getPopnoshProducts = gql` query {
    shop {
        products(first: 6){
            pageInfo {
                hasNextPage
            }
            edges {
                cursor
                node {
                    id
                    title
                    handle
                    description
                    images(first: 1) {
                        edges {
                            node {
                                id
                                src
                            }
                        }
                    }
                    variants(first: 5) {
                        edges {
                            node {
                                id
                                title
                                price
                                image {
                                    id
                                    src
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export const loadMoreProducts = gql` query($cursor: String!) {
    shop {
        products(first: 2, after: $cursor){
            pageInfo {
                hasNextPage
            }
            edges {
                cursor
                node {
                    id
                    title
                    handle
                    description
                    images(first: 1) {
                        edges {
                            node {
                                id
                                src
                            }
                        }
                    }
                    variants(first: 5) {
                        edges {
                            node {
                                id
                                title
                                price
                                image {
                                    id
                                    src
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export const getShopCurrencyCode = gql` query{
    shop{
        paymentSettings{
            currencyCode
        }
    }
}`;

export const getShopCollections = gql` query {
    shop {
        collections(first: 10) {
            edges {
                node {
                    id
                    title
                    handle
                    image {
                        id
                        src
                    }
                }
            } 
        }
    }
}`;

export const getProductsWithCollectionFilter = gql` query($filterQuery: String!) {
    shop{
        products(first: 10, query: $filterQuery){
            edges {
                cursor
                node {
                    id
                    title
                    handle
                    description
                    images(first: 10) {
                        edges {
                            node {
                                id
                                src
                            }
                        }
                    }
                    variants(first: 5) {
                        edges {
                            node {
                                id
                                title
                                price
                                available
                                availableForSale
                                image {
                                    id
                                    src
                                }
                            }
                        }
                    }
                }
            }
            pageInfo {
                hasNextPage
            }
        }
    }
}`;

export const loadMoreProductsWithCollectionFilter = gql` query($cursor: String!, $filterQuery: String!) {
    shop{
        products(first: 10, after: $cursor, query: $filterQuery){
            edges {
                cursor
                node {
                    id
                    title
                    handle
                    description
                    images(first: 1) {
                        edges {
                            node {
                                id
                                src
                            }
                        }
                    }
                    variants(first: 5) {
                        edges {
                            node {
                                id
                                title
                                price
                                image {
                                    id
                                    src
                                }
                            }
                        }
                    }
                }
            }
            pageInfo {
                hasNextPage
            }
        }
    }
}`;


// export const getPopnoshProducts = client.readQuery({
//     query: gql` query {
//         shop{
//         products(first: 8){
//             edges {
//                 node {
//                     id
//                     title
//                     handle
//                     images(first: 1) {
//                         edges {
//                             node {
//                                 id
//                                 src
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//         }
//         }`,
//   });

// export const getProductDetail = gql` query($handle: String!) {
//     shop{
//         productByHandle(handle: $handle){
//                 id
//                 title
//                 handle
//                 description
//                 images(first: 5) {
//                     edges {
//                         node {
//                             id
//                             src
//                         }
//                     }
//                 }
//         }
//     }
// }`;

export const getProductDetail = gql` query($handle: String!) {
    shop{
        productByHandle(handle: $handle){
                id
                title
                handle
                description
                images(first: 5) {
                    edges {
                        node {
                            id
                            src
                        }
                    }
                }
                variants(first: 5) {
                    edges {
                        node {
                            id
                            title
                            price
                            image {
                                id
                                src
                            }
                        }
                    }
                }
        }
    }
}`;

export const searchProductsQuery = gql` query($filterQuery: String!){
    shop {
        products(first: 10, query: $filterQuery) {
            edges {
                cursor
                node {
                    id
                    title
                    handle
                    description
                    productType
                    images(first: 5) {
                        edges {
                            node {
                                id
                                src
                            }
                        }
                    }
                    variants(first: 5) {
                        edges {
                            node {
                                id
                                title
                                price
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export const createCustomerMutation = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
          }
        }
      }
`;

export const createCustomerAccessToken = gql`
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      userErrors {
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }`;

export const renewCustomerAccessToken = gql`
mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        userErrors {
            field
            message
        }
        customerAccessToken {
            accessToken
            expiresAt
        }
    }
}`;

export const deleteCustomerAccessToken = gql`
mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        userErrors {
            field
            message
        }
        deletedAccessToken
        deletedCustomerAccessTokenId
    }
}`;

export const updateCustomerMutation = gql`
mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        userErrors {
            field
            message
        }
        customer {
            id
            firstName
            lastName
            email
            phone
            acceptsMarketing
        }
    }
}`;

export const forgotPassword = gql`
mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
        userErrors {
            field
            message
        }
    }
}`;

export const getCustomerObject = gql` query($customerAccessToken: String!){
    customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
    }
}`;

export const getCustomerAddresses = gql` query($customerAccessToken: String!){
    customer(customerAccessToken: $customerAccessToken) {
        id
        addresses(first: 10){
            edges{
                node{
                    id
                    address1
                    address2
                    firstName
                    lastName
                    city
                    phone
                    province
                }
            }
        }
    }
}`;

export const createCustomerAddress = gql`
mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        userErrors {
            field
            message
        }
        customerAddress {
            id
        }
    }
}`;

export const updateCustomerAddress = gql`
mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        userErrors {
            field
            message
        }
        customerAddress {
            id
        } 
    }
}`;

export const deleteCustomerAddress = gql`
mutation customerAddressDelete($id: ID!, $customerAccessToken: String!) {
    customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
        userErrors {
            field
            message
        }
        deletedCustomerAddressId
    }
}`;

export const checkoutCreate = gql`
mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
        userErrors {
            field
            message
        }
        checkout {
            id
            webUrl
            customer {
                id
                email
            }
        }
    }
}`;

export const checkoutAssociateCustomer = gql`
mutation checkoutCustomerAssociate($checkoutId: ID!, $customerAccessToken: String!) {
    checkoutCustomerAssociate(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
      userErrors {
        field
        message
      }
      checkout {
        id
      }
    }
}`;

export const checkoutShippingAddressUpdate = gql`
mutation checkoutShippingAddressUpdate($shippingAddress: MailingAddressInput!, $checkoutId: ID!) {
    checkoutShippingAddressUpdate(shippingAddress: $shippingAddress, checkoutId: $checkoutId) {
      userErrors {
        field
        message
      }
      checkout {
        id
      }
    }
}`;
