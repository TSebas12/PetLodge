import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  iconBackgroundColor?: string;
  iconBorderColor?: string;
}

const StatCard = ({
  label,
  value,
  iconBackgroundColor = "#DCFCE7",
  iconBorderColor = "#00A63E",
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

        {/* Lado Derecho: Icono decorativo */}
        <View
          style={[styles.iconBox, { backgroundColor: iconBackgroundColor }]}
        >
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.miniSquare,
                { top: 2, left: 9, borderColor: iconBorderColor },
              ]}
            />
            <View
              style={[
                styles.miniSquare,
                { top: 6, left: 16, borderColor: iconBorderColor },
              ]}
            />
            <View
              style={[
                styles.miniSquare,
                { top: 14, left: 18, borderColor: iconBorderColor },
              ]}
            />
            <View
              style={[
                styles.mainSquare,
                { top: 10, left: 2, borderColor: iconBorderColor },
              ]}
            />
          </View>
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
    // Sombras consistentes con tu Card de perfil
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
  iconContainer: {
    width: 24,
    height: 24,
    position: "relative",
  },
  miniSquare: {
    width: 4,
    height: 4,
    position: "absolute",
    borderWidth: 2,
    borderRadius: 1,
  },
  mainSquare: {
    width: 12,
    height: 12,
    position: "absolute",
    borderWidth: 2,
    borderRadius: 1,
  },
});

export default StatCard;
