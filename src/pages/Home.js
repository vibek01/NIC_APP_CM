// src/pages/Home.js
import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Home/Header";
import DashboardBox from "../components/Home/DashboardBox";
import Footer from "../components/Home/Footer";
import { styles } from "../components/Home/HomeStyles";
import { COLORS } from "../constants/colors";
// --- UPDATED: Import new functions ---
import {
  getPendingResponses,
  getPersonProfile,
  getCaseStats,
} from "../services/api";
import { registerForPushNotificationsAsync } from "../services/notificationService";

const DASHBOARD_ITEMS = [
  {
    title: "ACTIVE CASES",
    iconName: "file-document-outline",
    screen: "ActiveCases",
  },
  { title: "NOTIFICATIONS", iconName: "bell-outline", screen: "Notifications" },
  { title: "REPORTS & ANALYTICS", iconName: "chart-line" },
  { title: "USER MANAGEMENT", iconName: "account-group-outline" },
  { title: "ARCHIVED CASES", iconName: "archive-outline" },
  { title: "SETTINGS", iconName: "cog-outline" },
];

const StatCard = ({ item }) => (
  <View style={[styles.statCard, { backgroundColor: item.color }]}>
    <Text style={styles.statValue}>{item.value}</Text>
    <Text style={styles.statLabel}>{item.label}</Text>
  </View>
);

export default function Home({ navigation }) {
  const [notificationCount, setNotificationCount] = useState(0);
  // --- NEW: State for storing case statistics ---
  const [caseStats, setCaseStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const userId = await AsyncStorage.getItem("userId");
          if (!userId) {
            // If no user, maybe navigate to login or show limited view
            setIsLoading(false);
            return;
          }

          // Fetch notifications and stats in parallel for better performance
          const [pendingResponses, userProfile] = await Promise.all([
            getPendingResponses(),
            getPersonProfile(),
          ]);

          // Process notification count
          const myPendingCount = pendingResponses.filter(
            (p) => p.personId === userId
          ).length;
          setNotificationCount(myPendingCount);

          // Fetch case stats using the user's department
          const stats = await getCaseStats(userProfile.department);
          setCaseStats(stats);
        } catch (err) {
          console.error("Failed to fetch dashboard data", err);
          setError("Could not load data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDashboardData();
    }, [])
  );

  // --- NEW: Memoized transformation of fetched stats into the format for the list ---
  const formattedStatsData = useMemo(() => {
    if (!caseStats) return [];
    return [
      {
        id: "1",
        label: "Total Cases",
        value: caseStats.TOTAL ?? 0,
        color: COLORS.stat_blue,
      },
      {
        id: "2",
        label: "Resolved Cases",
        value: caseStats.RESOLVED ?? 0,
        color: COLORS.stat_green,
      },
      {
        id: "3",
        label: "Pending Cases",
        value: caseStats.PENDING ?? 0,
        color: COLORS.stat_yellow,
      },
      {
        id: "4",
        label: "Active Cases",
        value: caseStats.IN_PROGRESS ?? 0,
        color: COLORS.alert_text,
      },
    ];
  }, [caseStats]);

  // --- NEW: Component to render the stats section based on loading/error state ---
  const renderStatsSection = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginVertical: 40 }}
        />
      );
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    return (
      <FlatList
        horizontal
        data={formattedStatsData}
        renderItem={({ item }) => <StatCard item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsListContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header userName="Official" />

      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Department Overview</Text>
        {renderStatsSection()}

        <View style={styles.alertContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={24}
            color={COLORS.alert_text}
          />
          <Text style={styles.alertText}>
            {`${
              caseStats?.PENDING ?? 0
            } new cases require your department's review.`}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.dashboardGrid}>
          {DASHBOARD_ITEMS.map((item, index) => (
            <View key={item.title} style={styles.boxWrapper}>
              <DashboardBox
                index={index}
                title={item.title}
                iconName={item.iconName}
                count={item.title === "NOTIFICATIONS" ? notificationCount : 0}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
