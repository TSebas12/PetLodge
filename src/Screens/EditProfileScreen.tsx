import React, { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header Fijo Superior */}
      <View className="w-full bg-white px-4 py-4 flex-row justify-between items-center border-b border-[#E5E7EB]">
        <View className="flex-row items-center">
          <Image
            source={Logo}
            style={{ width: 32, height: 32 }}
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
            style={{ width: 20, height: 20, tintColor: "#4A5565" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Contenido con Scroll */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 30,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
      >
        <View className="w-full mb-6">
          <Text className="text-[#101828] text-[30px] font-bold leading-[36px]">
            {isEditing ? "Editar Perfil de Usuario" : "Perfil de Usuario"}
          </Text>
          <Text className="text-[#4A5565] text-base mt-2">
            {isEditing
              ? "Modifica tus datos personales"
              : "Tu información personal"}
          </Text>
        </View>

        <View
          className="w-full bg-white p-6 rounded-[14px] border border-[#E5E7EB] shadow-sm"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View className="w-full gap-y-1">
            <CustomInput
              label="Nombre Completo"
              placeholder="Juan Pérez"
              icon={UserIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Cédula"
              placeholder="112344321"
              icon={IdIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Correo Electrónico"
              placeholder="juan.perez@example.com"
              icon={MailIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Teléfono"
              placeholder="8888-8888"
              icon={PhoneIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Dirección"
              placeholder="Dirección ejemplo"
              icon={MapIcon}
              editable={isEditing}
            />
          </View>

          {/* Sección de Botones */}
          <View className="w-full mt-6 pt-6 border-t border-[#E5E7EB]">
            {!isEditing ? (
              <CustomButton
                title="Editar Perfil"
                onPress={() => setIsEditing(true)}
              />
            ) : (
              <View className="gap-y-3">
                {/* Botón de Cancelar arriba en Rojo */}
                <CustomButton
                  title="Cancelar"
                  type="danger"
                  onPress={() => setIsEditing(false)}
                />

                {/* Botón de Guardar abajo en Verde */}
                <CustomButton
                  title="Guardar Cambios"
                  type="primary"
                  onPress={() => {
                    console.log("Guardado");
                    setIsEditing(false);
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default EditProfileScreen;
