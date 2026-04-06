import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// IMPORTACIÓN CORREGIDA
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

const Logo = require("../../assets/LogoPetLodge.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const LockIcon = require("../../assets/IconoContrasena.webp");

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
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
        />

        <CustomInput
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          isPassword
          icon={LockIcon}
        />

        <CustomButton title="Iniciar Sesión" onPress={() => {}} />

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <CustomButton
            title="Registrarse"
            onPress={() => {}}
            type="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

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
