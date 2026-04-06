import axios from "axios"; // Asegúrate de haber hecho: npm install axios
import React, { useState } from "react"; // Importamos useState
import {
  Alert,
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

// ... tus imports de imágenes se quedan igual ...
const Logo = require("../../assets/LogoPetLodge.webp");
const UserIcon = require("../../assets/IconoUsuario.webp");
const IdIcon = require("../../assets/IconoTarjeta.webp");
const MailIcon = require("../../assets/IconoCorreo.webp");
const PhoneIcon = require("../../assets/IconoTelefono.webp");
const MapIcon = require("../../assets/IconoUbicacion.webp");
const LockIcon = require("../../assets/IconoContrasena.webp");

const RegisterScreen = () => {
  // 1. Estados para capturar el texto
  const [fullName, setFullName] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  // 2. Función para enviar al Backend
  const handleRegister = async () => {
    // Validar que no haya campos vacíos
    if (!fullName || !cedula || !email || !password) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }

    try {
      // REEMPLAZA ESTA IP POR LA TUYA
      const API_URL = "http://192.168.1.40:3000/api/users/register";

      const response = await axios.post(API_URL, {
        fullName,
        cedula,
        email,
        phone,
        address,
        password,
      });

      if (response.status === 201) {
        Alert.alert("¡Éxito!", "Dueño registrado en PetLodge");
        // Aquí podrías limpiar el formulario o navegar al login
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "No se pudo conectar con el servidor. Revisa la IP.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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

          {/* 3. Agregamos value y onChangeText a cada Input */}
          <CustomInput
            label="Nombre Completo"
            placeholder="Ingrese su nombre completo"
            icon={UserIcon}
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />

          <CustomInput
            label="Cédula"
            placeholder="Ingrese su número de cédula"
            icon={IdIcon}
            value={cedula}
            onChangeText={(text) => setCedula(text)}
          />

          <CustomInput
            label="Correo Electrónico"
            placeholder="Ingrese su correo electrónico"
            icon={MailIcon}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />

          <CustomInput
            label="Teléfono"
            placeholder="Ingrese su número de teléfono"
            icon={PhoneIcon}
            value={phone}
            onChangeText={(text) => setPhone(text)}
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Dirección"
            placeholder="Ingrese su dirección"
            icon={MapIcon}
            value={address}
            onChangeText={(text) => setAddress(text)}
          />

          <CustomInput
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            isPassword
            icon={LockIcon}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <View style={styles.buttonWrapper}>
            {/* 4. Conectamos la función al botón */}
            <CustomButton title="Registrarse" onPress={handleRegister} />
          </View>

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
