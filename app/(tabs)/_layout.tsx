import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from "react-redux";
import { THEMES } from "@/constants/colors";
import store from "../redux/store";
import { View } from 'react-native';

const TabsLayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];
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
            borderRadius:20,
            marginBottom:15,
            marginHorizontal:15,
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