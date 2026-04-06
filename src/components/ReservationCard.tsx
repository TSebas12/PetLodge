import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButtonIcon from "./CustomButtonIcon";
import ReservationItem from "./ReservationItem";

const PlusIcon = require("../../assets/IconoPlus.webp");

const ActiveReservationsCard = () => {
  const reservations = [
    {
      id: 1,
      petName: "Max",
      dates: "Ingreso: 12/07/2024 - Salida: 17/07/2024",
      details: "Habitación 101 • Tipo: Estándar",
      status: "Confirmada" as const,
    },
    {
      id: 2,
      petName: "Luna",
      dates: "Ingreso: 20/07/2024 - Salida: 22/07/2024",
      details: "Habitación 203 • Tipo: Especial",
      status: "Pendiente" as const,
    },
  ];

  return (
    <View style={styles.mainCard}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Reservas Activas</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>Ver Todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {reservations.map((res) => (
          <ReservationItem
            key={res.id}
            petName={res.petName}
            dates={res.dates}
            details={res.details}
            status={res.status}
          />
        ))}
      </View>

      <View style={styles.buttonWrapper}>
        <CustomButtonIcon
          title="Nueva Reserva"
          onPress={() => console.log("Crear reserva")}
          icon={PlusIcon}
          type="secondary"
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
  },
});

export default ActiveReservationsCard;
