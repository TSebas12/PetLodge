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
  solicitudesEspeciales?: string;
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

const ESTADO_COLORS: Record<
  EstadoReserva,
  { bg: string; text: string; border: string }
> = {
  pendiente: { bg: "#FEF9C2", text: "#A65F00", border: "#FCD34D" },
  activa: { bg: "#DCFCE7", text: "#008236", border: "#86EFAC" },
  finalizada: { bg: "#E5E7EB", text: "#374151", border: "#D1D5DB" },
  cancelada: { bg: "#FEE2E2", text: "#B91C1C", border: "#FCA5A5" },
};

// ── Sección con título ────────────────────────────────────────
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={sectionStyles.container}>
    <Text style={sectionStyles.title}>{title}</Text>
    {children}
  </View>
);

const sectionStyles = StyleSheet.create({
  container: { gap: 10 },
  title: { color: "#101828", fontSize: 14, fontWeight: "700", marginBottom: 2 },
});

// ── Fila de dato ──────────────────────────────────────────────
const DataRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={rowStyles.container}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={[rowStyles.value, highlight && rowStyles.valueHighlight]}>
      {value}
    </Text>
  </View>
);

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  label: { color: "#6A7282", fontSize: 13, flex: 1 },
  value: {
    color: "#101828",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  valueHighlight: { color: "#00A63E" },
});

// ── Chip de servicio ──────────────────────────────────────────
const ServiceChip = ({ label }: { label: string }) => (
  <View style={chipStyles.chip}>
    <Text style={chipStyles.text}>{label}</Text>
  </View>
);

const chipStyles = StyleSheet.create({
  chip: {
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  text: { color: "#008236", fontSize: 12, fontWeight: "600" },
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
        const { data } = await axios.get(`${API_URL}/api/reservations/${id}`);
        setReservation(data);
      } catch {
        setError("No se pudo cargar el detalle de la reserva.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Servicios activos como array ──────────────────────────
  const getServiciosActivos = (r: Reservation): string[] => {
    if (r.tipoHospedaje !== "especial") return [];
    const s = r.serviciosAdicionales;
    if (!s) return [];
    const arr: string[] = [];
    if (s.bano) arr.push("Baño");
    if (s.paseo) arr.push("Paseo");
    if (s.alimentacionEspecial) arr.push("Alimentación especial");
    return arr;
  };

  // ── Calcular noches ───────────────────────────────────────
  const getNights = (r: Reservation): number => {
    const ing = new Date(r.fechaIngreso);
    const sal = new Date(r.fechaSalida);
    return Math.max(
      0,
      Math.round((sal.getTime() - ing.getTime()) / (1000 * 60 * 60 * 24)),
    );
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Detalle de Reserva</Text>
          <Text style={styles.headerSubtitle}>Todas tus reservas pasadas</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

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
          {/* ── Banner de Estado ── */}
          <View
            style={[
              styles.statusBanner,
              {
                backgroundColor: ESTADO_COLORS[reservation.estado].bg,
                borderColor: ESTADO_COLORS[reservation.estado].border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusBannerText,
                { color: ESTADO_COLORS[reservation.estado].text },
              ]}
            >
              Estado: {ESTADO_LABEL[reservation.estado]}
            </Text>
            <Text
              style={[
                styles.statusBannerSub,
                { color: ESTADO_COLORS[reservation.estado].text },
              ]}
            >
              Reserva #{reservation._id.slice(-5).toUpperCase()}
            </Text>
          </View>

          {/* ── Card principal ── */}
          <View style={styles.card}>
            {/* ── Sección: Mascota ── */}
            <Section title="Mascota">
              <DataRow label="Nombre:" value={reservation.petName} />
              <DataRow label="Tipo:" value={reservation.petType} />
            </Section>

            <View style={styles.divider} />

            {/* ── Sección: Fechas y Habitación ── */}
            <Section title="Fechas y Habitación">
              <DataRow
                label="Ingreso:"
                value={formatDate(reservation.fechaIngreso)}
              />
              <DataRow
                label="Salida:"
                value={formatDate(reservation.fechaSalida)}
              />
              <DataRow
                label="Noches:"
                value={`${getNights(reservation)} noches`}
              />
              <DataRow
                label="Habitación:"
                value={String(reservation.numeroHabitacion)}
                highlight
              />
              <DataRow
                label="Tipo de hospedaje:"
                value={
                  reservation.tipoHospedaje === "especial"
                    ? "Especial"
                    : "Estándar"
                }
              />
            </Section>

            <View style={styles.divider} />

            {/* ── Sección: Servicios Adicionales ── */}
            <Section title="Servicios Adicionales">
              {reservation.tipoHospedaje !== "especial" ? (
                <Text style={styles.noServicesText}>
                  No aplica — Hospedaje Estándar
                </Text>
              ) : getServiciosActivos(reservation).length === 0 ? (
                <Text style={styles.noServicesText}>Ninguno contratado</Text>
              ) : (
                <View style={styles.chipsRow}>
                  {getServiciosActivos(reservation).map((s) => (
                    <ServiceChip key={s} label={s} />
                  ))}
                </View>
              )}
            </Section>

            {/* ── Solicitudes especiales (si existen) ── */}
            {reservation.solicitudesEspeciales ? (
              <>
                <View style={styles.divider} />
                <Section title="Solicitudes Especiales">
                  <Text style={styles.notesText}>
                    {reservation.solicitudesEspeciales}
                  </Text>
                </Section>
              </>
            ) : null}

            <View style={styles.divider} />

            {/* ── Sección: Info de la solicitud ── */}
            <Section title="Información de Solicitud">
              <DataRow
                label="Fecha de solicitud:"
                value={formatDate(reservation.createdAt)}
              />
              <DataRow
                label="Estado actual:"
                value={ESTADO_LABEL[reservation.estado]}
              />
            </Section>
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
  headerCenter: { alignItems: "center", flex: 1 },
  headerTitle: { color: "#101828", fontSize: 18, fontWeight: "700" },
  headerSubtitle: { color: "#4A5565", fontSize: 12, marginTop: 2 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },

  errorBox: {
    margin: 24,
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
  },
  errorText: { color: "#B91C1C", fontSize: 14 },

  // Banner de estado
  statusBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  statusBannerText: { fontSize: 16, fontWeight: "700" },
  statusBannerSub: { fontSize: 13, opacity: 0.8 },

  // Card principal
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    gap: 16,
  },
  divider: { height: 1, backgroundColor: "#E5E7EB" },

  noServicesText: { color: "#9CA3AF", fontSize: 13, fontStyle: "italic" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  notesText: { color: "#374151", fontSize: 13, lineHeight: 20 },
});

export default ReservationDetailScreen;
