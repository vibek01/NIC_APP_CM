// src/pages/TeamDetailsScreen.js
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import TeamMemberCard from "../components/common/TeamMemberCard";
import { getReportsForCaseWithSubmitterNames } from "../services/reportApi"; // Use the new, separate report API

export default function TeamDetailsScreen({ route, navigation }) {
  const { teamMembers, caseId } = route.params;

  // NEW: State for fetching and storing reports
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: Fetch reports when the screen loads, but only if there's a caseId
  useEffect(() => {
    const fetchReports = async () => {
      if (!caseId) {
        setIsLoading(false);
        return;
      }
      try {
        const fetchedReports = await getReportsForCaseWithSubmitterNames(
          caseId
        );
        setReports(fetchedReports);
      } catch (error) {
        Alert.alert("Error", "Failed to load submitted reports for this case.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [caseId]);

  // NEW: Create a map for efficient O(1) report lookup by personId
  // This is much faster than searching the array for each team member
  const reportsMap = useMemo(() => {
    return new Map(reports.map((report) => [report.personId, report]));
  }, [reports]);

  // NEW: Navigation handler that will be passed to the card component
  const handleViewReport = (report) => {
    navigation.navigate("ReportViewScreen", { report });
  };

  if (!teamMembers || teamMembers.length === 0) {
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
          <Text style={styles.headerTitle}>Assigned Team</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.infoText}>Team has not been assigned yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const supervisor = teamMembers.find((member) => member.role === "SUPERVISOR");
  const members = teamMembers.filter((member) => member.role !== "SUPERVISOR");

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
        <Text style={styles.headerTitle}>Assigned Team</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* NEW: Show a loading indicator while fetching reports */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.infoText}>Loading Reports...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {supervisor && (
            <>
              <Text style={styles.sectionTitle}>Supervisor</Text>
              <TeamMemberCard
                member={supervisor}
                index={0}
                // NEW: Pass the report and the handler to the card
                report={reportsMap.get(supervisor.id)}
                onViewReport={handleViewReport}
              />
            </>
          )}

          {members.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Department Members</Text>
              {members.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index + 1}
                  // NEW: Pass the report and the handler to the card
                  report={reportsMap.get(member.id)}
                  onViewReport={handleViewReport}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}
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
  scrollContent: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
    paddingLeft: 4,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoText: { color: COLORS.text_secondary, fontSize: 16, marginTop: 10 },
});
