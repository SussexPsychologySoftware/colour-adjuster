import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {View} from "react-native";

export default function RootLayout() {
  return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
          <StatusBar hidden translucent/>
          <Stack screenOptions={{
            // Just incase
            headerShown: false,
            headerStyle: { backgroundColor: 'black' },
            headerTintColor: 'black',
            contentStyle: { backgroundColor: 'black' }
          }}>
              <Stack.Screen name="index"/>
              <Stack.Screen name="consent"/>
              <Stack.Screen name="confirmSettings"/>
              <Stack.Screen name="adjust"/>
              <Stack.Screen name="survey"/>
          </Stack>
    </View>
  )
}
