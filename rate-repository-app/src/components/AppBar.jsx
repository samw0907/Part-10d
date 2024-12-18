import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import Constants from 'expo-constants'
import AppBarTab from './AppBarTab'
import theme from '../theme'
import useAuthStorage from '../hooks/useAuthStorage'
import { useApolloClient, useQuery } from '@apollo/client'
import { ME } from '../graphql/queries'

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
    backgroundColor: theme.colors.appBarBackground,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
})

const AppBar = () => {
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()
  const { data } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
  })

  const signOut = async () => {
    await authStorage.removeAccessToken()
    await apolloClient.resetStore()
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <AppBarTab title="Repositories" to="/" />
        {data?.me ? (
          <AppBarTab title="Sign out" onPress={signOut} />
        ) : (
          <AppBarTab title="Sign in" to="/signin" />
        )}
      </ScrollView>
    </View>
  )
}

export default AppBar
