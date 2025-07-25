import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../pages/Home";
import ActiveCases from "../pages/ActiveCases";
import Profile from "../pages/Profile";
import LoginScreen from "../pages/Login"; // ✅ New import
import AuthLoadingScreen from "../pages/AuthLoadingScreen"; // ✅ New import

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // ✅ Start with the loading screen
        initialRouteName="AuthLoading"
        screenOptions={{ headerShown: false }}
      >
        {/* These screens are part of the auth flow */}
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* These screens are part of the main app */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ActiveCases" component={ActiveCases} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
