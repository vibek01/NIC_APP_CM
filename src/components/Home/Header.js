import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>CHILD MARRIAGE APP</Text>
      <TouchableOpacity style={styles.profileButton}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#3498db",
    borderRadius: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
