// src/pages/Profile.js
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Home/Header";
import ProfileCard from "../components/Profile/ProfileCard";
import Footer from "../components/Home/Footer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { getPersonProfile } from "../services/api"; // Import the new service function

export default function Profile({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useFocusEffect ensures data is re-fetched every time the screen is viewed
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getPersonProfile();
          setProfile(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    // Clear all potential session keys for a clean logout
    await AsyncStorage.multiRemove(["userId", "userRole", "userPhone"]);

    // Navigate back to the Welcome screen, the new root of the app
    navigation.replace("Welcome");
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    if (profile) {
      return (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Official's Profile</Text>
          <ProfileCard
            name={`${profile.firstName} ${profile.lastName}`}
            designation={profile.designation}
            post={profile.postName}
            contact={profile.phoneNumber}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={22}
              color={COLORS.white}
            />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
    return null; // Return null if there's no data and no error
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pass the fetched name to the Header component for a dynamic greeting */}
      <Header userName={profile ? profile.firstName : "Official"} />
      {renderContent()}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text_primary,
  },
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
  // New styles for loading/error states
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: COLORS.alert_text,
    fontSize: 16,
    textAlign: "center",
  },
});
