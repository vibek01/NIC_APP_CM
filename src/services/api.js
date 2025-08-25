// File: src/services/api.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "./networkConfig";

// Use the IP address of your computer where the backend is running.
const API_BASE_URL = `http://${IP_ADDRESS}:8080/api`;
const AUTH_BASE_URL = `http://${IP_ADDRESS}:8080/auth`;

// ============================== ==========================================
// AUTHENTICATION
// ========================================================================

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, {
      email,
      password,
    });
    if (response.data.userId) {
      await AsyncStorage.setItem("userId", response.data.userId);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Invalid credentials.");
  }
};

export const logoutUser = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      console.log(`Sending logout request to backend for user: ${userId}`);
      await axios.post(`${API_BASE_URL}/persons/${userId}/logout`);
      console.log("Backend acknowledged logout, push token cleared.");
    }
  } catch (error) {
    console.error(
      "Failed to clear push token on backend:",
      error.response?.data || error.message
    );
  }
};

export const registerPushToken = async (pushToken) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      console.log("No user session found, skipping push token registration.");
      return;
    }
    const payload = { pushToken };
    await axios.post(
      `${API_BASE_URL}/persons/${userId}/register-push-token`,
      payload
    );
    console.log("Push token registered with backend successfully.");
  } catch (error) {
    console.error(
      "Failed to register push token:",
      error.response?.data || error.message
    );
  }
};

// ========================================================================
// ANONYMOUS CASE SUBMISSION
// ========================================================================

export const submitAnonymousCase = async (formData) => {
  try {
    const payload = {
      complainantPhone: formData.complainantPhone,
      reportedAt: new Date().toISOString(),
      status: "PENDING",
      caseDetails: {
        marriageDate: new Date(formData.marriageDate).toISOString(),
        boyName: formData.boyName,
        boyFatherName: formData.boyFatherName,
        boyAddress: formData.boyAddress,
        boySubdivision: formData.boySubdivision,
        girlName: formData.girlName,
        girlFatherName: formData.girlFatherName,
        girlAddress: formData.girlAddress,
        girlSubdivision: formData.girlSubdivision,
        marriageAddress: formData.marriageAddress,
        marriageLandmark: formData.marriageLandmark,
        policeStationNearMarriageLocation: formData.policeStation,
      },
    };
    const response = await axios.post(`${API_BASE_URL}/cases`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Case submission failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to submit the report."
    );
  }
};

// ========================================================================
// OFFICIAL USER SERVICES
// ========================================================================

export const getCaseStats = async (department) => {
  try {
    if (!department)
      return { TOTAL: 0, RESOLVED: 0, PENDING: 0, IN_PROGRESS: 0 };
    const response = await axios.get(
      `${API_BASE_URL}/cases/department/${department}/stats`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching case stats:", error);
    throw new Error("Could not load dashboard statistics.");
  }
};

export const getAllCases = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all cases:", error);
    throw error;
  }
};

export const getCaseById = async (caseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for case ${caseId}:`, error);
    throw new Error(`Failed to fetch details for case ${caseId}.`);
  }
};

export const getPersonProfile = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("User session not found. Please log in again.");
    }
    const response = await axios.get(`${API_BASE_URL}/persons/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data.message || "Failed to fetch profile data."
    );
  }
};

export const getPendingResponses = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/team-formations/responses/pending`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pending responses:", error);
    return [];
  }
};
