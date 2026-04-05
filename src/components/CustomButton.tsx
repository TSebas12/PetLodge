import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger"; // Añadida la opción "danger"
}

const CustomButton = ({ title, onPress, type = "primary" }: Props) => {
  const isPrimary = type === "primary";
  const isDanger = type === "danger";

  // Definición de colores base
  const bgColor = isPrimary ? "#00A63E" : isDanger ? "#E7000B" : "#155DFC";
  const shadowColor = isPrimary ? "#00A63E" : isDanger ? "#E7000B" : "#155DFC";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-full h-[48px] rounded-[10px] justify-center items-center`}
      style={{
        backgroundColor: bgColor,
        shadowColor: shadowColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.45,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      <Text className="text-white text-[16px] font-inter font-medium leading-6">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
