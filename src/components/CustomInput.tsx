import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  View,
} from "react-native";

interface Props {
  label: string;
  placeholder: string;
  isPassword?: boolean;
  icon?: ImageSourcePropType;
  editable?: boolean; // <-- Agregamos esto a la Interface
}

const CustomInput = ({
  label,
  placeholder,
  isPassword,
  icon,
  editable = true,
}: Props) => {
  return (
    <View className="w-full mb-4">
      <Text className="text-[#364153] text-[14px] font-medium mb-2 leading-5">
        {label}
      </Text>

      <View className="relative justify-center">
        <TextInput
          placeholder={placeholder}
          secureTextEntry={isPassword}
          editable={editable} // <-- Se lo pasamos al TextInput original
          placeholderTextColor="rgba(10, 10, 10, 0.50)"
          // Añadimos una pequeña lógica visual: si no es editable, el fondo se ve ligeramente gris
          className={`w-full h-[50px] border border-[#D1D5DC] rounded-[10px] pl-[48px] text-[16px] text-[#101828] ${
            !editable ? "bg-[#F9FAFB]" : "bg-white"
          }`}
        />
        {/* Renderizamos la imagen solo si pasas un icono */}
        {icon && (
          <Image
            source={icon}
            style={{ width: 20, height: 20, position: "absolute", left: 16 }}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

export default CustomInput;
