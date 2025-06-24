import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useClerk } from '@clerk/clerk-expo'
import { THEMES } from '@/constants/colors';
import store from '../redux/store';


const index = () => {
  const { signOut } = useClerk()


  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  return (
    <ScrollView style={[{ backgroundColor: theme.background }]}>
      <SafeAreaView style={[styles.maincontainer,]}>
       
      </SafeAreaView> 
      </ScrollView>
  )
}



export default index

const styles = StyleSheet.create({
  maincontainer: {

  }
})