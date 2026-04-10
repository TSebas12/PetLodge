import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Componentes del proyecto
import CustomButtonIcon from "../components/CustomButtonIcon";
import Footer from "../components/Footer";
import PetCard from "../components/MyPetCard";

// Importación de activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const IconoMas = require("../../assets/IconoPlus.webp");

const MyPetsScreen = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // 1. Control de montaje para evitar errores de navegación en Root Layout
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Función de validación de sesión (Igual al Home)
  const checkSession = useCallback(async () => {
    try {
      let session = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (!session && isMounted) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error validando sesión:", error);
      if (isMounted) router.replace("/");
    }
  }, [isMounted, router]);

  useEffect(() => {
    if (isMounted) {
      checkSession();
    }
  }, [isMounted, checkSession]);

  // 3. Función de Logout híbrida
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("userSession");
      } else {
        await SecureStore.deleteItemAsync("userSession");
      }
      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      router.replace("/");
    }
  };

  // Datos de prueba (Luego los traerás de tu API de MongoDB)
  const myPets = [
    {
      id: "1",
      name: "Max",
      breed: "Golden Retriever",
      type: "Perro",
      status: "Activo",
    },
    {
      id: "2",
      name: "Luna",
      breed: "Gato Siamés",
      type: "Gato",
      status: "Activo",
    },
  ];

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
      >
        {/* Títulos */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Mis Mascotas</Text>
          <Text style={styles.subtitle}>
            Gestiona tus mascotas y sus perfiles registrados
          </Text>
        </View>

        {/* Sección de Acción: Añadir Mascota */}
        <View style={styles.addBtnContainer}>
          <CustomButtonIcon
            title="Añadir Mascota"
            icon={IconoMas}
            type="primary"
            onPress={() => console.log("Navegar a Agregar Mascota")}
          />
        </View>

        {/* Listado de Mascotas */}
        <View style={styles.listContainer}>
          {myPets.map((pet) => (
            <PetCard
              key={pet.id}
              name={pet.name}
              breed={pet.breed}
              type={pet.type}
              status={pet.status}
              onEdit={() => console.log("Editando a", pet.name)}
              onDelete={() => console.log("Eliminando a", pet.name)}
            />
          ))}
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
    marginBottom: 20,
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
  addBtnContainer: {
    width: "100%",
    marginBottom: 24,
  },
  listContainer: {
    width: "100%",
  },
});

export default MyPetsScreen;
