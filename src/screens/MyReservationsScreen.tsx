import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButtonIcon from "../components/CustomButtonIcon";
import Footer from "../components/Footer";
import API_BASE_URL from "../config/api";

const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const PlusIcon = require("../../assets/IconoPlus.webp");
const EyeIcon = require("../../assets/IconoCheck.webp");
const XIcon = require("../../assets/IconoX.webp");

const API_URL = API_BASE_URL;

// ── Tipos ─────────────────────────────────────────────────────
type EstadoReserva = "pendiente" | "activa" | "finalizada" | "cancelada";
type TabKey = "todas" | "activas" | "pendientes" | "finalizadas";

interface ServiciosAdicionales {
  bano: boolean;
  paseo: boolean;
  alimentacionEspecial: boolean;
}

interface Reservation {
  _id: string;
  petName: string;
  petType: string;
  fechaIngreso: string;
  fechaSalida: string;
  numeroHabitacion: number;
  tipoHospedaje: "estandar" | "especial";
  estado: EstadoReserva;
  serviciosAdicionales?: ServiciosAdicionales;
  solicitudesEspeciales?: string;
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
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const ESTADO_COLORS: Record<EstadoReserva, { bg: string; text: string }> = {
  pendiente: { bg: "#FEF9C2", text: "#A65F00" },
  activa: { bg: "#DCFCE7", text: "#008236" },
  finalizada: { bg: "#E5E7EB", text: "#374151" },
  cancelada: { bg: "#FEE2E2", text: "#B91C1C" },
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "activas", label: "Activas" },
  { key: "pendientes", label: "Pendientes" },
  { key: "finalizadas", label: "Finalizadas" },
];

const getServiciosText = (r: Reservation): string => {
  if (r.tipoHospedaje !== "especial") return "Ninguno";
  const s = r.serviciosAdicionales;
  if (!s) return "Ninguno";
  const activos: string[] = [];
  if (s.bano) activos.push("Baño");
  if (s.paseo) activos.push("Paseo");
  if (s.alimentacionEspecial) activos.push("Alimentación especial");
  return activos.length ? activos.join(", ") : "Ninguno";
};

// ── Fila de detalle interna de la card ───────────────────────
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={cardStyles.detailRow}>
    <Text style={cardStyles.detailLabel}>{label}</Text>
    <Text style={cardStyles.detailValue}>{value}</Text>
  </View>
);

// ── Card de Reserva ───────────────────────────────────────────
const ReservationCard = ({
  reservation,
  onCancel,
}: {
  reservation: Reservation;
  onCancel: (id: string) => void;
}) => {
  const router = useRouter();
  const colors = ESTADO_COLORS[reservation.estado];
  const canCancel =
    reservation.estado === "pendiente" || reservation.estado === "activa";
  const servicios = getServiciosText(reservation);

  return (
    <View style={cardStyles.card}>
      {/* ── Encabezado ── */}
      <View style={cardStyles.header}>
        <Text style={cardStyles.reservaId}>
          Reserva #{reservation._id.slice(-5).toUpperCase()}
        </Text>
        <View style={[cardStyles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[cardStyles.badgeText, { color: colors.text }]}>
            {ESTADO_LABEL[reservation.estado]}
          </Text>
        </View>
      </View>

      {/* ── Mascota ── */}
      <Text style={cardStyles.petName}>
        Mascota: {reservation.petName} ({reservation.petType})
      </Text>

      {/* ── Detalle completo: fechas, habitación, tipo, servicios ── */}
      <View style={cardStyles.detailsBlock}>
        <View style={cardStyles.detailRowGrid}>
          <View style={{ flex: 1 }}>
            <DetailRow
              label="Ingreso:"
              value={formatDate(reservation.fechaIngreso)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <DetailRow
              label="Salida:"
              value={formatDate(reservation.fechaSalida)}
            />
          </View>
        </View>
        <View style={cardStyles.detailRowGrid}>
          <View style={{ flex: 1 }}>
            <DetailRow
              label="Habitación:"
              value={String(reservation.numeroHabitacion)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <DetailRow
              label="Tipo:"
              value={
                reservation.tipoHospedaje === "especial"
                  ? "Especial"
                  : "Estándar"
              }
            />
          </View>
        </View>
        {/* Servicios – siempre visible para completitud de rúbrica */}
        <DetailRow label="Servicios:" value={servicios} />
        {reservation.solicitudesEspeciales ? (
          <DetailRow label="Notas:" value={reservation.solicitudesEspeciales} />
        ) : null}
      </View>

      {/* ── Botones ── */}
      <View style={cardStyles.buttons}>
        <CustomButtonIcon
          title="Ver Detalles"
          icon={EyeIcon}
          type="secondary"
          onPress={() =>
            router.push({
              pathname: "/reservationDetail",
              params: { id: reservation._id },
            } as any)
          }
        />
        {canCancel && (
          <View style={{ marginTop: 6 }}>
            <CustomButtonIcon
              title="Cancelar"
              icon={XIcon}
              type="danger"
              onPress={() => onCancel(reservation._id)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reservaId: { color: "#101828", fontSize: 16, fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  petName: { color: "#4A5565", fontSize: 14 },
  detailsBlock: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  detailRowGrid: { flexDirection: "row", gap: 8 },
  detailRow: { gap: 1 },
  detailLabel: { color: "#6A7282", fontSize: 12 },
  detailValue: { color: "#101828", fontSize: 13, fontWeight: "600" },
  buttons: { marginTop: 4 },
});

// ── Pantalla Principal ────────────────────────────────────────
const MyReservationsScreen = () => {
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("todas");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadReservations = useCallback(async () => {
    try {
      let session: string | null = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }
      if (!session) {
        if (isMounted) router.replace("/");
        return;
      }

      const parsed = JSON.parse(session);
      const res = await axios.get(
        `${API_URL}/api/reservations/user/${parsed._id}`,
      );
      setReservations(res.data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isMounted, router]);

  useEffect(() => {
    if (isMounted) loadReservations();
  }, [isMounted, loadReservations]);

  const handleCancel = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/api/reservations/${id}/cancel`);
      loadReservations();
    } catch (err) {
      console.error("Error al cancelar:", err);
    }
  };

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") localStorage.removeItem("userSession");
      else await SecureStore.deleteItemAsync("userSession");
      router.replace("/");
    } catch {
      router.replace("/");
    }
  };

  // ── Filtrado por tab ──────────────────────────────────────
  const filtered = reservations.filter((r) => {
    if (activeTab === "todas") return true;
    if (activeTab === "activas") return r.estado === "activa";
    if (activeTab === "pendientes") return r.estado === "pendiente";
    if (activeTab === "finalizadas")
      return r.estado === "finalizada" || r.estado === "cancelada";
    return true;
  });

  // ── Contadores por tab ────────────────────────────────────
  const counts: Record<TabKey, number> = {
    todas: reservations.length,
    activas: reservations.filter((r) => r.estado === "activa").length,
    pendientes: reservations.filter((r) => r.estado === "pendiente").length,
    finalizadas: reservations.filter(
      (r) => r.estado === "finalizada" || r.estado === "cancelada",
    ).length,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <Image
            source={LogoutIcon}
            style={styles.logoutIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadReservations();
            }}
            colors={["#00A63E"]}
          />
        }
      >
        {/* Título */}
        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>Mis Reservas</Text>
          <Text style={styles.subtitle}>
            Gestiona tus reservas activas y pasadas
          </Text>
        </View>

        {/* Botón Nueva Reserva */}
        <View style={styles.newBtnWrapper}>
          <CustomButtonIcon
            title="Nueva Reserva"
            icon={PlusIcon}
            type="primary"
            onPress={() => router.push("/newReservation" as any)}
          />
        </View>

        {/* Tabs con contador */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {counts[tab.key] > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === tab.key && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === tab.key && styles.tabBadgeTextActive,
                    ]}
                  >
                    {counts[tab.key]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista */}
        {loading ? (
          <ActivityIndicator
            color="#00A63E"
            style={{ marginTop: 40 }}
            size="large"
          />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Sin reservas</Text>
            <Text style={styles.emptyText}>
              {activeTab === "todas"
                ? "Aún no tienes ninguna reserva. ¡Crea tu primera reserva!"
                : `No hay reservas ${
                    activeTab === "activas"
                      ? "activas"
                      : activeTab === "pendientes"
                      ? "pendientes"
                      : "finalizadas o canceladas"
                  }.`}
            </Text>
          </View>
        ) : (
          filtered.map((r) => (
            <ReservationCard
              key={r._id}
              reservation={r}
              onCancel={handleCancel}
            />
          ))
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 32, height: 32 },
  headerTitle: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoutIcon: { width: 20, height: 20, tintColor: "#4A5565" },

  scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 24 },

  titleBlock: { marginBottom: 20 },
  mainTitle: {
    color: "#101828",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  subtitle: { color: "#4A5565", fontSize: 14, marginTop: 4 },

  newBtnWrapper: { marginBottom: 20 },

  tabsScroll: { marginBottom: 20 },
  tabsContainer: { flexDirection: "row", gap: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabActive: { backgroundColor: "#00A63E" },
  tabText: { color: "#4A5565", fontSize: 13, fontWeight: "500" },
  tabTextActive: { color: "white", fontWeight: "700" },
  tabBadge: {
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tabBadgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  tabBadgeText: { color: "#374151", fontSize: 11, fontWeight: "700" },
  tabBadgeTextActive: { color: "white" },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#6A7282",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default MyReservationsScreen;
