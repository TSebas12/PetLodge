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
import Footer from "../components/Footer";
import StatCard from "../components/StatCard"; // El componente que creamos antes

// Importación de activos (usando tu misma lógica)
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Fijo Superior (Copiado de tu Ref) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>

        <TouchableOpacity
          onPress={() => console.log("Logout")}
          activeOpacity={0.7}
        >
          <Image
            source={LogoutIcon}
            style={styles.logoutIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Contenido con Scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Títulos de Bienvenida */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Panel Principal</Text>
          <Text style={styles.subtitle}>
            Gestiona tus mascotas y reservas activas
          </Text>
        </View>

        {/* Sección de Estadísticas */}
        <View style={styles.statsContainer}>
          <StatCard
            label="Mascotas Registradas"
            value="3"
            iconBackgroundColor="#DCFCE7"
            iconBorderColor="#00A63E"
          />

          <View style={{ height: 16 }} />

          <StatCard
            label="Reservas Activas"
            value="1"
            iconBackgroundColor="#DBEAFE"
            iconBorderColor="#155DFC"
          />

          <View style={{ height: 16 }} />

          <StatCard
            label="Próximas Reservas"
            value="1"
            iconBackgroundColor="#FEF9C2"
            iconBorderColor="#D08700"
          />
        </View>

        {/* Espacio para futuras secciones como 'Últimas Actividades' */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Próximamente: Lista de mascotas recientes
          </Text>
        </View>
      </ScrollView>

      {/* Footer Fijo */}
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
    paddingBottom: 100, // Espacio extra para no chocar con el footer
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
  statsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  placeholderCard: {
    width: "100%",
    padding: 24,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    alignItems: "center",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default HomeScreen;
