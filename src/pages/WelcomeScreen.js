// src/pages/WelcomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.gradient_start, COLORS.gradient_end]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Child Marriage Reporting</Text>
          <Text style={styles.subtitle}>
            Your confidential report can make a difference.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("FileCase")}
          >
            <Text style={styles.primaryButtonText}>Report an Incident</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.secondaryButtonText}>Official Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gradient_end },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
  },
  header: { alignItems: "center", flex: 1, justifyContent: "center" },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: { width: "100%", paddingBottom: 20 },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  secondaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "500" },
});
