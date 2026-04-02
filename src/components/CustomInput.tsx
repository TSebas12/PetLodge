import React from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  label: string;
  placeholder: string;
  isPassword?: boolean;
}

const CustomInput = ({ label, placeholder, isPassword }: Props) => {
  return (
    <View className="w-full mb-4">
      {/* Label: Inter 500, 14px, #364153 */}
      <Text className="text-[#364153] text-[14px] font-medium mb-2 leading-5">
        {label}
      </Text>

      <View className="relative">
        {/* Input: Inter 400, 16px, Border #D1D5DC, Radius 10 */}
        <TextInput
          placeholder={placeholder}
          secureTextEntry={isPassword}
          placeholderTextColor="rgba(10, 10, 10, 0.50)"
          className="w-full h-[50px] border border-[#D1D5DC] rounded-[10px] px-10 text-[16px] text-[#101828]"
        />
        {/* Espacio para el icono (12px desde la izquierda) */}
        <View className="absolute left-3 top-4 w-5 h-5 bg-gray-200 rounded-full opacity-20" />
      </View>
    </View>
  );
};

export default CustomInput;
