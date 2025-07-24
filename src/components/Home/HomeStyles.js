import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // A modern, light grey background
    paddingTop: 40,
    justifyContent: "space-between",
  },
  boxWrapper: {
    paddingHorizontal: 20, // Increased horizontal padding
    marginTop: 25, // Increased top margin
    flex: 1,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Use space-around for better spacing
    marginBottom: 25, // Increased bottom margin
  },
});
