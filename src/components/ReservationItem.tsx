import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ReservationItemProps {
  petName: string;
  dates: string;
  details: string;
  status: "Confirmada" | "Pendiente";
}

const ReservationItem = ({
  petName,
  dates,
  details,
  status,
}: ReservationItemProps) => {
  const isConfirmada = status === "Confirmada";

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.petName}>{petName}</Text>
        <Text style={styles.infoText}>{dates}</Text>
        <Text style={styles.infoText}>{details}</Text>
      </View>

      <View
        style={[
          styles.badge,
          { backgroundColor: isConfirmada ? "#DCFCE7" : "#FEF9C2" },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            { color: isConfirmada ? "#008236" : "#A65F00" },
          ]}
        >
          {status}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.28,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    gap: 12,
  },
  textContainer: {
    gap: 4,
  },
  petName: {
    color: "#101828",
    fontSize: 14,
    fontWeight: "600",
  },
  infoText: {
    color: "#4A5565",
    fontSize: 12,
    fontWeight: "400",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ReservationItem;
