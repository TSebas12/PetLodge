import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API_BASE_URL from "../config/api";
import CustomButtonIcon from "./CustomButtonIcon";
import ReservationItem from "./ReservationItem";

const PlusIcon = require("../../assets/IconoPlus.webp");

interface ActiveReservationsCardProps {
  ownerId: string | undefined;
}

const ActiveReservationsCard = ({ ownerId }: ActiveReservationsCardProps) => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    if (!ownerId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/reservations/user/${ownerId}`,
      );
      // Tomamos solo las 2 más recientes para el Home
      setReservations(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return (
    <View style={styles.mainCard}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Reservas Recientes</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/bookings")}
        >
          <Text style={styles.seeAll}>Ver Todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator color="#00A63E" style={{ marginVertical: 20 }} />
        ) : reservations.length > 0 ? (
          reservations.map((res: any) => (
            <ReservationItem
              key={res._id}
              petName={res.petName}
              // Formateamos las fechas para que se vean bien
              dates={`Ingreso: ${new Date(
                res.fechaIngreso,
              ).toLocaleDateString()} - Salida: ${new Date(
                res.fechaSalida,
              ).toLocaleDateString()}`}
              details={`Habitación ${res.numeroHabitacion} • Tipo: ${res.tipoHospedaje}`}
              // Mapeamos el estado del backend al formato del componente
              status={
                res.estado === "activa" || res.estado === "confirmada"
                  ? "Confirmada"
                  : "Pendiente"
              }
            />
          ))
        ) : (
          <Text style={styles.noData}>No tienes reservas registradas.</Text>
        )}
      </View>

      <View style={styles.buttonWrapper}>
        <CustomButtonIcon
          title="Nueva Reserva"
          onPress={() => router.push("/newReservation")}
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
  noData: {
    textAlign: "center",
    color: "#667085",
    marginVertical: 10,
    fontSize: 14,
  },
});

export default ActiveReservationsCard;
