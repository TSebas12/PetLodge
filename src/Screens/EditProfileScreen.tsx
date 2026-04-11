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
import DoubleBtnModal from "../components/modals/DoubleBtnModal";
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";

// Activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const UserIcon = require("../../assets/IconoUsuario.webp");
const IdIcon = require("../../assets/IconoTarjeta.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const PhoneIcon = require("../../assets/IconoTelefono.webp");
const MapIcon = require("../../assets/IconoUbicacion.webp");
const CheckIcon = require("../../assets/IconoCheck.webp");
const AlertIcon = require("../../assets/IconoAlerta.webp");
const IconoX = require("../../assets/IconoX.webp");

// Expresiones regulares para validación
const phoneRegex = /^[0-9]{8}$/;
const cedulaRegex = /^[0-9]{9}$/;
const emailRegex = /\S+@\S+\.\S+/;

const EditProfileScreen = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Estados para Modales
  const [isLoading, setIsLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);

  // Estado para errores de validación y servidor
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    subtitle: "",
    icon: AlertIcon,
  });

  const [form, setForm] = useState({
    fullName: "",
    cedula: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      let session = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (session) {
        const parsed = JSON.parse(session);
        setUserData(parsed);
        setForm({
          fullName: parsed.fullName || "",
          cedula: parsed.cedula || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
        });
      } else {
        if (isMounted) router.replace("/");
      }
    } catch (error) {
      console.error("Error en sesión:", error);
    }
  }, [isMounted, router]);

  useEffect(() => {
    if (isMounted) loadUserData();
  }, [isMounted, loadUserData]);

  const handleInputChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePressCancel = () => {
    setModalCancelVisible(true);
  };

  const confirmCancel = () => {
    setForm({
      fullName: userData?.fullName || "",
      cedula: userData?.cedula || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    });
    setIsEditing(false);
    setModalCancelVisible(false);
  };

  const handleSaveChanges = async () => {
    // --- 1. VALIDACIONES DE FORMATO ---
    if (!form.fullName || !form.cedula || !form.email || !form.phone) {
      setErrorModal({
        visible: true,
        title: "Campos incompletos",
        subtitle:
          "Por favor, completa todos los campos para actualizar tu perfil.",
        icon: AlertIcon,
      });
      return;
    }

    if (!cedulaRegex.test(form.cedula)) {
      setErrorModal({
        visible: true,
        title: "Cédula inválida",
        subtitle: "La cédula debe tener exactamente 9 dígitos numéricos.",
        icon: AlertIcon,
      });
      return;
    }

    if (!emailRegex.test(form.email)) {
      setErrorModal({
        visible: true,
        title: "Correo inválido",
        subtitle: "Ingresa un correo electrónico válido (ejemplo@mail.com).",
        icon: AlertIcon,
      });
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      setErrorModal({
        visible: true,
        title: "Teléfono inválido",
        subtitle: "El teléfono debe tener 8 dígitos, sin espacios ni letras.",
        icon: AlertIcon,
      });
      return;
    }

    // --- 2. ENVÍO AL SERVIDOR ---
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const API_URL = "http://192.168.1.40:3000";

      const response = await fetch(`${API_URL}/api/users/${userData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar sesión local
        const updatedSession = { ...userData, ...data.user };
        if (Platform.OS === "web") {
          localStorage.setItem("userSession", JSON.stringify(updatedSession));
        } else {
          await SecureStore.setItemAsync(
            "userSession",
            JSON.stringify(updatedSession),
          );
        }

        setUserData(updatedSession);

        // Delay estético para el loader
        const duration = Date.now() - startTime;
        if (duration < 1200) {
          await new Promise((resolve) => setTimeout(resolve, 1200 - duration));
        }

        setIsLoading(false);
        setIsEditing(false);
        setModalSuccess(true);
      } else {
        // Error del backend (Cédula o Email duplicados, etc.)
        setIsLoading(false);
        setErrorModal({
          visible: true,
          title: "Error al actualizar",
          subtitle: data.message || "No se pudieron guardar los cambios.",
          icon: IconoX,
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setIsLoading(false);
      setErrorModal({
        visible: true,
        title: "Error de red",
        subtitle: "No se pudo conectar con el servidor. Revisa tu conexión.",
        icon: IconoX,
      });
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === "web") localStorage.removeItem("userSession");
    else await SecureStore.deleteItemAsync("userSession");
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
      >
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            {isEditing ? "Editar Perfil" : "Mi Perfil"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? "Modifica tus datos"
              : "Información personal registrada"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <CustomInput
              label="Nombre Completo"
              value={form.fullName}
              onChangeText={(t) => handleInputChange("fullName", t)}
              icon={UserIcon}
              editable={isEditing}
            />
            <CustomInput
              label="Cédula"
              value={form.cedula}
              onChangeText={(t) => handleInputChange("cedula", t)}
              icon={IdIcon}
              editable={isEditing}
              keyboardType="numeric"
            />
            <CustomInput
              label="Correo Electrónico"
              value={form.email}
              onChangeText={(t) => handleInputChange("email", t)}
              icon={MailIcon}
              editable={isEditing}
              keyboardType="email-address"
            />
            <CustomInput
              label="Teléfono"
              value={form.phone}
              onChangeText={(t) => handleInputChange("phone", t)}
              icon={PhoneIcon}
              editable={isEditing}
              keyboardType="phone-pad"
            />
            <CustomInput
              label="Dirección"
              value={form.address}
              onChangeText={(t) => handleInputChange("address", t)}
              icon={MapIcon}
              editable={isEditing}
            />
          </View>

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
                  onPress={handleSaveChanges}
                />
                <View style={{ height: 12 }} />
                <CustomButton
                  title="Cancelar"
                  type="danger"
                  onPress={handlePressCancel}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* MODALES */}
      <LoadingModal visible={isLoading} message="Actualizando perfil..." />

      <SingleBtnModal
        visible={modalSuccess}
        icon={CheckIcon}
        title="¡Perfil Actualizado!"
        subtitle="Los cambios se han guardado con éxito."
        onConfirm={() => setModalSuccess(false)}
      />

      {/* Modal para errores de validación o duplicados */}
      <SingleBtnModal
        visible={errorModal.visible}
        icon={errorModal.icon}
        title={errorModal.title}
        subtitle={errorModal.subtitle}
        onConfirm={() => setErrorModal({ ...errorModal, visible: false })}
      />

      <DoubleBtnModal
        visible={modalCancelVisible}
        icon={AlertIcon}
        title="¿Descartar cambios?"
        subtitle="Si confirmas, los cambios que hayas realizado se perderán y volverás a los datos anteriores."
        onClose={() => setModalCancelVisible(false)}
        onConfirm={confirmCancel}
      />

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
