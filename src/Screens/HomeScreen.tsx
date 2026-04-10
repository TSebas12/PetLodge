import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Componentes
import Footer from "../components/Footer";
import MyPetsCard from "../components/PetCard";
import ActiveReservationsCard from "../components/ReservationCard";
import StatCard from "../components/StatCard";

// Activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const MiniLogo = require("../../assets/LogoPetLodge.webp");
const CalendarBlue = require("../../assets/IconoCalendarioA.webp");
const CalendarOrange = require("../../assets/IconoCalendarioN.webp");

const HomeScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Marcar como montado al iniciar
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Función para obtener datos (Sin estado isLoading para evitar parpadeos)
  const getUserData = useCallback(async () => {
    try {
      let session = null;

      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (session) {
        setUserData(JSON.parse(session));
      } else {
        if (isMounted) {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Error cargando sesión:", error);
      if (isMounted) router.replace("/");
    } finally {
      setRefreshing(false);
    }
  }, [isMounted, router]);

  // 3. Disparar la carga al montar
  useEffect(() => {
    if (isMounted) {
      getUserData();
    }
  }, [isMounted, getUserData]);

  // 4. Función para cerrar sesión
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("userSession");
      } else {
        await SecureStore.deleteItemAsync("userSession");
      }
      router.replace("/");
    } catch (error) {
      console.error("Error al borrar sesión:", error);
      router.replace("/");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getUserData();
  };

  // Renderizamos directamente. Si userData es null, mostrará "Bienvenido"
  // instantáneamente sin cortes de pantalla.
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Fijo Superior */}
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

      {/* Contenido con Scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00A63E"]}
          />
        }
      >
        {/* Títulos de Bienvenida */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            ¡Hola, {userData?.fullName?.split(" ")[0] || "Bienvenido"}!
          </Text>
          <Text style={styles.subtitle}>
            Gestiona tus mascotas y reservas activas
          </Text>
        </View>

        {/* Sección de Estadísticas */}
        <View style={styles.statsContainer}>
          <StatCard
            label="Mascotas Registradas"
            value="3"
            icon={MiniLogo}
            iconBackgroundColor="#DCFCE7"
            iconTintColor="#15803D"
          />

          <View style={{ height: 16 }} />

          <StatCard
            label="Reservas Activas"
            value="1"
            icon={CalendarBlue}
            iconBackgroundColor="#DBEAFE"
            iconTintColor="#1D4ED8"
          />

          <View style={{ height: 16 }} />

          <StatCard
            label="Próximas Reservas"
            value="1"
            icon={CalendarOrange}
            iconBackgroundColor="#FEF9C2"
            iconTintColor="#A16207"
          />
        </View>

        {/* Sección de Mis Mascotas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Acceso Rápido a Mascotas</Text>
          <MyPetsCard />
        </View>

        {/* Reservas Activas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reservas Recientes</Text>
          <ActiveReservationsCard />
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
    paddingBottom: 20,
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
  sectionContainer: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
