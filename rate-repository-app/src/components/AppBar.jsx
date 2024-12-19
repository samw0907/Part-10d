import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import AppBarTab from './AppBarTab';
import theme from '../theme';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import { useApolloClient } from '@apollo/client';
import useAuthStorage from '../hooks/useAuthStorage';

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
});

const AppBar = () => {
  const { data } = useQuery(ME, { fetchPolicy: 'cache-and-network' });
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore(); // Clear Apollo cache
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <AppBarTab title="Repositories" to="/" />
        {data?.me && <AppBarTab title="Create a review" to="/create-review" />}
        {data?.me && <AppBarTab title="My reviews" to="/my-reviews" />}
        {!data?.me && <AppBarTab title="Sign up" to="/signup" />}
        {!data?.me ? (
          <AppBarTab title="Sign in" to="/signin" />
        ) : (
          <AppBarTab title="Sign out" onPress={signOut} />
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
