import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

const LoginScreen = () => {
  return (
    // Contenedor principal con fondo verde claro
    <SafeAreaView className="flex-1 bg-[#F0FDF4] justify-center items-center px-4 h-full w-full">
      {/* Tarjeta Blanca (Card) */}
      <View className="bg-white w-full max-w-[360px] p-8 rounded-[16px] shadow-2xl items-center">
        {/* Icono de Huella/Pet (Circulo verde claro) */}
        <View className="w-20 h-20 bg-[#DCFCE7] rounded-full justify-center items-center mb-6">
          {/* Aquí iría tu logo de PetLodge */}
          <View className="w-10 h-10 border-4 border-[#00A63E] rounded-md rotate-12" />
        </View>

        {/* Títulos */}
        <Text className="text-[#101828] text-2xl font-bold mb-2 text-center">
          Bienvenido a PetLodge
        </Text>
        <Text className="text-[#4A5565] text-base font-normal mb-8 text-center leading-6">
          Tu solución para el cuidado de mascotas
        </Text>

        {/* Formulario */}
        <CustomInput
          label="Correo Electrónico"
          placeholder="Correo electrónico"
        />
        <CustomInput label="Contraseña" placeholder="Contraseña" isPassword />

        {/* Botón Iniciar Sesión */}
        <CustomButton title="Iniciar Sesión" onPress={() => {}} />

        {/* Olvidaste contraseña */}
        <TouchableOpacity className="mt-6 mb-8">
          <Text className="text-[#4A5565] text-sm font-normal">
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View className="w-full border-t border-[#E5E7EB] pt-6">
          <CustomButton
            title="Registrarse"
            onPress={() => {}}
            type="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
