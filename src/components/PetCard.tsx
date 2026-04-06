import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButtonIcon from "../components/CustomButtonIcon";
import PetItem from "./PetItem";

// Asumiendo que tienes un icono de "plus" o similar
const AddIcon = require("../../assets/IconoPlus.webp");

const MyPetsCard = () => {
  const pets = [
    { id: 1, name: "Max", breed: "Golden Retriever", status: "Activo" },
    { id: 2, name: "Luna", breed: "Gato Siamés", status: "Activo" },
    { id: 3, name: "Rocky", breed: "Bulldog Francés", status: "Activo" },
  ];

  return (
    <View style={styles.mainCard}>
      {/* Header de la Card */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Mascotas Registradas</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>Ver Todas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Mascotas */}
      <View style={styles.listContainer}>
        {pets.map((pet) => (
          <PetItem
            key={pet.id}
            name={pet.name}
            breed={pet.breed}
            status={pet.status}
          />
        ))}
      </View>

      {/* Botón Añadir Mascota - Usando el componente global */}
      <View style={styles.buttonWrapper}>
        <CustomButtonIcon
          title="Añadir Mascota"
          onPress={() => console.log("Añadir nueva mascota")}
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
  buttonWrapper: {
    marginTop: 10,
    width: "100%",
  },
});

export default MyPetsCard;
