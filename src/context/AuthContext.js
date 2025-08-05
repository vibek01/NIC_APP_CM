// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  // We use this isLoading state to show the AuthLoadingScreen
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once when the app starts to check for a stored session.
    const bootstrapAsync = async () => {
      let storedUserId;
      try {
        storedUserId = await AsyncStorage.getItem("userId");
      } catch (e) {
        console.error("Failed to load user session from storage", e);
      }
      // After checking, we set the user ID (which might be null)
      setUserId(storedUserId);
      // We are done loading, so we can hide the loading screen.
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = async (id) => {
    try {
      await AsyncStorage.setItem("userId", id);
      setUserId(id);
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      setUserId(null);
    } catch (e) {
      console.error("Failed to clear user session", e);
    }
  };

  const value = {
    userId,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
