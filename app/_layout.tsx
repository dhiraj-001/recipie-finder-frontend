import { Slot } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Slot />
        </SafeAreaView>
      </Provider>
    </ClerkProvider>
  );
}
