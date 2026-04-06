import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Importamos el hook para detectar el área segura
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeIcon = require("../../assets/IconoCasa.webp");
const PetsIcon = require("../../assets/IconoHuella.webp");
const BookingIcon = require("../../assets/IconoCalendario.webp");
const NoticesIcon = require("../../assets/IconoCampana.webp");
const ProfileIcon = require("../../assets/IconoUsuario.webp");

const Footer = () => {
  const insets = useSafeAreaInsets(); // <--- Obtenemos los bordes del cel

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }, // <--- Agregamos el espacio de seguridad
      ]}
    >
      <TouchableOpacity style={styles.tab} activeOpacity={0.6}>
        <Image source={HomeIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.tabText}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} activeOpacity={0.6}>
        <Image source={PetsIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.tabText}>Mascotas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} activeOpacity={0.6}>
        <Image source={BookingIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.tabText}>Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} activeOpacity={0.6}>
        <Image source={NoticesIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.tabText}>Avisos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} activeOpacity={0.6}>
        <Image source={ProfileIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.tabText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Quitamos el height fijo de 64 para que crezca con el padding del safe area
    minHeight: 64,
    paddingHorizontal: 8,
    paddingTop: 8,
    // Sombras
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#6A7282",
  },
  tabText: {
    color: "#6A7282",
    fontSize: 11,
    fontWeight: "400",
    marginTop: 4,
  },
});

export default Footer;
