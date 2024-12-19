import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { Link } from 'react-router-native'
import Text from './Text'

const styles = StyleSheet.create({
  tab: {
    marginRight: 15
  }
})

const AppBarTab = ({ title, to, onPress }) => {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.tab}>
        <Text color="appBarText" fontWeight="bold">
          {title}
        </Text>
      </Pressable>
    )
  }

  return (
    <Link to={to} style={styles.tab}>
      <Text color="appBarText" fontWeight="bold">
        {title}
      </Text>
    </Link>
  )
}

export default AppBarTab
