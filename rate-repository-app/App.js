import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import { NativeRouter } from 'react-router-native'
import Constants from 'expo-constants'

import Main from './src/components/Main'
import createApolloClient from './src/apolloClient'
import AuthStorage from './src/utils/authStorage'
import AuthStorageContext from './src/contexts/AuthStorageContext'

const authStorage = new AuthStorage()
const apolloClient = createApolloClient(authStorage)

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <AuthStorageContext.Provider value={authStorage}>
          <Main />
        </AuthStorageContext.Provider>
      </ApolloProvider>
    </NativeRouter>
  )
}

export default App
