import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

// Importación del Logo y los Iconos
const Logo = require("../../assets/LogoPetLodge.webp");
const UserIcon = require("../../assets/IconoUsuario.webp");
const IdIcon = require("../../assets/IconoTarjeta.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const PhoneIcon = require("../../assets/IconoTelefono.webp");
const MapIcon = require("../../assets/IconoUbicacion.webp");
const LockIcon = require("../../assets/IconoContrasena.webp");

const RegisterScreen = () => {
  return (
    // Fondo con el degradado simulado con el color base de PetLodge
    <SafeAreaView className="flex-1 bg-[#F0FDF4] w-full h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
        }}
        className="px-4"
      >
        {/* Tarjeta Blanca (Card) */}
        <View className="bg-white w-full max-w-[360px] p-8 rounded-[16px] shadow-2xl items-center">
          {/* Logo */}
          <View className="w-[80px] h-[80px] bg-[#DCFCE7] rounded-full justify-center items-center mb-6 overflow-hidden">
            <Image
              source={Logo}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
          </View>

          {/* Títulos */}
          <Text className="text-[#101828] text-2xl font-bold mb-2 text-center">
            Registro de Usuario
          </Text>
          <Text className="text-[#4A5565] text-base font-normal mb-8 text-center leading-6">
            Completa tus datos para crear una cuenta
          </Text>

          {/* Formulario Extendido */}
          <CustomInput
            label="Nombre Completo"
            placeholder="Ingrese su nombre completo"
            icon={UserIcon}
          />

          <CustomInput
            label="Cédula"
            placeholder="Ingrese su número de cédula"
            icon={IdIcon}
          />

          <CustomInput
            label="Correo Electrónico"
            placeholder="Ingrese su correo electrónico"
            icon={MailIcon}
          />

          <CustomInput
            label="Teléfono"
            placeholder="Ingrese su número de teléfono"
            icon={PhoneIcon}
          />

          <CustomInput
            label="Dirección"
            placeholder="Ingrese su dirección"
            icon={MapIcon}
          />

          <CustomInput
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            isPassword
            icon={LockIcon}
          />

          {/* Botón de Registro */}
          <View className="w-full mt-2">
            <CustomButton
              title="Registrarse"
              onPress={() => console.log("Registrado!")}
            />
          </View>

          {/* Enlace para volver al Login */}
          <View className="flex-row mt-8 justify-center">
            <Text className="text-[#4A5565] text-sm font-normal">
              ¿Ya tienes una cuenta?{" "}
            </Text>
            <TouchableOpacity onPress={() => console.log("Ir a Login")}>
              <Text className="text-[#155DFC] font-inter text-sm">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
