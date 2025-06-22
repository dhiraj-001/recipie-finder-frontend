import { Button, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { switchTheme } from '../redux/Slices/themeSlice';
import store from '../redux/store';
import { THEMES } from '@/constants/colors';
const signIn = () => {
  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];
  const dispatch = useDispatch();
  return (
    <KeyboardAvoidingView behavior='padding'>
      <Text style={{ color: theme.text }}>sign-in</Text>
      <Button title='switch theme' onPress={() => {
        dispatch(switchTheme())}} />
    </KeyboardAvoidingView>
  )
}

export default signIn

const styles = StyleSheet.create({})