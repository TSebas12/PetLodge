import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ImageSourcePropType; // <--- Nueva prop para la imagen
  iconBackgroundColor?: string;
  iconTintColor?: string; // <--- Opcional, por si quieres teñir el icono
}

const StatCard = ({
  label,
  value,
  icon,
  iconBackgroundColor = "#DCFCE7",
  iconTintColor,
}: StatCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {/* Lado Izquierdo: Textos */}
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.valueWrapper}>
            <Text style={styles.value}>{value}</Text>
          </View>
        </View>

        {/* Lado Derecho: Contenedor con Imagen */}
        <View
          style={[styles.iconBox, { backgroundColor: iconBackgroundColor }]}
        >
          <Image
            source={icon}
            style={[
              styles.iconImage,
              iconTintColor ? { tintColor: iconTintColor } : null,
            ]}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 17,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1.28,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    gap: 4,
  },
  label: {
    color: "#4A5565",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 16,
    // Aquí el sistema usará la fuente de la HomeScreen automáticamente
  },
  valueWrapper: {
    height: 32,
    justifyContent: "center",
  },
  value: {
    color: "#101828",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 22, // Tamaño ideal para que quepa bien en el box de 40
    height: 22,
  },
});

export default StatCard;
