import axios from "axios";
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
import API_BASE_URL from "../config/api";

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
  const [petsCount, setPetsCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  //const API_URL = "http://192.168.1.40:3000";
  const API_URL = API_BASE_URL;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función para obtener la cantidad de mascotas desde el servidor
  const fetchPetsData = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/pets/user/${userId}`);
      if (Array.isArray(response.data)) {
        setPetsCount(response.data.length);
      }
    } catch (error) {
      console.error("Error al obtener estadísticas de mascotas:", error);
    }
  };

  // Función para cargar sesión y disparar peticiones
  const getUserData = useCallback(async () => {
    try {
      let session = null;

      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (session) {
        const parsed = JSON.parse(session);
        setUserData(parsed);

        // Una vez tenemos el ID del usuario, traemos el conteo real
        await fetchPetsData(parsed._id);
      } else {
        if (isMounted) router.replace("/");
      }
    } catch (error) {
      console.error("Error cargando sesión:", error);
      if (isMounted) router.replace("/");
    } finally {
      setRefreshing(false);
    }
  }, [isMounted, router]);

  useEffect(() => {
    if (isMounted) {
      getUserData();
    }
  }, [isMounted, getUserData]);

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") localStorage.removeItem("userSession");
      else await SecureStore.deleteItemAsync("userSession");
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Fijo */}
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
        {/* Bienvenida */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            ¡Hola, {userData?.fullName?.split(" ")[0] || "Bienvenido"}!
          </Text>
          <Text style={styles.subtitle}>
            Gestiona tus mascotas y reservas activas
          </Text>
        </View>

        {/* Sección de Estadísticas Dinámicas */}
        <View style={styles.statsContainer}>
          <StatCard
            label="Mascotas Registradas"
            value={petsCount.toString()}
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
          <MyPetsCard ownerId={userData?._id} />
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
});

export default HomeScreen;
