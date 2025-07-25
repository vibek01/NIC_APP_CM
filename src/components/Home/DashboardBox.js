// src/components/Home/DashboardBox.js
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./DashboardBoxStyles";
import { COLORS } from "../../constants/colors";

// Wrap the component with Animated.createAnimatedComponent
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function DashboardBox({ title, iconName, index, onPress }) {
  const navigation = useNavigation();

  // Animation values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Trigger animation on component mount
  React.useEffect(() => {
    // Staggered delay based on index
    const delay = index * 100;
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPress) {
      onPress();
    } else if (title === "ACTIVE CASES") {
      navigation.navigate("ActiveCases");
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.box, animatedStyle]}
      onPress={handlePress}
    >
      <LinearGradient
        colors={[COLORS.gradient_start, COLORS.gradient_end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={COLORS.white}
          />
        </View>
        <Text style={styles.boxText}>{title}</Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}
