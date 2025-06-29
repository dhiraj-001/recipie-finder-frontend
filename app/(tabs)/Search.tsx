import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useClerk } from '@clerk/clerk-expo'
import { THEMES } from '@/constants/colors';
import store from '../redux/store';
import { Searchbar } from 'react-native-paper';

const index = () => {
  const [searchQuery, setSearchQuery] = React.useState('');


  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  return (
    <ScrollView style={[{ backgroundColor: theme.background }]}>
      <SafeAreaView style={[styles.maincontainer,]}>
        <Searchbar
          style={[styles.searchBar, { backgroundColor: theme.card }]}
          loading={true}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </SafeAreaView>
    </ScrollView>
  )
}



export default index

const styles = StyleSheet.create({
  maincontainer: {

  },
  searchBar: {
    marginHorizontal: 5,
    marginVertical: 10,
    width: '90%',
    minHeight:10,
    height:40,
  }
})