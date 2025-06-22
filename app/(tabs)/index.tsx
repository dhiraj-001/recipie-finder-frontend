import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { setTheme } from '../redux/Slices/themeSlice';
import { useDispatch } from 'react-redux';


const index = () => {
  const color = useColorScheme()
  const dispatch = useDispatch()
  useEffect(() => {
    if (color === "dark") {
      dispatch(setTheme("dark")); // or your dark theme key
    } else {
      dispatch(setTheme("light")); // or your light theme key
    }
  }, [color, dispatch]);
  
  return (
    <SafeAreaView>
      <Text>index</Text>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})