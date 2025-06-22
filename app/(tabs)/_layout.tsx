import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const TabsLayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />
 
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',

      }} />
    </Tabs>
  )
}

export default TabsLayout;