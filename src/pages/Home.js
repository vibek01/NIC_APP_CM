// src/pages/Home.js
import React, { useState, useCallback, useEffect } from "react"; // ✅ FIXED: Added useEffect here
import { View, ScrollView, StatusBar, Text, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Home/Header";
import DashboardBox from "../components/Home/DashboardBox";
import Footer from "../components/Home/Footer";
import { styles } from "../components/Home/HomeStyles";
import { COLORS } from "../constants/colors";
import { getPendingResponses } from "../services/api";
import { registerForPushNotificationsAsync } from "../services/notificationService";

const STATS_DATA = [
  { id: "1", label: "Total Cases", value: "4", color: COLORS.stat_blue },
  {
    id: "2",
    label: "Resolved This Month",
    value: "2",
    color: COLORS.stat_green,
  },
  { id: "3", label: "Pending Review", value: "1", color: COLORS.stat_yellow },
  { id: "4", label: "High Priority", value: "2", color: COLORS.alert_text },
];

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

  // This effect runs once when the Home screen is mounted for the first time
  useEffect(() => {
    // Register for push notifications and save the token to the backend
    registerForPushNotificationsAsync();
  }, []);

  // This effect runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchNotificationCount = async () => {
        try {
          const userId = await AsyncStorage.getItem("userId");
          if (!userId) return;
          const allPending = await getPendingResponses();
          const myPendingCount = allPending.filter(
            (p) => p.personId === userId
          ).length;
          setNotificationCount(myPendingCount);
        } catch (error) {
          console.error("Failed to fetch notification count", error);
          setNotificationCount(0);
        }
      };
      fetchNotificationCount();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header userName="Official" />

      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Monthly Overview</Text>
        <FlatList
          horizontal
          data={STATS_DATA}
          renderItem={({ item }) => <StatCard item={item} />}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsListContainer}
        />

        <View style={styles.alertContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={24}
            color={COLORS.alert_text}
          />
          <Text style={styles.alertText}>
            3 new high-priority cases require your immediate attention.
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
