// App.js
import React from "react";
import AppNavigator from "./src/Navigation/AppNavigator";
import { NotificationProvider } from "./src/context/NotificationContext";

export default function App() {
  return (
    <NotificationProvider>
      <AppNavigator />
    </NotificationProvider>
  );
}
