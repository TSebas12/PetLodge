import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Importa tus iconos (ajusta los nombres según tus archivos)
const HomeIcon = require("../../assets/IconoCasa.webp");
const PetsIcon = require("../../assets/IconoHuella.webp");
const BookingIcon = require("../../assets/IconoCalendario.webp");
const NoticesIcon = require("../../assets/IconoCampana.webp");
const ProfileIcon = require("../../assets/IconoUsuario.webp");

const Footer = () => {
  return (
    <View className="w-full bg-white border-t border-[#E5E7EB] flex-row justify-between items-center h-[64px] px-2">
      {/* Inicio - Estado Inactivo */}
      <TouchableOpacity className="flex-1 items-center justify-center py-2">
        <Image
          source={HomeIcon}
          style={{ width: 24, height: 24, tintColor: "#6A7282" }}
          resizeMode="contain"
        />
        <Text className="text-[#6A7282] text-[12px] font-normal mt-1">
          Inicio
        </Text>
      </TouchableOpacity>

      {/* Mascotas - Estado Activo (Verde) */}
      <TouchableOpacity className="flex-1 items-center justify-center py-2">
        <Image
          source={PetsIcon}
          style={{ width: 24, height: 24, tintColor: "#6A7282" }}
          resizeMode="contain"
        />
        <Text className="text-[#6A7282] text-[12px] font-normal mt-1">
          Mascotas
        </Text>
      </TouchableOpacity>

      {/* Reservas */}
      <TouchableOpacity className="flex-1 items-center justify-center py-2">
        <Image
          source={BookingIcon}
          style={{ width: 24, height: 24, tintColor: "#6A7282" }}
          resizeMode="contain"
        />
        <Text className="text-[#6A7282] text-[12px] font-normal mt-1">
          Reservas
        </Text>
      </TouchableOpacity>

      {/* Avisos */}
      <TouchableOpacity className="flex-1 items-center justify-center py-2">
        <Image
          source={NoticesIcon}
          style={{ width: 24, height: 24, tintColor: "#6A7282" }}
          resizeMode="contain"
        />
        <Text className="text-[#6A7282] text-[12px] font-normal mt-1">
          Avisos
        </Text>
      </TouchableOpacity>

      {/* Perfil */}
      <TouchableOpacity className="flex-1 items-center justify-center py-2">
        <Image
          source={ProfileIcon}
          style={{ width: 24, height: 24, tintColor: "#6A7282" }}
          resizeMode="contain"
        />
        <Text className="text-[#6A7282] text-[12px] font-normal mt-1">
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
