// src/pages/AuthLoadingScreen.js
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkUser = async () => {
      try {
        // ✅ Check for all required session items at once for robustness
        const userData = await AsyncStorage.multiGet([
          "userId",
          "userRole",
          "userPhone",
        ]);
        const sessionData = Object.fromEntries(userData);

        if (
          sessionData.userId &&
          sessionData.userRole &&
          sessionData.userPhone
        ) {
          if (sessionData.userRole === "PUBLIC") {
            navigation.replace("UserDashboard");
          } else {
            navigation.replace("Home");
          }
        } else {
          // If any piece of data is missing, force a new login
          navigation.replace("Login");
        }
      } catch (e) {
        // If storage fails, default to login
        navigation.replace("Login");
      }
    };

    checkUser();
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
