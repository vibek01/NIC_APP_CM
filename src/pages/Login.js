// src/pages/Login.js
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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginUser } from "../services/api"; // This is for the API call
import { useAuth } from "../context/AuthContext"; // ✅ Import the useAuth hook
import { COLORS } from "../constants/colors";
import { registerForPushNotificationsAsync } from "../services/notificationService";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth(); // ✅ Get the login function from our context
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
      // Step 1: Call the backend API
      const data = await loginUser(email, password);

      if (data && data.userId) {
        // Step 2: Register for push notifications
        await registerForPushNotificationsAsync();

        // Step 3: Tell the AuthContext that we are logged in.
        // This updates the global state and automatically switches the navigator.
        login(data.userId);
      } else {
        setError(data.message || "Invalid credentials.");
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
