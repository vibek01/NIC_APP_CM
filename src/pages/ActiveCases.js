// File: src/pages/ActiveCases.js
import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import CaseCard from "../components/ActiveCases/CaseCard";
// --- FIX 1: Import the correctly named function ---
import { getAllCases } from "../services/api";
import { COLORS } from "../constants/colors";

export default function ActiveCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useFocusEffect will re-run the fetch logic every time the screen is viewed
  useFocusEffect(
    useCallback(() => {
      const fetchCases = async () => {
        setLoading(true);
        setError(null);
        try {
          // --- FIX 2: Add essential filtering logic ---
          const userId = await AsyncStorage.getItem("userId");
          if (!userId) {
            throw new Error("User session not found.");
          }

          const allCases = await getAllCases();

          // Filter to find cases assigned to the current user
          const myCases = allCases.filter((c) => {
            if (!c.caseDetails?.[0]?.departmentMembers) {
              return false;
            }
            if (c.caseDetails[0].supervisorId === userId) {
              return true;
            }
            return Object.values(c.caseDetails[0].departmentMembers)
              .flat()
              .includes(userId);
          });

          // Filter for only active cases
          const activeCases = myCases.filter(
            (c) => c.status === "IN_PROGRESS" || c.status === "PENDING"
          );

          setCases(activeCases);
        } catch (e) {
          setError("Failed to fetch cases. Please try again later.");
          console.error("Error fetching cases:", e);
        } finally {
          setLoading(false);
        }
      };

      fetchCases();
    }, [])
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Active Cases...</Text>
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

    if (cases.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.infoText}>
            You have no active cases assigned.
          </Text>
        </View>
      );
    }

    return cases.map((item) => <CaseCard key={item.id} data={item} />);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header userName="Official" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {renderContent()}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // A softer background color
    paddingTop: 40,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  errorText: {
    color: COLORS.alert_text,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
  },
  infoText: {
    color: COLORS.text_secondary,
  },
});
