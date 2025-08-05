// src/Navigation/RootNavigation.js
import { createNavigationContainerRef } from "@react-navigation/native";

// This creates a ref that we will attach to our NavigationContainer in App.js
export const navigationRef = createNavigationContainerRef();

// This function allows us to navigate from anywhere in our app, like from a listener.
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
