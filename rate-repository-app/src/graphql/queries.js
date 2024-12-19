import { gql } from '@apollo/client'

export const ME = gql`
query Me($includeReviews: Boolean = false) {
  me {
    id
    username
    reviews @include(if: $includeReviews) {
      edges {
        node {
          id
          text
          rating
          createdAt
          repository {
            id
            fullName
            ownerName
            name
          }
        }
      }
    }
  }
}
`



export const GET_REPOSITORIES = gql`
query GetRepositories(
  $orderBy: AllRepositoriesOrderBy
  $orderDirection: OrderDirection
  $searchKeyword: String
) {
  repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword) {
    edges {
      node {
        id
        fullName
        description
        language
        forksCount
        stargazersCount
        ratingAverage
        reviewCount
        ownerAvatarUrl
      }
    }
  }
}
`

export const GET_REPOSITORY = gql`
  query GetRepository($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
      id
      fullName
      description
      language
      forksCount
      stargazersCount
      ratingAverage
      reviewCount
      ownerAvatarUrl
      url
      reviews(first: $first, after: $after) {
        edges {
          node {
            id
            text
            rating
            createdAt
            user {
              username
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
    }
  }
`



