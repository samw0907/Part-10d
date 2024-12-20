import { useQuery } from '@apollo/client'
import { GET_REPOSITORY } from '../graphql/queries'

const useRepository = (id, variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORY, {
    variables: { id, ...variables },
    fetchPolicy: 'cache-and-network',
  })

  const handleFetchMore = () => {
    if (data?.repository?.reviews?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.repository.reviews.pageInfo.endCursor,
          ...variables,
        },
      })
    }
  }

  return {
    repository: data?.repository || null,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  }
}

export default useRepository
