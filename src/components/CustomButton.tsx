import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger";
}

const CustomButton = ({ title, onPress, type = "primary" }: Props) => {
  const isPrimary = type === "primary";
  const isDanger = type === "danger";

  const bgColor = isPrimary ? "#00A63E" : isDanger ? "#E7000B" : "#155DFC";
  const shadowColor = isPrimary ? "#00A63E" : isDanger ? "#E7000B" : "#155DFC";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, { backgroundColor: bgColor, shadowColor }]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  button: ViewStyle;
  text: TextStyle;
}>({
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
});

export default CustomButton;
