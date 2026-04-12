import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButtonIcon from "../components/CustomButtonIcon";
import API_BASE_URL from "../config/api";
import PetItem from "./PetItem";

const AddIcon = require("../../assets/IconoPlus.webp");
const API_URL = API_BASE_URL;

interface MyPetsCardProps {
  ownerId: string | undefined;
}

const MyPetsCard = ({ ownerId }: MyPetsCardProps) => {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    if (!ownerId) return;

    try {
      setLoading(true);
      // Usamos la IP de tu servidor que pusiste en los otros archivos
      const response = await axios.get(`${API_URL}/api/pets/user/${ownerId}`);
      setPets(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [ownerId]);

  return (
    <View style={styles.mainCard}>
      {/* Header de la Card */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Mascotas Registradas</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/pets")}
        >
          <Text style={styles.seeAll}>Ver Todas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Mascotas Dinámica */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#00A63E"
            style={{ marginVertical: 20 }}
          />
        ) : pets.length > 0 ? (
          pets.map((pet: any) => (
            <PetItem
              key={pet._id}
              name={pet.nombre}
              breed={pet.raza || pet.tipo}
              status="Activo" // O podrías basarlo en alguna lógica de vacunas
            />
          ))
        ) : (
          <Text style={styles.noPetsText}>
            No tienes mascotas registradas aún.
          </Text>
        )}
      </View>

      {/* Botón Añadir Mascota */}
      <View style={styles.buttonWrapper}>
        <CustomButtonIcon
          title="Añadir Mascota"
          onPress={() => router.push("/registerPet")}
          icon={AddIcon}
          type="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 17,
    borderWidth: 1.28,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
  },
  seeAll: {
    color: "#00A63E",
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    marginBottom: 8,
  },
  noPetsText: {
    textAlign: "center",
    color: "#667085",
    marginVertical: 15,
    fontSize: 14,
  },
  buttonWrapper: {
    marginTop: 10,
    width: "100%",
  },
});

export default MyPetsCard;
