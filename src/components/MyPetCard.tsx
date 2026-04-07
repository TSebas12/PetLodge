import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomButtonIcon from "./CustomButtonIcon";

// Assets de iconos para los botones
const IconoEditar = require("../../assets/IconoEditar.webp");
const IconoBorrar = require("../../assets/IconoBorrar.webp");

interface PetCardProps {
  imageUri?: string;
  name: string;
  breed: string;
  type: string;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
}

const MyPetsCard = ({
  imageUri,
  name,
  breed,
  type,
  status,
  onEdit,
  onDelete,
}: PetCardProps) => {
  return (
    <View style={styles.cardContainer}>
      {/* Imagen superior con el Badge de Estado */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.petImage}
          resizeMode="cover"
        />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Contenedor de información */}
      <View style={styles.infoContainer}>
        {/* Nombre: 18px Bold */}
        <Text style={styles.nameText}>{name}</Text>

        {/* Raza: 14px Regular */}
        <Text style={styles.breedText}>{breed}</Text>

        {/* Tipo: 12px Regular */}
        <Text style={styles.typeText}>{type}</Text>

        {/* Fila de botones de acción */}
        <View style={styles.actionsRow}>
          <View style={styles.flexBtn}>
            <CustomButtonIcon
              title="Editar"
              icon={IconoEditar}
              onPress={onEdit}
              type="secondary"
            />
          </View>

          <View style={styles.flexBtn}>
            <CustomButtonIcon
              title="Eliminar"
              icon={IconoBorrar}
              onPress={onDelete}
              type="danger"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1.28,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: "100%",
    height: 160,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 11,
    right: 11,
    backgroundColor: "#00A63E",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 16,
  },
  nameText: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
  },
  breedText: {
    color: "#4A5565",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 4,
  },
  typeText: {
    color: "#6A7282",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  flexBtn: {
    flex: 1,
  },
});

export default MyPetsCard;
