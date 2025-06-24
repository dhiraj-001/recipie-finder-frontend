import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setTheme } from '../redux/Slices/themeSlice';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  const color = useColorScheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (color === "dark") {
      dispatch(setTheme("dark"));
    } else {
      dispatch(setTheme("light"));
    }
  }, [color, dispatch]);



  if (isSignedIn === undefined) {
    // Fallback UI while auth state is loading
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack 
  screenOptions={{
    headerShown: false,
  }}
  />
}