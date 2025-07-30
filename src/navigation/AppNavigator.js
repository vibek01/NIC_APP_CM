// src/Navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Auth Pages
import AuthLoadingScreen from "../pages/AuthLoadingScreen";
import LoginScreen from "../pages/Login";
import SignupScreen from "../pages/SignupScreen";

// Official User Pages
import Home from "../pages/Home";
import ActiveCases from "../pages/ActiveCases";
import Profile from "../pages/Profile";
import NotificationsScreen from "../pages/NotificationsScreen"; // ✅ New

// Public User Pages
import UserDashboardScreen from "../pages/UserDashboardScreen";
import FileCaseScreen from "../pages/FileCaseScreen";
import MyCasesScreen from "../pages/MyCasesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Flow Screens */}
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* --- Official User Stack --- */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ActiveCases" component={ActiveCases} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        {/* --- Public User Stack --- */}
        <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
        <Stack.Screen name="FileCase" component={FileCaseScreen} />
        <Stack.Screen name="MyCases" component={MyCasesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
