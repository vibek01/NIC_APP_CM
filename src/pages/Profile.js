// src/pages/Profile.js
import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Home/Header";
import ProfileCard from "../components/Profile/ProfileCard";
import Footer from "../components/Home/Footer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

// ✅ The navigation prop is passed by React Navigation automatically
export default function Profile({ navigation }) {
  // ✅ Function to handle the logout process
  const handleLogout = async () => {
    // Remove the user's ID from storage
    await AsyncStorage.removeItem("userId");

    // Navigate back to the login screen and reset the navigation stack
    // 'replace' ensures the user can't press the back button to get back into the profile
    navigation.replace("Login");
  };

  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: handleLogout, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>User Profile</Text>
        <ProfileCard
          name="Vibek Prasad Bin"
          designation="District Officer"
          post="Child Welfare Head"
          contact="+91-9876543210"
        />

        {/* ✅ Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <MaterialCommunityIcons
            name="logout"
            size={22}
            color={COLORS.white}
          />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  // ✅ New styles for the logout button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.alert_text,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
    width: "100%",
    elevation: 3,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
