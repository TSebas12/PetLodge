import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header Fijo Superior */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>

        <TouchableOpacity
          onPress={() => console.log("Logout")}
          activeOpacity={0.7}
        >
          <Image
            source={LogoutIcon}
            style={styles.logoutIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Contenido con Scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            {isEditing ? "Editar Perfil de Usuario" : "Perfil de Usuario"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? "Modifica tus datos personales"
              : "Tu información personal"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <CustomInput
              label="Nombre Completo"
              placeholder=""
              icon={UserIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Cédula"
              placeholder=""
              icon={IdIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Correo Electrónico"
              placeholder=""
              icon={MailIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Teléfono"
              placeholder=""
              icon={PhoneIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Dirección"
              placeholder=""
              icon={MapIcon}
              editable={isEditing}
            />
          </View>

          {/* Sección de Botones */}
          <View style={styles.buttonSection}>
            {!isEditing ? (
              <CustomButton
                title="Editar Perfil"
                onPress={() => setIsEditing(true)}
              />
            ) : (
              <View style={styles.editingButtons}>
                <CustomButton
                  title="Cancelar"
                  type="danger"
                  onPress={() => setIsEditing(false)}
                />
                <View style={{ height: 12 }} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: "#4A5565",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  titleContainer: {
    width: "100%",
    marginBottom: 24,
  },
  mainTitle: {
    color: "#101828",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
  },
  subtitle: {
    color: "#4A5565",
    fontSize: 16,
    marginTop: 8,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    width: "100%",
  },
  buttonSection: {
    width: "100%",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  editingButtons: {
    width: "100%",
  },
});

export default EditProfileScreen;
