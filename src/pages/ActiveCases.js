import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import CaseCard from "../components/ActiveCases/CaseCard";
import { getActiveCases } from "../services/api";

export default function ActiveCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getActiveCases();
        setCases(data);
        setLoading(false);
      } catch (e) {
        setError("Failed to fetch cases. Please try again later.");
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          cases.map((item) => <CaseCard key={item.id} data={item} />)
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
  },
  scroll: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
