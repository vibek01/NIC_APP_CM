// src/pages/AuthLoadingScreen.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

// ✅ FIX: This component is now purely for display. It has no useEffect and
// does not receive or use the 'navigation' prop, which prevents the crash.
const AuthLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Or your app's background color
  },
});

export default AuthLoadingScreen;
