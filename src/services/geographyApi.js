// src/services/geographyApi.js

import axios from "axios";

// NOTE: Use the same IP Address as your main api.js file.
// This must be the local IP of the computer running your backend server.
const API_BASE_URL = "http://192.168.0.222:8080/api";

const apiClient = axios.create({ baseURL: API_BASE_URL });

/**
 * Fetches the list of all districts from the backend.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of District objects.
 */
export const getDistricts = async () => {
  try {
    const response = await apiClient.get("/geography/districts");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch districts:", error);
    throw new Error(
      "Could not load districts. Please check your network connection."
    );
  }
};

/**
 * Fetches the list of subdivisions for a specific district by its name.
 * @param {string} districtName The name of the parent district.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of Subdivision objects.
 */
export const getSubdivisionsByDistrict = async (districtName) => {
  try {
    // If no district is selected, don't attempt to fetch.
    if (!districtName) {
      return [];
    }
    const response = await apiClient.get(
      `/geography/districts/${districtName}/subdivisions`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch subdivisions for ${districtName}:`, error);
    throw new Error("Could not load subdivisions.");
  }
};
