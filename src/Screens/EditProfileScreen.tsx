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
import Footer from "../components/Footer";

// Importación de Iconos y Logo
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const UserIcon = require("../../assets/IconoUsuario.webp");
const IdIcon = require("../../assets/IconoTarjeta.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const PhoneIcon = require("../../assets/IconoTelefono.webp");
const MapIcon = require("../../assets/IconoUbicacion.webp");

const EditProfileScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Fijo Superior */}
      <View className="w-full bg-white px-4 py-4 flex-row justify-between items-center border-b border-[#E5E7EB]">
        <View className="flex-row items-center">
          <Image
            source={Logo}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
          <Text className="text-[#101828] text-xl font-bold ml-2">
            PetLodge
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => console.log("Logout")}
          activeOpacity={0.7}
        >
          <Image
            source={LogoutIcon}
            style={{ width: 24, height: 24, tintColor: "#4A5565" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Contenido con Scroll */}
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          paddingBottom: 40,
          paddingTop: 30,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
      >
        {/* Títulos de la pantalla */}
        <View className="w-full mb-8">
          <Text className="text-[#101828] text-3xl font-bold">
            Editar Perfil
          </Text>
          <Text className="text-[#4A5565] text-base mt-2">
            Actualiza tu información personal
          </Text>
        </View>

        {/* Formulario - Inputs Deshabilitados (No editables) */}
        <View className="w-full gap-y-2">
          <CustomInput
            label="Nombre Completo"
            placeholder=""
            icon={UserIcon}
            editable={false}
          />

          <CustomInput
            label="Cédula"
            placeholder=""
            icon={IdIcon}
            editable={false}
          />

          <CustomInput
            label="Correo Electrónico"
            placeholder=""
            icon={MailIcon}
            editable={false}
          />

          <CustomInput
            label="Teléfono"
            placeholder=""
            icon={PhoneIcon}
            editable={false}
          />

          <CustomInput
            label="Dirección"
            placeholder=""
            icon={MapIcon}
            editable={false}
          />
        </View>

        {/* Botón de Acción - Título actualizado */}
        <View className="w-full mt-10">
          <CustomButton
            title="Editar Perfil"
            onPress={() => console.log("Habilitar edición")}
          />
        </View>
      </ScrollView>

      {/* Footer Fijo Inferior */}
      <Footer />
    </SafeAreaView>
  );
};

export default EditProfileScreen;
