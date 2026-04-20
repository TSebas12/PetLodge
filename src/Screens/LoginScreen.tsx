import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        let session = null;
        if (Platform.OS === "web") {
          session = localStorage.getItem("userSession");
        } else {
          session = await SecureStore.getItemAsync("userSession");
        }

        if (session) {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Error comprobando sesión persistente:", error);
      }
    };
    checkSession();
  }, []);

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
      const API_URL = `${API_BASE_URL}/api/users/login`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        data = { message: "Error en la respuesta del servidor." };
      }

      if (response.ok && data.user) {
        if (Platform.OS === "web") {
          localStorage.setItem("userSession", JSON.stringify(data.user));
        } else {
          await SecureStore.setItemAsync(
            "userSession",
            JSON.stringify(data.user),
          );
        }
        router.replace("/home");
      } else {
        setModalData({
          title: "Acceso Denegado",
          subtitle: data.message || "Correo o contraseña incorrectos.",
          icon: IconoX,
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      setModalData({
        title: "Error de Conexión",
        subtitle: "No pudimos conectar con el servidor.",
        icon: IconoX,
      });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingModal visible={loading} message="Validando credenciales..." />

      <SingleBtnModal
        visible={showErrorModal}
        icon={modalData.icon}
        title={modalData.title}
        subtitle={modalData.subtitle}
        onConfirm={() => setShowErrorModal(false)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
              keyboardType="email-address"
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
              <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
            </View>

            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.linkText}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0FDF4", // Verde muy claro igual que Register
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
    // Sombras consistentes
    elevation: 8,
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
  forgotButton: {
    marginTop: 16,
  },
  forgotText: {
    color: "#4A5565",
    fontSize: 14,
    fontWeight: "400",
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

export default LoginScreen;
