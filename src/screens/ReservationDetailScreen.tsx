import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../config/api";

const BackIcon = require("../../assets/IconoVolver.webp");

const API_URL = API_BASE_URL;

// ── Tipos ─────────────────────────────────────────────────────
type EstadoReserva = "pendiente" | "activa" | "finalizada" | "cancelada";

interface Reservation {
  _id: string;
  petName: string;
  petType: string;
  fechaIngreso: string;
  fechaSalida: string;
  numeroHabitacion: number;
  tipoHospedaje: "estandar" | "especial";
  estado: EstadoReserva;
  serviciosAdicionales?: {
    bano: boolean;
    paseo: boolean;
    alimentacionEspecial: boolean;
  };
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const ESTADO_LABEL: Record<EstadoReserva, string> = {
  pendiente: "Pendiente",
  activa: "Activa",
  finalizada: "Completada",
  cancelada: "Cancelada",
};

const ESTADO_COLORS: Record<EstadoReserva, { bg: string; text: string }> = {
  pendiente: { bg: "#FEF9C2", text: "#A65F00" },
  activa: { bg: "#DCFCE7", text: "#008236" },
  finalizada: { bg: "#E5E7EB", text: "#374151" },
  cancelada: { bg: "#FEE2E2", text: "#B91C1C" },
};

// ── Fila de detalle ───────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={rowStyles.container}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={rowStyles.value}>{value}</Text>
  </View>
);

const rowStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 2,
  },
  label: { color: "#6A7282", fontSize: 13 },
  value: { color: "#101828", fontSize: 15, fontWeight: "600" },
});

// ── Pantalla ──────────────────────────────────────────────────
const ReservationDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) {
          setError("ID de reserva no encontrado.");
          return;
        }
        const res = await axios.get(`${API_URL}/api/reservations/${id}`);
        setReservation(res.data);
      } catch {
        setError("No se pudo cargar el detalle de la reserva.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Texto de servicios adicionales
  const getServiciosText = (r: Reservation): string => {
    if (r.tipoHospedaje !== "especial") return "N/A (Hospedaje Estándar)";
    const s = r.serviciosAdicionales;
    if (!s) return "Ninguno";
    const activos: string[] = [];
    if (s.bano) activos.push("Baño");
    if (s.paseo) activos.push("Paseo");
    if (s.alimentacionEspecial) activos.push("Alimentación Especial");
    return activos.length ? activos.join(", ") : "Ninguno";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Image
            source={BackIcon}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Reservas</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.headerSubtitle}>Todas tus reservas pasadas</Text>

      {/* Contenido */}
      {loading ? (
        <ActivityIndicator
          color="#00A63E"
          style={{ marginTop: 60 }}
          size="large"
        />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : reservation ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Encabezado de la card */}
            <View style={styles.cardHeader}>
              <Text style={styles.reservaId}>
                Reserva #{reservation._id.slice(-5).toUpperCase()}
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: ESTADO_COLORS[reservation.estado].bg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: ESTADO_COLORS[reservation.estado].text },
                  ]}
                >
                  {ESTADO_LABEL[reservation.estado]}
                </Text>
              </View>
            </View>

            <Text style={styles.petName}>
              Mascota: {reservation.petName} ({reservation.petType})
            </Text>

            {/* Detalles */}
            <View style={styles.detailsBlock}>
              <DetailRow
                label="Ingreso:"
                value={formatDate(reservation.fechaIngreso)}
              />
              <DetailRow
                label="Salida:"
                value={formatDate(reservation.fechaSalida)}
              />
              <DetailRow
                label="Habitación:"
                value={String(reservation.numeroHabitacion)}
              />
              <DetailRow
                label="Tipo:"
                value={
                  reservation.tipoHospedaje === "especial"
                    ? "Especial"
                    : "Estándar"
                }
              />
              <DetailRow
                label="Servicios adicionales:"
                value={getServiciosText(reservation)}
              />
              <DetailRow
                label="Estado:"
                value={ESTADO_LABEL[reservation.estado]}
              />
              <DetailRow
                label="Fecha de solicitud:"
                value={formatDate(reservation.createdAt)}
              />
            </View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backIcon: { width: 24, height: 24, tintColor: "#101828" },
  headerTitle: { color: "#101828", fontSize: 18, fontWeight: "700" },
  headerSubtitle: {
    color: "#4A5565",
    fontSize: 13,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  errorBox: {
    margin: 24,
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
  },
  errorText: { color: "#B91C1C", fontSize: 14 },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reservaId: { color: "#101828", fontSize: 17, fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  petName: { color: "#4A5565", fontSize: 14 },
  detailsBlock: {},
});

export default ReservationDetailScreen;
