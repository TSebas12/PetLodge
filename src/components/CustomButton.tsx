import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary";
}

const CustomButton = ({ title, onPress, type = "primary" }: Props) => {
  const isPrimary = type === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-full h-[48px] rounded-[10px] justify-center items-center shadow-md 
        ${isPrimary ? "bg-[#00A63E]" : "bg-[#155DFC]"}`}
      style={{
        shadowColor: isPrimary ? "#00A63E" : "#155DFC",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.45,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      <Text className="text-white text-[16px] font-inter leading-6">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
