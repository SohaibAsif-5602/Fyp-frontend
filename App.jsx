import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screen/LoginScreen";
import SignupScreen from "./src/screen/SignupScreen";
import Analytics from "./src/screen/analytics";
import Profile from "./src/screen/profile";
import Ponds from "./src/screen/Ponds";
import Settings from "./src/screen/settings";


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup"
        screenOptions={{
          headerShown: false
        }}
      >
        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Analytics" component={Analytics} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Ponds" component={Ponds} />
        <Stack.Screen name="Settings" component={Settings} />




      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});