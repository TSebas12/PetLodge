import React from "react";
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta Blanca (Card) */}
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.iconContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Títulos */}
          <Text style={styles.title}>Registro de Usuario</Text>
          <Text style={styles.subtitle}>
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
          <View style={styles.buttonWrapper}>
            <CustomButton
              title="Registrarse"
              onPress={() => console.log("Registrado!")}
            />
          </View>

          {/* Enlace para volver al Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => console.log("Ir a Login")}>
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
    backgroundColor: "#F0FDF4", // Verde claro de PetLodge
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
