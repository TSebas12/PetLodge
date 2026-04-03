import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

const Logo = require("../../assets/LogoPetLodge.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const LockIcon = require("../../assets/IconoContrasena.webp");

const LoginScreen = () => {
  return (
    // Contenedor principal con fondo verde claro
    <SafeAreaView className="flex-1 bg-[#F0FDF4] justify-center items-center px-4 h-full w-full">
      {/* Tarjeta Blanca (Card) */}
      <View className="bg-white w-full max-w-[360px] p-8 rounded-[16px] shadow-2xl items-center">
        {/* Icono de Huella/Pet (Circulo verde claro) */}
        <View className="w-[80px] h-[80px] bg-[#DCFCE7] rounded-full justify-center items-center mb-6 overflow-hidden">
          {/* Logo en formato WebP */}
          <Image
            source={Logo}
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
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
          placeholder="Ingrese su correo electrónico"
          icon={MailIcon}
        />

        <CustomInput
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          isPassword
          icon={LockIcon}
        />

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
