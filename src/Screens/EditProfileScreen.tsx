import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Componentes
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import Footer from "../components/Footer";

// Activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const UserIcon = require("../../assets/IconoUsuario.webp");
const IdIcon = require("../../assets/IconoTarjeta.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const PhoneIcon = require("../../assets/IconoTelefono.webp");
const MapIcon = require("../../assets/IconoUbicacion.webp");

const EditProfileScreen = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // 1. Control de montaje
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Obtener datos y validar sesión (Sin parpadeo de carga)
  const loadUserData = useCallback(async () => {
    try {
      let session = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (session) {
        setUserData(JSON.parse(session));
      } else {
        if (isMounted) router.replace("/");
      }
    } catch (error) {
      console.error("Error en sesión:", error);
      if (isMounted) router.replace("/");
    }
  }, [isMounted, router]);

  useEffect(() => {
    if (isMounted) {
      loadUserData();
    }
  }, [isMounted, loadUserData]);

  // 3. Logout Híbrido
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("userSession");
      } else {
        await SecureStore.deleteItemAsync("userSession");
      }
      router.replace("/");
    } catch (error) {
      console.error("Error al salir:", error);
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Fijo Superior */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>

        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <Image
            source={LogoutIcon}
            style={styles.logoutIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            {isEditing ? "Editar Perfil" : "Mi Perfil"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? "Modifica tus datos personales"
              : "Tu información personal registrada"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <CustomInput
              label="Nombre Completo"
              value={userData?.fullName || ""}
              icon={UserIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Cédula"
              value={userData?.cedula || ""}
              icon={IdIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Correo Electrónico"
              value={userData?.email || ""}
              icon={MailIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Teléfono"
              value={userData?.phone || ""}
              icon={PhoneIcon}
              editable={isEditing}
            />

            <CustomInput
              label="Dirección"
              value={userData?.address || ""}
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
                  title="Guardar Cambios"
                  type="primary"
                  onPress={() => setIsEditing(false)}
                />
                <View style={{ height: 12 }} />
                <CustomButton
                  title="Cancelar"
                  type="danger"
                  onPress={() => setIsEditing(false)}
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
