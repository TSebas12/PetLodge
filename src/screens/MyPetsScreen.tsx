import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
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
import DoubleBtnModal from "../components/modals/DoubleBtnModal";

// Componentes del proyecto
import CustomButtonIcon from "../components/CustomButtonIcon";
import Footer from "../components/Footer";
import PetCard from "../components/MyPetCard";

// Importación de activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const IconoMas = require("../../assets/IconoPlus.webp");
const IconoAlerta = require("../../assets/IconoAlerta.webp");

const MyPetsScreen = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [myPets, setMyPets] = useState([]); // Estado dinámico para mascotas
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadPets = useCallback(async () => {
    try {
      setIsLoading(true);
      let session = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (session) {
        const parsed = JSON.parse(session);
        const userId = parsed._id; // Obtenemos el ID del dueño de la sesión

        // Configuración de URL según plataforma [cite: 5]
        const API_URL =
          Platform.OS === "android"
            ? "http://192.168.1.40:3000"
            : "http://localhost:3000";

        // Petición al backend (Asegúrate de tener este endpoint: GET /api/pets/user/:id)
        const response = await axios.get(`${API_URL}/api/pets/user/${userId}`);

        if (response.status === 200) {
          setMyPets(response.data);
        }
      } else if (isMounted) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error cargando mascotas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isMounted, router]);

  useEffect(() => {
    if (isMounted) loadPets();
  }, [isMounted, loadPets]);

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

  const handleDeleteConfirm = async () => {
    if (!selectedPetId) return;

    try {
      const API_URL =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";

      const response = await axios.delete(
        `${API_URL}/api/pets/${selectedPetId}`,
      );

      if (response.status === 200) {
        // Actualizamos la lista local eliminando la mascota borrada
        setMyPets((prev) =>
          prev.filter((pet: any) => pet._id !== selectedPetId),
        );
        setDeleteModalVisible(false);
        setSelectedPetId(null);
      }
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      alert("No se pudo eliminar la mascota. Inténtalo de nuevo.");
      setDeleteModalVisible(false);
    }
  };

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Mis Mascotas</Text>
          <Text style={styles.subtitle}>Gestiona tus mascotas registradas</Text>
        </View>

        <View style={styles.addBtnContainer}>
          <CustomButtonIcon
            title="Añadir Mascota"
            icon={IconoMas}
            type="primary"
            onPress={() => router.push("/registerPet")}
          />
        </View>

        {/* Listado Dinámico */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <Text>Cargando mascotas...</Text>
          ) : myPets.length > 0 ? (
            myPets.map((pet: any) => (
              <PetCard
                key={pet._id}
                imageUri={pet.foto}
                name={pet.nombre}
                breed={pet.raza}
                type={pet.tipo}
                status=""
                onEdit={() => {
                  router.push({
                    pathname: "/registerPet",
                    params: { id: pet._id },
                  });
                }}
                onDelete={() => {
                  setSelectedPetId(pet._id);
                  setDeleteModalVisible(true);
                }}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No tienes mascotas registradas aún.
            </Text>
          )}
        </View>
      </ScrollView>
      <DoubleBtnModal
        visible={deleteModalVisible}
        icon={IconoAlerta}
        title="¿Eliminar mascota?"
        subtitle="Esta acción no se puede deshacer. Los datos de tu mascota se borrarán permanentemente."
        onClose={() => setDeleteModalVisible(false)} // Si cancela, solo cerramos
        onConfirm={handleDeleteConfirm} // Si confirma, borramos en la BD
      />
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
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 20,
    fontSize: 16,
  },
});

export default MyPetsScreen;
