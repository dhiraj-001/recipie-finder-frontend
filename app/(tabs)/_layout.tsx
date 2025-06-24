import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import { THEMES } from "@/constants/colors";
import store from "../redux/store";
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { useEffect } from "react";
import { setTheme } from "../redux/Slices/themeSlice";

const TabsLayout = () => {
  const { isSignedIn } = useAuth();
  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  const color = useColorScheme()
  const dispatch = useDispatch()

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
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          tabBarActiveBackgroundColor: theme.shadow,
          tabBarActiveTintColor: theme.background,
          tabBarInactiveTintColor:theme.cardLight,
          tabBarStyle: {
            backgroundColor: theme.secBackGround,
            borderTopWidth:0,
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />
          }} />

        <Tabs.Screen
          name="Search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Ionicons name="search-sharp" size={24} color={color} />
          }} />
        <Tabs.Screen
          name="Favourites"
          options={{
            title: 'Favourites',
            tabBarIcon: ({ color, size }) => <AntDesign name="heart" size={24} color={color} />
          }} />
      </Tabs>
    </View>
  )
}

export default TabsLayout;