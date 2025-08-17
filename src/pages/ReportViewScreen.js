// src/pages/ReportViewScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export default function ReportViewScreen({ route, navigation }) {
  const { report } = route.params;

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Report Not Found</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.infoText}>
            Could not load the report details.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format the date for display
  const submittedDate = new Date(report.submittedAt).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

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
        <Text style={styles.headerTitle}>View Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.metadataContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Submitted By</Text>
            <Text style={styles.metaValue}>{report.submitterName}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Department</Text>
            <Text style={styles.metaValue}>{report.department}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date Submitted</Text>
            <Text style={styles.metaValue}>{submittedDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text
              style={[
                styles.metaValue,
                styles.status,
                {
                  color:
                    report.status === "APPROVED"
                      ? COLORS.stat_green
                      : COLORS.stat_yellow,
                },
              ]}
            >
              {report.status}
            </Text>
          </View>
        </View>

        <View style={styles.reportContentContainer}>
          <Text style={styles.reportLabel}>Report Details</Text>
          <Text style={styles.reportText}>{report.report}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text_primary },
  scrollContent: { padding: 20 },
  metadataContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  metaLabel: { fontSize: 15, color: "#64748b", fontWeight: "600" },
  metaValue: { fontSize: 15, color: "#1e293b", fontWeight: "500" },
  status: { fontWeight: "bold" },
  reportContentContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
  },
  reportLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  reportText: { fontSize: 16, color: "#334155", lineHeight: 24 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoText: { color: COLORS.text_secondary, fontSize: 16 },
});
