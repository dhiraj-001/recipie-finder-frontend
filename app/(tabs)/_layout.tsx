import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
const TabsLayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift'
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
  )
}

export default TabsLayout;