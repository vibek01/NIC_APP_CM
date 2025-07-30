// src/components/Home/DashboardBoxStyles.js
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  box: {
    width: width / 2 - 30,
    height: 150,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  // ✅ New styles for the badge
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.alert_text,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
});
