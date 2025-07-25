// src/pages/HomeStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text_primary,
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  // --- Stats List Styles ---
  statsListContainer: {
    paddingHorizontal: 20,
  },
  statCard: {
    width: 150,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
    padding: 15,
    justifyContent: "space-between",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  // --- Alert Styles ---
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.alert_bg,
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.alert_border,
  },
  alertText: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.alert_text,
    fontSize: 14,
    fontWeight: "500",
  },
  // --- Dashboard Grid Styles ---
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  boxWrapper: {
    marginVertical: 10,
  },
});
