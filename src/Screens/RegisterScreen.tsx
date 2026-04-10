import axios from "axios";
import { useRouter } from "expo-router";
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
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";

const Logo = require("../../assets/LogoPetLodge.webp");
const UserIcon = require("../../assets/IconoUsuario.webp");
const IdIcon = require("../../assets/IconoTarjeta.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const PhoneIcon = require("../../assets/IconoTelefono.webp");
const MapIcon = require("../../assets/IconoUbicacion.webp");
const LockIcon = require("../../assets/IconoContrasena.webp");

// Iconos para modales
const IconoAlerta = require("../../assets/IconoAlerta.webp");
const IconoX = require("../../assets/IconoX.webp");
const IconoCheck = require("../../assets/IconoCheck.webp");
const LogoPetLodge = require("../../assets/LogoPetLodge.webp");

const RegisterScreen = () => {
  const router = useRouter();

  // 1. Estados para los campos
  const [fullName, setFullName] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  // Estados para Modales
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    subtitle: "",
    icon: IconoAlerta,
    onConfirm: () => {},
  });

  // 2. Función para enviar al Backend
  const handleRegister = async () => {
    // Validación de campos obligatorios
    if (!fullName || !cedula || !email || !password) {
      setModalData({
        title: "Campos incompletos",
        subtitle:
          "Por favor, completa los campos obligatorios para registrarte.",
        icon: IconoAlerta,
        onConfirm: () => setShowModal(false),
      });
      setShowModal(true);
      return;
    }

    setLoading(true);
    const delay = new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const API_URL = "http://192.168.1.40:3000/api/users/register";
      const [response] = await Promise.all([
        axios.post(API_URL, {
          fullName,
          cedula,
          email,
          phone,
          address,
          password,
        }),
        delay,
      ]);

      if (response.status === 201) {
        // ÉXITO AL REGISTRAR
        setModalData({
          title: "¡Registro Exitoso!",
          subtitle:
            "Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.",
          icon: IconoCheck,
          onConfirm: () => {
            setShowModal(false);
            router.replace("/");
          },
        });
        setShowModal(true);
      }
    } catch (error: any) {
      console.error(error);
      // ERROR AL REGISTRAR (Email ya existe, error de red, etc)
      setModalData({
        title: "Error al registrar",
        subtitle:
          error.response?.data?.message ||
          "No pudimos conectar con el servidor.",
        icon: IconoX,
        onConfirm: () => setShowModal(false),
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingModal visible={loading} message="Creando tu cuenta..." />

      <SingleBtnModal
        visible={showModal}
        icon={modalData.icon}
        title={modalData.title}
        subtitle={modalData.subtitle}
        onConfirm={modalData.onConfirm}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Registro de Usuario</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para crear una cuenta
          </Text>

          <CustomInput
            label="Nombre Completo"
            placeholder="Ingrese su nombre completo"
            icon={UserIcon}
            value={fullName}
            onChangeText={setFullName}
          />

          <CustomInput
            label="Cédula"
            placeholder="Ingrese su número de cédula"
            icon={IdIcon}
            value={cedula}
            onChangeText={setCedula}
          />

          <CustomInput
            label="Correo Electrónico"
            placeholder="Ingrese su correo electrónico"
            icon={MailIcon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <CustomInput
            label="Teléfono"
            placeholder="Ingrese su número de teléfono"
            icon={PhoneIcon}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Dirección"
            placeholder="Ingrese su dirección"
            icon={MapIcon}
            value={address}
            onChangeText={setAddress}
          />

          <CustomInput
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            isPassword
            icon={LockIcon}
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonWrapper}>
            <CustomButton title="Registrarse" onPress={handleRegister} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.linkText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 360,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    // Sombras para Android
    elevation: 8,
    // Sombras para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#DCFCE7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  logo: {
    width: 48,
    height: 48,
  },
  title: {
    color: "#101828",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#4A5565",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    marginTop: 32,
    justifyContent: "center",
  },
  footerText: {
    color: "#4A5565",
    fontSize: 14,
    fontWeight: "400",
  },
  linkText: {
    color: "#155DFC",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;
