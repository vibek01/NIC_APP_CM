// src/pages/MyCasesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/colors";
import MyCaseCard from "../components/User/MyCaseCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { getMyCases } from '../services/api';

export default function MyCasesScreen({ navigation }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        // Using mock data for now. Replace with:
        // const myCases = await getMyCases();
        const mockCases = [
          {
            id: "1",
            description: "Report concerning a girl in West Tripura.",
            reportedAt: "2025-07-26",
            status: "PENDING",
          },
          {
            id: "2",
            description: "Urgent report from Kamalpur subdivision.",
            reportedAt: "2025-07-20",
            status: "INVESTIGATING",
          },
          {
            id: "3",
            description: "Information about a planned ceremony.",
            reportedAt: "2025-07-15",
            status: "ACTION_TAKEN",
          },
        ];
        setCases(mockCases);
      } catch (e) {
        setError("Could not fetch your case history.");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

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
    return (
      <FlatList
        data={cases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MyCaseCard data={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              You have not submitted any cases yet.
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.text_primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>My Submitted Cases</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  backButton: { marginRight: 15, padding: 5 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text_primary },
  list: { paddingHorizontal: 20, paddingTop: 20 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { fontSize: 16, color: COLORS.alert_text, textAlign: "center" },
  emptyText: {
    fontSize: 16,
    color: COLORS.text_secondary,
    textAlign: "center",
  },
});
