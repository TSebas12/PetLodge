import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Cambiamos useSegments por usePathname para mayor precisión
import { usePathname, useRouter } from "expo-router";

const HomeIcon = require("../../assets/IconoCasa.webp");
const PetsIcon = require("../../assets/IconoHuella.webp");
const BookingIcon = require("../../assets/IconoCalendario.webp");
const NoticesIcon = require("../../assets/IconoCampana.webp");
const ProfileIcon = require("../../assets/IconoUsuario.webp");

const Footer = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const ACTIVE_COLOR = "#00A63E";
  const INACTIVE_COLOR = "#6A7282";

  const renderTab = (routePath: string, label: string, icon: any) => {
    // Comparamos si el pathname actual contiene la ruta del tab
    // Usamos .includes o comparacion directa
    const isActive =
      pathname === routePath || (pathname === "/" && routePath === "/home");

    return (
      <TouchableOpacity
        style={styles.tab}
        activeOpacity={0.6}
        onPress={() => router.replace(routePath as any)}
      >
        <Image
          source={icon}
          style={[
            styles.icon,
            { tintColor: isActive ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.tabText,
            {
              color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
              fontWeight: isActive ? "700" : "400",
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      {/* IMPORTANTE: Las rutas deben llevar el "/" inicial */}
      {renderTab("/home", "Inicio", HomeIcon)}
      {renderTab("/pets", "Mascotas", PetsIcon)}
      {renderTab("/bookings", "Reservas", BookingIcon)}
      {renderTab("/notices", "Avisos", NoticesIcon)}
      {renderTab("/profile", "Perfil", ProfileIcon)}
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
    minHeight: 64,
    paddingHorizontal: 8,
    paddingTop: 8,
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
  },
  tabText: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default Footer;
