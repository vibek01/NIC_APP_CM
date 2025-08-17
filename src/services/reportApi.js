// src/services/reportApi.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPersonProfile } from "./api"; // We'll need this to get submitter names

// Use the same IP address as your main api.js file
const API_BASE_URL = "http://192.168.0.222:8080/api";
const apiClient = axios.create({ baseURL: API_BASE_URL });

export const getReportsForCaseWithSubmitterNames = async (caseId) => {
  try {
    const response = await apiClient.get(`/reports/case/${caseId}`);
    const reports = response.data;

    // To avoid fetching the same person's details multiple times, we create a map
    const personCache = new Map();

    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        let submitterName = "Unknown User";
        if (personCache.has(report.personId)) {
          submitterName = personCache.get(report.personId);
        } else {
          try {
            const personResponse = await apiClient.get(
              `/persons/${report.personId}`
            );
            const person = personResponse.data;
            submitterName = `${person.firstName} ${person.lastName}`;
            personCache.set(report.personId, submitterName);
          } catch (e) {
            console.error(
              `Failed to fetch details for person ${report.personId}`
            );
          }
        }
        return { ...report, submitterName };
      })
    );
    return enrichedReports;
  } catch (error) {
    console.error(`Error fetching reports for case ${caseId}:`, error);
    throw new Error(`Failed to fetch reports for case ${caseId}.`);
  }
};

export const submitOfficialReport = async ({ caseId, report }) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) throw new Error("User session not found.");

    const userProfile = await getPersonProfile(); // Assumes getPersonProfile is in the main api.js

    const payload = {
      caseId: caseId,
      personId: userId,
      report: report,
      department: userProfile.department,
    };

    const response = await apiClient.post(`/reports`, payload);
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
