import React from 'react'
import { FlatList, Text, View, StyleSheet } from 'react-native'
import { useParams } from 'react-router-native'
import useRepository from '../hooks/useRepository'
import RepositoryItem from './RepositoryItem'
import ReviewItem from './ReviewItem'

const styles = StyleSheet.create({
  separator: {
    height: 10
  }
})

const SingleRepository = () => {
  const { id } = useParams()
  const { repository, loading, fetchMore } = useRepository(id, { first: 5 })

  if (loading) return <Text>Loading...</Text>
  if (!repository) return <Text>Repository not found</Text>

  const reviews = repository.reviews?.edges.map((edge) => edge.node) || []

  const onEndReach = () => {
    fetchMore()
  }

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => (
        <RepositoryItem item={repository} showGitHubButton />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  )
}

export default SingleRepository
