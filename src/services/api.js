// File: src/services/api.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use the IP address of your computer where the backend is running.
// This is for development. For production, this will be your server's domain.
const API_BASE_URL = "http://192.168.225.22:8080/api";
const AUTH_BASE_URL = "http://192.168.225.22:8080/auth";

// ========================================================================
// AUTHENTICATION
// ========================================================================

/**
 * Logs in an official user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The login response from the backend.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, {
      email,
      password,
    });
    // On success, save the userId to local storage for future API calls
    if (response.data.userId) {
      await AsyncStorage.setItem("userId", response.data.userId);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Invalid credentials.");
  }
};

/**
 * Logs out a user by clearing local storage.
 */
export const logoutUser = async () => {
  await AsyncStorage.removeItem("userId");
};

// ========================================================================
// ANONYMOUS CASE SUBMISSION (for the app's public-facing part)
// ========================================================================

/**
 * Submits a new child marriage case report anonymously.
 * @param {object} formData - The case data from the app's form.
 * @returns {Promise<object>} The newly created case object.
 */
export const submitAnonymousCase = async (formData) => {
  try {
    // This payload structure matches the CaseRequestDTO on the backend.
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
// OFFICIAL USER SERVICES (for the logged-in part of the app)
// ========================================================================

/**
 * Fetches all cases. The app will need to filter these to find the ones
 * assigned to the current user.
 * @returns {Promise<Array>} A list of all case objects.
 */
export const getAllCases = async () => {
  try {
    // This endpoint returns all cases as seen in CaseController.java
    const response = await axios.get(`${API_BASE_URL}/cases`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all cases:", error);
    throw error;
  }
};

/**
 * Fetches the complete details for a single case by its ID.
 * @param {string} caseId - The UUID of the case.
 * @returns {Promise<object>} The detailed case object.
 */
export const getCaseById = async (caseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for case ${caseId}:`, error);
    throw new Error(`Failed to fetch details for case ${caseId}.`);
  }
};

/**
 * --- NEW & ESSENTIAL ---
 * Submits an official's report for a specific case.
 * @param {object} reportData - Contains caseId, report content.
 * @returns {Promise<object>} The newly created report object.
 */
export const submitOfficialReport = async ({ caseId, report }) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) throw new Error("User session not found.");

    // To submit a report, we also need the user's department. We fetch their profile first.
    const userProfile = await getPersonProfile();

    const payload = {
      caseId: caseId,
      personId: userId,
      report: report,
      department: userProfile.department,
    };

    // This calls POST /api/reports as defined in ReportController.java
    const response = await axios.post(`${API_BASE_URL}/reports`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Report submission failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to submit report."
    );
  }
};

/**
 * --- NEW & ESSENTIAL ---
 * Fetches all reports submitted for a particular case.
 * @param {string} caseId - The UUID of the case.
 * @returns {Promise<Array>} A list of report objects for that case.
 */
export const getReportsForCase = async (caseId) => {
  try {
    // This calls GET /api/reports/case/{caseId} as defined in ReportController.java
    const response = await axios.get(`${API_BASE_URL}/reports/case/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reports for case ${caseId}:`, error);
    throw new Error(`Failed to fetch reports for case ${caseId}.`);
  }
};

/**
 * Fetches the full profile for the currently logged-in user.
 * @returns {Promise<object>} The user's person object.
 */
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

// --- NOTE ---
// The `savePushToken` function has been removed as there is no corresponding
// backend endpoint in PersonController.java. To implement push notifications,
// a new endpoint must be added to the backend first.
