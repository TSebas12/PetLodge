import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../config/api";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";

const Logo = require("../../assets/LogoPetLodge.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const LockIcon = require("../../assets/IconoContrasena.webp");

const IconoAlerta = require("../../assets/IconoAlerta.webp");
const IconoX = require("../../assets/IconoX.webp");

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    subtitle: "",
    icon: IconoAlerta,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setModalData({
        title: "Campos incompletos",
        subtitle: "Por favor, ingresa tu correo y contraseña para continuar.",
        icon: IconoAlerta,
      });
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    try {
      // AJUSTE DE URL: Si es Web usa localhost, si es móvil usa la IP
      const API_URL = `${API_BASE_URL}/api/users/login`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          // --- PRUEBA DE PERSISTENCIA HÍBRIDA ---
          try {
            if (Platform.OS === "web") {
              // En Web usamos localStorage si SecureStore da problemas
              localStorage.setItem("userSession", JSON.stringify(data.user));
              console.log("LOGIN EXITOSO: Guardado en localStorage (Web)");
            } else {
              await SecureStore.setItemAsync(
                "userSession",
                JSON.stringify(data.user),
              );
              console.log("LOGIN EXITOSO: Guardado en SecureStore (Móvil)");
            }
          } catch (storageError) {
            console.warn(
              "Error al persistir sesión, pero continuando...",
              storageError,
            );
          }

          router.replace("/home" as any);
        } else {
          throw new Error("Datos de usuario no recibidos.");
        }
      } else {
        setModalData({
          title: "Acceso Denegado",
          subtitle: data.message || "Correo o contraseña incorrectos.",
          icon: IconoX,
        });
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error("ERROR DETALLADO EN LOGIN:", error.message);

      setModalData({
        title: "Error de Conexión",
        subtitle:
          Platform.OS === "web"
            ? "No se pudo conectar al servidor local. Verifica que el backend esté corriendo y el CORS habilitado."
            : "No pudimos conectar con el servidor. Revisa tu IP local.",
        icon: IconoX,
      });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal visible={loading} message="Validando credenciales..." />

      <SingleBtnModal
        visible={showErrorModal}
        icon={modalData.icon}
        title={modalData.title}
        subtitle={modalData.subtitle}
        onConfirm={() => setShowErrorModal(false)}
      />

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Bienvenido a PetLodge</Text>
        <Text style={styles.subtitle}>
          Tu solución para el cuidado de mascotas
        </Text>

        <CustomInput
          label="Correo Electrónico"
          placeholder="Ingrese su correo electrónico"
          icon={MailIcon}
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          isPassword
          icon={LockIcon}
          value={password}
          onChangeText={setPassword}
        />

        <CustomButton title="Iniciar Sesión" onPress={handleLogin} />

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <CustomButton
            title="Registrarse"
            onPress={() => router.push("/register")}
            type="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 360,
    padding: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 10,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
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
  forgotButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  forgotText: {
    color: "#4A5565",
    fontSize: 14,
    fontWeight: "400",
  },
  divider: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 24,
  },
});

export default LoginScreen;
