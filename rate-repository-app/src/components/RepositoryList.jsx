import React, { useState } from 'react'
import { FlatList, View, StyleSheet, Pressable, TextInput } from 'react-native'
import { useNavigate } from 'react-router-native'
import { Picker } from '@react-native-picker/picker'
import { useDebounce } from 'use-debounce'
import RepositoryItem from './RepositoryItem'
import useRepositories from '../hooks/useRepositories'

const styles = StyleSheet.create({
  separator: {
    height: 10
  },
  pickerContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5da',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
})

const ItemSeparator = () => <View style={styles.separator} />

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const { selectedOrder, setSelectedOrder, searchKeyword, setSearchKeyword } = this.props

    return (
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search repositories..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedOrder}
            onValueChange={(itemValue) => setSelectedOrder(itemValue)}
          >
            <Picker.Item label="Latest repositories" value="latest" />
            <Picker.Item label="Highest rated repositories" value="highest" />
            <Picker.Item label="Lowest rated repositories" value="lowest" />
          </Picker>
        </View>
      </View>
    )
  }

  render() {
    const { repositories, navigate } = this.props

    return (
      <FlatList
        data={repositories}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={this.renderHeader}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
            <RepositoryItem item={item} />
          </Pressable>
        )}
      />
    )
  }
}

const RepositoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState('latest')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500)
  const navigate = useNavigate()
  const getOrderVariables = () => {
    switch (selectedOrder) {
      case 'highest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' }
      case 'lowest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' }
      default:
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' }
    }
  }

  const variables = { ...getOrderVariables(), searchKeyword: debouncedSearchKeyword }
  const { repositories } = useRepositories(variables)

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : []

  return (
    <RepositoryListContainer
      repositories={repositoryNodes}
      selectedOrder={selectedOrder}
      setSelectedOrder={setSelectedOrder}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
      navigate={navigate}
    />
  )
}

export default RepositoryList