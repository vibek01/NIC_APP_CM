// File: src/pages/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import both loginUser and getPersonProfile from your API service
import { loginUser, getPersonProfile } from "../services/api";
import { COLORS } from "../constants/colors";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Step 1: Call the login endpoint
      const loginResponse = await loginUser(email, password);

      // Step 2: Check if the login was successful and we got a userId
      if (loginResponse.userId) {
        // Step 3: Use the userId to fetch the full user profile
        // The getPersonProfile function already uses the stored userId,
        // but we can call it directly here for immediate data.
        const userProfile = await getPersonProfile();

        // Step 4: Check if we got a valid profile with a role
        if (userProfile && userProfile.role) {
          // Store all necessary data in AsyncStorage
          await AsyncStorage.setItem("userId", userProfile.id);
          await AsyncStorage.setItem("userRole", userProfile.role);
          await AsyncStorage.setItem("userPhone", userProfile.phoneNumber);

          // On success, navigate to the Home dashboard
          navigation.replace("Home");
        } else {
          // This would happen if the user exists but has no role assigned
          setError(
            "User profile is incomplete. Please contact an administrator."
          );
        }
      } else {
        // This happens if the initial login fails (invalid credentials)
        setError(loginResponse.message || "Invalid email or password.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradient_start, COLORS.gradient_end]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Official Login</Text>
            <Text style={styles.subtitle}>Enter your provided credentials</Text>
          </View>

          <View style={styles.form}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color="rgba(255, 255, 255, 0.7)"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color="rgba(255, 255, 255, 0.7)"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <MaterialCommunityIcons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to Welcome Screen</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "rgba(255, 255, 255, 0.8)" },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: COLORS.white, fontSize: 16 },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loginButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  errorText: {
    color: "rgba(255, 150, 150, 1)",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "bold",
  },
  backButton: { marginTop: 20 },
  backButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontSize: 14,
  },
});
