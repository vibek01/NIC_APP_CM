// src/pages/SignupScreen.js
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
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signupUser } from "../services/api";
import { COLORS } from "../constants/colors";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !gender
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // ✅ Construct the complete DTO for the backend
      const userData = {
        // --- Fields from the form ---
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        gender,

        // --- Hardcoded default values for a PUBLIC user ---
        role: "PUBLIC", // The user's role is always PUBLIC on signup.
        department: "ADMINISTRATION", // A valid default from your Department enum.
        designation: "N/A", // Public users do not have a designation.
        postName: "N/A", // Public users do not have a post name.
        rank: 0, // A safe default for a non-existent rank.
        district: "N/A",
        officeName: "N/A",
        status: "ACTIVE",
        subdivision: "N/A",
      };

      await signupUser(userData);

      Alert.alert("Success", "Registration successful! You can now log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during signup.");
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
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join the community to report incidents
              </Text>
            </View>

            <View style={styles.form}>
              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>

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
                  name="phone-outline"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Gender"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={gender}
                  onChangeText={setGender}
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
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.backToLoginButtonText}>
                  Already have an account? Log In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: { alignItems: "center", marginBottom: 30 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: COLORS.white, fontSize: 16 },
  signupButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signupButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  backToLoginButton: { marginTop: 20 },
  backToLoginButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontSize: 14,
  },
  errorText: {
    color: "rgba(255, 150, 150, 1)",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "bold",
  },
});
