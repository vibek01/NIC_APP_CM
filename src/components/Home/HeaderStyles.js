import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#3498db", // Primary color for the header
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: "#ffffff", // White text for better contrast
    fontSize: 20, // Slightly larger font size
    fontWeight: "bold",
    letterSpacing: 1, // Add some letter spacing
  },
  profileButton: {
    backgroundColor: "#ffffff", // White background for the button
    borderRadius: 50, // Perfectly circular
    padding: 5,
    borderWidth: 2,
    borderColor: "#2980b9", // A darker shade of the header background
  },
  profileImage: {
    width: 35, // Slightly larger image
    height: 35, // Slightly larger image
    borderRadius: 17.5, // Half of width/height
  },
});
