// src/pages/AuthLoadingScreen.js
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/colors";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        // If a userId exists, the user is considered logged in.
        // Navigate them to the main part of the app.
        if (userId) {
          navigation.replace("Home");
        } else {
          // If no userId, navigate them to the public-facing part of the app.
          navigation.replace("Welcome");
        }
      } catch (e) {
        // In case of any error, default to the Welcome screen.
        console.error("Failed to read auth status from storage", e);
        navigation.replace("Welcome");
      }
    };

    checkAuthStatus();
  }, [navigation]);

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
    backgroundColor: "#fff",
  },
});

export default AuthLoadingScreen;
