// src/pages/Profile.js
import React, { useState, useCallback } from "react";
import {
  View,
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
import { getPersonProfile, logoutUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.styles";

export default function Profile({ navigation }) {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      await logoutUser();
    } catch (apiError) {
      console.error("Failed to clear push token on backend:", apiError);
    } finally {
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
