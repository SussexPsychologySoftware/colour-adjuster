import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {View} from "react-native";
import {useRestore} from "@/hooks/useRestore";
import {KeyboardProvider} from "react-native-keyboard-controller";

export default function RootLayout() {
    useRestore() // go to testing page if finished

    return (
        <KeyboardProvider>
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
                  <Stack.Screen name="debrief"/>
                  <Stack.Screen name="testing"/>
              </Stack>
        </View>
    </KeyboardProvider>
  )
}
