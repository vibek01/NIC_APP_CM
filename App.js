// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/Navigation/AppNavigator";
import { NotificationProvider } from "./src/context/NotificationContext";
import { AuthProvider } from "./src/context/AuthContext"; // Import the new AuthProvider
import { navigationRef } from "./src/Navigation/RootNavigation";

export default function App() {
  return (
    // AuthProvider now wraps everything to manage login state.
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <NotificationProvider>
          {/* AppNavigator will now read from AuthContext to decide which screens to show */}
          <AppNavigator />
        </NotificationProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}
