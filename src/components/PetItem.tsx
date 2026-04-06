import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface PetItemProps {
  name: string;
  breed: string;
  status: string;
  image?: string; // URL o require
}

const PetItem = ({ name, breed, status, image }: PetItemProps) => (
  <View style={styles.itemContainer}>
    <View style={styles.contentRow}>
      {/* Círculo de Imagen / Placeholder */}
      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.petName}>{name}</Text>
        <Text style={styles.petBreed}>{breed}</Text>
        {/* Badge de Estado */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    padding: 13,
    borderRadius: 10,
    borderWidth: 1.28,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24, // Totalmente circular
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    backgroundColor: "#F3F4F6", // Gris claro
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  petName: {
    color: "#101828",
    fontSize: 14,
    fontWeight: "600",
  },
  petBreed: {
    color: "#4A5565",
    fontSize: 12,
    fontWeight: "400",
  },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    color: "#008236",
    fontSize: 12,
    fontWeight: "400",
  },
});

export default PetItem;
