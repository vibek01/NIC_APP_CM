// src/pages/AuthLoadingScreen.js
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkOfficialUser = async () => {
      try {
        // Only checks for an official's session
        const userRole = await AsyncStorage.getItem("userRole");
        if (userRole && userRole !== "PUBLIC") {
          navigation.replace("Home"); // Official is logged in, go to their dashboard
        } else {
          // No official session found, go back to the main Welcome screen
          navigation.replace("Welcome");
        }
      } catch (e) {
        navigation.replace("Welcome"); // Default to Welcome screen on any error
      }
    };

    checkOfficialUser();
  }, [navigation]);

  return (
    <LinearGradient
      colors={[COLORS.gradient_start, COLORS.gradient_end]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ActivityIndicator size="large" color={COLORS.white} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
