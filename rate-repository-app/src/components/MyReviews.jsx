import React from 'react'
import { FlatList, View, StyleSheet, Text } from 'react-native'
import { useQuery } from '@apollo/client'
import { ME } from '../graphql/queries'
import ReviewItem from './ReviewItem'

const styles = StyleSheet.create({
  separator: {
    height: 10
  }
})

const ItemSeparator = () => <View style={styles.separator} />

const MyReviews = () => {
  const { data, loading, error, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading reviews</Text>

  const reviews = data?.me?.reviews?.edges.map((edge) => edge.node) || []

  return (
    <FlatList
      data={reviews}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => (
        <ReviewItem review={item} refetch={refetch} showActions={true} viewType="myReviews" />
      )}
      ItemSeparatorComponent={ItemSeparator}
    />
  )
}

export default MyReviews
