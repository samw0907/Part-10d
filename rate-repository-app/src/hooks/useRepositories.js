import { useQuery } from '@apollo/client'
import { GET_REPOSITORIES } from '../graphql/queries'

const useRepositories = ({ orderBy, orderDirection, searchKeyword }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORIES, {
    variables: {
      orderBy,
      orderDirection,
      searchKeyword,
      first: 10,
    },
    fetchPolicy: 'cache-and-network',
  })

  const handleFetchMore = () => {
    if (data?.repositories.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.repositories.pageInfo.endCursor,
        },
      })
    }
  }

  return {
    repositories: data?.repositories || null,
    loading,
    error,
    fetchMore: handleFetchMore,
  }
}

export default useRepositories
