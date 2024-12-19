import React from 'react'
import { View, StyleSheet, Pressable, Alert } from 'react-native'
import Text from './Text'
import theme from '../theme'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-native'
import { useMutation } from '@apollo/client'
import { DELETE_REVIEW } from '../graphql/mutations'

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rating: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  reviewText: {
    color: theme.colors.textPrimary,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

const ReviewItem = ({ review, refetch, showActions, viewType }) => {
  const navigate = useNavigate()
  const [deleteReview] = useMutation(DELETE_REVIEW)

  const handleViewRepository = () => {
    if (review.repository?.id) {
      navigate(`/repository/${review.repository.id}`)
    }
  }

  const handleDeleteReview = () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteReview({ variables: { id: review.id } })
              refetch();
            } catch (error) {
              console.error('Error deleting review:', error)
            }
          },
          style: 'destructive',
        },
      ]
    );
  }

  const heading =
    viewType === 'myReviews'
      ? `${review.repository?.ownerName}/${review.repository?.name}` || 'Unknown Repository'
      : review.user?.username || 'Unknown User'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.username}>{heading}</Text>
          <Text style={styles.date}>
            {format(new Date(review.createdAt), 'dd.MM.yyyy')}
          </Text>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      </View>
      {showActions && (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.viewButton]}
            onPress={handleViewRepository}
          >
            <Text style={styles.buttonText}>View Repository</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteReview}
          >
            <Text style={styles.buttonText}>Delete Review</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default ReviewItem
