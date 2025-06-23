import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { setTheme } from '../redux/Slices/themeSlice';
import { useDispatch } from 'react-redux';
import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'


const index = () => {
  const color = useColorScheme()
  const dispatch = useDispatch()
  const { signOut } = useClerk()

  useEffect(() => {
    if (color === "dark") {
      dispatch(setTheme("dark")); 
    } else {
      dispatch(setTheme("light")); 
    }
  }, [color, dispatch]);

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  
  return (
    <SafeAreaView>
          <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})