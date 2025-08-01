// src/pages/FileCaseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "../constants/colors";
import { submitCaseReport } from "../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// A reusable input component for this form
const FormInput = ({ label, value, onChangeText, placeholder, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#a9a9a9"
      {...props}
    />
  </View>
);

export default function FileCaseScreen({ navigation }) {
  // State for all form fields
  const [complainantPhone, setComplainantPhone] = useState("");

  const [girlName, setGirlName] = useState("");
  const [girlFatherName, setGirlFatherName] = useState("");
  const [girlAddress, setGirlAddress] = useState("");
  const [girlSubdivision, setGirlSubdivision] = useState("");

  const [boyName, setBoyName] = useState("");
  const [boyFatherName, setBoyFatherName] = useState("");
  const [boyAddress, setBoyAddress] = useState(""); // ✅ New state
  const [boySubdivision, setBoySubdivision] = useState(""); // ✅ New state

  const [marriageDate, setMarriageDate] = useState("");
  const [marriageAddress, setMarriageAddress] = useState("");
  const [marriageLandmark, setMarriageLandmark] = useState("");
  const [policeStation, setPoliceStation] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !complainantPhone ||
      !girlName ||
      !girlAddress ||
      !girlSubdivision ||
      !marriageDate
    ) {
      Alert.alert(
        "Missing Information",
        "Please provide your phone number and all required case details marked with *."
      );
      return;
    }

    setLoading(true);
    const formData = {
      complainantPhone,
      girlName,
      girlFatherName,
      girlAddress,
      girlSubdivision,
      boyName,
      boyFatherName,
      boyAddress,
      boySubdivision, // ✅ Pass new data
      marriageDate,
      marriageAddress,
      marriageLandmark,
      policeStation,
    };

    try {
      await submitCaseReport(formData);
      Alert.alert(
        "Report Submitted Successfully",
        "Thank you for your report. It has been sent confidentially.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        error.message || "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.title}>Anonymous Report</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Your identity is kept confidential. Your phone number is required
            for verification purposes only.
          </Text>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Your Contact (Required)</Text>
            <FormInput
              label="Your Phone Number *"
              value={complainantPhone}
              onChangeText={setComplainantPhone}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Girl's Details (Required)</Text>
            <FormInput
              label="Full Name *"
              value={girlName}
              onChangeText={setGirlName}
            />
            <FormInput
              label="Father's Name"
              value={girlFatherName}
              onChangeText={setGirlFatherName}
            />
            <FormInput
              label="Address / Village *"
              value={girlAddress}
              onChangeText={setGirlAddress}
            />
            <FormInput
              label="Subdivision *"
              value={girlSubdivision}
              onChangeText={setGirlSubdivision}
              placeholder="e.g., Agartala Subdivision"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Boy's Details (Optional)</Text>
            <FormInput
              label="Full Name"
              value={boyName}
              onChangeText={setBoyName}
            />
            <FormInput
              label="Father's Name"
              value={boyFatherName}
              onChangeText={setBoyFatherName}
            />
            {/* ✅ New input fields */}
            <FormInput
              label="Address / Village"
              value={boyAddress}
              onChangeText={setBoyAddress}
            />
            <FormInput
              label="Subdivision"
              value={boySubdivision}
              onChangeText={setBoySubdivision}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Incident Details (Required)</Text>
            <FormInput
              label="Suspected Marriage Date *"
              value={marriageDate}
              onChangeText={setMarriageDate}
              placeholder="YYYY-MM-DD"
            />
            <FormInput
              label="Marriage Location Address *"
              value={marriageAddress}
              onChangeText={setMarriageAddress}
            />
            <FormInput
              label="Landmark near Marriage Location"
              value={marriageLandmark}
              onChangeText={setMarriageLandmark}
            />
            <FormInput
              label="Nearest Police Station"
              value={policeStation}
              onChangeText={setPoliceStation}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit Confidential Report
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f7" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  backButton: { marginRight: 15, padding: 5 },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text_primary },
  content: { padding: 20, paddingBottom: 50 },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 25,
    textAlign: "center",
  },
  formSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#ccc",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 15,
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#1F2937", marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  submitButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
});
