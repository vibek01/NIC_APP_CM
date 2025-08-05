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
import Header from "../components/Home/Header";
import ProfileCard from "../components/Profile/ProfileCard";
import Footer from "../components/Home/Footer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { getPersonProfile, logoutUser } from "../services/api"; // ✅ 1. Import logoutUser API function
import { useAuth } from "../context/AuthContext"; // ✅ 2. Import the useAuth hook

export default function Profile({ navigation }) {
  const { logout } = useAuth(); // ✅ 3. Get the logout function from our context
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
    try {
      // ✅ 4. Call the backend API to clear the push token.
      // This is a "fire-and-forget" call; we don't need to wait for its response
      // to log the user out on the device.
      await logoutUser();
    } catch (apiError) {
      // We log the error but proceed with logout anyway, as the user's
      // intent is to log out from the device regardless of server status.
      console.error("Failed to clear push token on backend:", apiError);
    } finally {
      // ✅ 5. Call the logout function from the context.
      // This will clear AsyncStorage and update the app's state,
      // which will automatically switch the navigator to the public screens.
      logout();
    }
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
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header userName={profile ? profile.firstName : "Official"} />
      {renderContent()}
      <Footer />
    </SafeAreaView>
  );
}

// Styles are unchanged and remain the same.
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
