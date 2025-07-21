import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function DashboardBox({ title }) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (title === "ACTIVE CASES") {
      navigation.navigate("ActiveCases");
    }

    // Add more cases for other titles if needed
  };

  return (
    <TouchableOpacity style={styles.box} onPress={handlePress}>
      <Text style={styles.boxText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "47%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
