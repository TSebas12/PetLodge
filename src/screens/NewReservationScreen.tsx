import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../config/api";
import CustomButton from "../components/CustomButton";
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";

// Assets
const IconoVolver  = require("../../assets/IconoVolver.webp");
const IconoCheck   = require("../../assets/IconoCheck.webp");
const IconoAlerta  = require("../../assets/IconoAlerta.webp");
const CalendarIcon = require("../../assets/IconoCalendario.webp");

const API_URL = API_BASE_URL;

// ── Tipos ─────────────────────────────────────────────────────
interface Pet {
  _id: string;
  nombre: string;
  tipo: string;
}

const ADDITIONAL_SERVICES = [
  "Baño",
  "Paseo",
  "Alimentación especial",
  "Entretenimiento",
] as const;

// ── Componente: input de fecha con ícono ──────────────────────
const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.dateInputWrapper}>
      <Image
        source={CalendarIcon}
        style={styles.dateIcon}
        resizeMode="contain"
      />
      <TextInput
        style={styles.dateInput}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChange}
        keyboardType="default"
      />
    </View>
  </View>
);

// ── Componente: selector de dos opciones (botones) ────────────
const TwoOptionSelector = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.selectorRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          activeOpacity={0.7}
          onPress={() => onChange(opt)}
          style={[styles.selectorBtn, value === opt && styles.selectorBtnActive]}
        >
          <Text
            style={[
              styles.selectorText,
              value === opt && styles.selectorTextActive,
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ── Pantalla ──────────────────────────────────────────────────
const NewReservationScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  // Sesión y mascotas
  const [userId,      setUserId]      = useState<string | null>(null);
  const [pets,        setPets]        = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Campos del formulario
  const [formData, setFormData] = useState({
    petId:              "",
    checkIn:            "",
    checkOut:           "",
    roomType:           "",           // "Estándar" | "Especial"
    additionalServices: [] as string[],
    specialRequests:    "",
  });

  // UI
  const [loading,       setLoading]       = useState(false);
  const [modalVisible,  setModalVisible]  = useState(false);
  const [modalConfig,   setModalConfig]   = useState({
    title: "", msg: "", icon: IconoCheck,
  });

  // ── Carga inicial: sesión + mascotas + datos si editando ──
  const loadData = useCallback(async () => {
    try {
      let session: string | null = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }
      if (!session) { router.replace("/"); return; }

      const parsed = JSON.parse(session);
      setUserId(parsed._id);

      const res = await axios.get(`${API_URL}/api/pets/user/${parsed._id}`);
      setPets(res.data);

      // Si estamos editando, cargar datos de la reserva
      if (isEditing && id) {
        const resReservation = await axios.get(`${API_URL}/api/reservations/${id}`);
        const r = resReservation.data;
        setFormData({
          petId:              r.petId,
          checkIn:            r.fechaIngreso?.slice(0, 10) ?? "",
          checkOut:           r.fechaSalida?.slice(0, 10) ?? "",
          roomType:           r.tipoHospedaje === "especial" ? "Especial" : "Estándar",
          additionalServices: buildServicesArray(r.serviciosAdicionales),
          specialRequests:    r.solicitudesEspeciales ?? "",
        });
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoadingPets(false);
    }
  }, [router, isEditing, id]);

  useEffect(() => { loadData(); }, [loadData]);

  // Convierte el objeto de servicios del backend al array del form
  const buildServicesArray = (s?: {
    bano?: boolean;
    paseo?: boolean;
    alimentacionEspecial?: boolean;
  }): string[] => {
    if (!s) return [];
    const arr: string[] = [];
    if (s.bano)                 arr.push("Baño");
    if (s.paseo)                arr.push("Paseo");
    if (s.alimentacionEspecial) arr.push("Alimentación especial");
    return arr;
  };

  // ── Toggle de servicios adicionales ──────────────────────
  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service],
    }));
  };

  // ── Validación ───────────────────────────────────────────
  const validate = (): string | null => {
    if (!formData.petId)     return "Selecciona una mascota.";
    if (!formData.checkIn)   return "Ingresa la fecha de ingreso (YYYY-MM-DD).";
    if (!formData.checkOut)  return "Ingresa la fecha de salida (YYYY-MM-DD).";
    const ing = new Date(formData.checkIn);
    const sal = new Date(formData.checkOut);
    if (isNaN(ing.getTime())) return "Formato de fecha de ingreso inválido.";
    if (isNaN(sal.getTime())) return "Formato de fecha de salida inválido.";
    if (sal <= ing)           return "La fecha de salida debe ser posterior al ingreso.";
    if (!formData.roomType)   return "Selecciona el tipo de hospedaje.";
    return null;
  };

  // ── Envío ────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setModalConfig({ title: "Campos inválidos", msg: err, icon: IconoAlerta });
      setModalVisible(true);
      return;
    }

    const pet = pets.find((p) => p._id === formData.petId);
    if (!pet) return;

    const tipoHospedaje = formData.roomType === "Especial" ? "especial" : "estandar";

    try {
      setLoading(true);

      if (isEditing) {
        // Modificar reserva existente
        await axios.put(`${API_URL}/api/reservations/${id}`, {
          petId:   formData.petId,
          petName: pet.nombre,
          petType: pet.tipo,
          fechaIngreso:        formData.checkIn,
          fechaSalida:         formData.checkOut,
          tipoHospedaje,
          solicitudesEspeciales: formData.specialRequests,
          serviciosAdicionales: {
            bano:                formData.additionalServices.includes("Baño"),
            paseo:               formData.additionalServices.includes("Paseo"),
            alimentacionEspecial: formData.additionalServices.includes("Alimentación especial"),
          },
        });
        setModalConfig({
          title: "¡Cambios guardados!",
          msg:   `La reserva #${String(id).slice(-5).toUpperCase()} fue modificada.`,
          icon:  IconoCheck,
        });
      } else {
        // Nueva reserva
        await axios.post(`${API_URL}/api/reservations`, {
          ownerId: userId,
          petId:   formData.petId,
          petName: pet.nombre,
          petType: pet.tipo,
          fechaIngreso:         formData.checkIn,
          fechaSalida:          formData.checkOut,
          tipoHospedaje,
          solicitudesEspeciales: formData.specialRequests,
          serviciosAdicionales: {
            bano:                formData.additionalServices.includes("Baño"),
            paseo:               formData.additionalServices.includes("Paseo"),
            alimentacionEspecial: formData.additionalServices.includes("Alimentación especial"),
          },
        });
        setModalConfig({
          title: "¡Reserva creada!",
          msg:   "Tu solicitud fue registrada. Pronto recibirás una confirmación.",
          icon:  IconoCheck,
        });
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Error al procesar la reserva. Intenta de nuevo.";
      setModalConfig({ title: "Error", msg, icon: IconoAlerta });
    } finally {
      setLoading(false);
      setModalVisible(true);
    }
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    if (modalConfig.icon === IconoCheck) router.back();
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Image source={IconoVolver} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {isEditing ? "Modificar Reserva" : "Registro de Reserva"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing
              ? `Actualiza la información de la reserva #${String(id).slice(-5).toUpperCase()}`
              : "Completa la información para crear una nueva reserva"}
          </Text>
        </View>
      </View>

      {/* ── Formulario ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>

          {/* ── Sección: Información de la Reserva ── */}
          <Text style={styles.sectionTitle}>Información de la Reserva</Text>

          {/* Selector de Mascota */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mascota</Text>
            {loadingPets ? (
              <ActivityIndicator color="#00A63E" style={{ marginVertical: 8 }} />
            ) : pets.length === 0 ? (
              <View style={styles.noPetsBox}>
                <Text style={styles.noPetsText}>
                  No tienes mascotas registradas.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/(auth)/registerPet" as any)}
                >
                  <Text style={styles.noPetsLink}>Registrar mascota →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.petPickerContainer}>
                {/* "Seleccionar mascota" placeholder row */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, petId: "" }))
                  }
                  style={[
                    styles.petOption,
                    formData.petId === "" && styles.petOptionPlaceholder,
                  ]}
                >
                  <Text
                    style={[
                      styles.petOptionText,
                      formData.petId === "" && styles.petOptionTextPlaceholder,
                    ]}
                  >
                    Seleccionar mascota
                  </Text>
                </TouchableOpacity>
                {pets.map((pet) => (
                  <TouchableOpacity
                    key={pet._id}
                    activeOpacity={0.7}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, petId: pet._id }))
                    }
                    style={[
                      styles.petOption,
                      formData.petId === pet._id && styles.petOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.petOptionText,
                        formData.petId === pet._id && styles.petOptionTextActive,
                      ]}
                    >
                      {pet.nombre} ({pet.tipo})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ── Fechas en fila ── */}
          <View style={styles.datesRow}>
            <View style={{ flex: 1 }}>
              <DateInput
                label="Fecha de Ingreso"
                value={formData.checkIn}
                onChange={(v) => setFormData((p) => ({ ...p, checkIn: v }))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DateInput
                label="Fecha de Salida"
                value={formData.checkOut}
                onChange={(v) => setFormData((p) => ({ ...p, checkOut: v }))}
              />
            </View>
          </View>

          {/* ── Número de Habitación (deshabilitado) ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Número de Habitación</Text>
            <Text style={styles.fieldHint}>
              {isEditing
                ? "La habitación se reasignará si cambias las fechas"
                : "El sistema asignará automáticamente según disponibilidad"}
            </Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>
                Asignado automáticamente
              </Text>
            </View>
          </View>

          {/* ── Tipo de Hospedaje ── */}
          <TwoOptionSelector
            label="Tipo de Hospedaje"
            options={["Estándar", "Especial"]}
            value={formData.roomType}
            onChange={(v) =>
              setFormData((p) => ({
                ...p,
                roomType: v,
                // limpiar servicios si vuelve a estándar
                additionalServices: v === "Estándar" ? [] : p.additionalServices,
              }))
            }
          />

          {/* ── Servicios Adicionales (solo Especial) ── */}
          {formData.roomType === "Especial" && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Servicios Adicionales</Text>
              <Text style={styles.fieldHint}>
                Los servicios adicionales solo están disponibles en el
                hospedaje de tipo especial
              </Text>
              <View style={styles.checkboxList}>
                {ADDITIONAL_SERVICES.map((service) => {
                  const checked = formData.additionalServices.includes(service);
                  return (
                    <TouchableOpacity
                      key={service}
                      activeOpacity={0.7}
                      onPress={() => toggleService(service)}
                      style={styles.checkboxRow}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          checked && styles.checkboxChecked,
                        ]}
                      >
                        {checked && (
                          <Text style={styles.checkboxTick}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{service}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Solicitudes Especiales ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Solicitudes Especiales</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Ej: Necesita medicación, alergias, comportamiento especial..."
              placeholderTextColor="#9CA3AF"
              value={formData.specialRequests}
              onChangeText={(v) =>
                setFormData((p) => ({ ...p, specialRequests: v }))
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* ── Calendario de Disponibilidad ── */}
          <View style={styles.calendarBox}>
            <Text style={styles.calendarTitle}>
              Calendario de Disponibilidad
            </Text>
            <Text style={styles.calendarSubtitle}>
              El sistema verificará la disponibilidad de habitaciones para las
              fechas seleccionadas
            </Text>

            {/* Mini-calendario visual */}
            <View style={styles.calendarGrid}>
              {/* Cabecera días */}
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <View key={`h-${i}`} style={styles.calCell}>
                  <Text style={styles.calDayHeader}>{d}</Text>
                </View>
              ))}
              {/* Celdas de días */}
              {Array.from({ length: 28 }, (_, i) => {
                const isWeekend = i % 7 === 5 || i % 7 === 6;
                const isOccupied = i % 3 === 0 && !isWeekend;
                return (
                  <View
                    key={`d-${i}`}
                    style={[
                      styles.calCell,
                      isWeekend
                        ? styles.calCellWeekend
                        : isOccupied
                        ? styles.calCellOccupied
                        : styles.calCellFree,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calDayText,
                        isWeekend
                          ? styles.calTextWeekend
                          : isOccupied
                          ? styles.calTextOccupied
                          : styles.calTextFree,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Leyenda */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#86EFAC" }]} />
                <Text style={styles.legendText}>Disponible</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#FCA5A5" }]} />
                <Text style={styles.legendText}>Ocupada</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#D1D5DB" }]} />
                <Text style={styles.legendText}>Fin de semana</Text>
              </View>
            </View>
          </View>

          {/* ── Botones ── */}
          <View style={styles.buttonsRow}>
            <View style={{ flex: 1 }}>
              <CustomButton
                title="Cancelar"
                type="secondary"
                onPress={() => router.back()}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomButton
                title={isEditing ? "Guardar Cambios" : "Confirmar Reserva"}
                type="primary"
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modales */}
      <LoadingModal visible={loading} />
      <SingleBtnModal
        visible={modalVisible}
        title={modalConfig.title}
        subtitle={modalConfig.msg}
        icon={modalConfig.icon}
        onConfirm={handleModalConfirm}
      />
    </SafeAreaView>
  );
};

// ── Estilos ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },

  // ── Header ──────────────────────────────────────────────
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginTop: 2,
  },
  backIcon:      { width: 20, height: 20, tintColor: "#4A5565" },
  headerText:    { flex: 1 },
  headerTitle:   { color: "#101828", fontSize: 22, fontWeight: "700", lineHeight: 28 },
  headerSubtitle:{ color: "#4A5565", fontSize: 13, marginTop: 4, lineHeight: 18 },

  // ── Scroll / Card ────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    gap: 20,
  },

  // ── Sección ──────────────────────────────────────────────
  sectionTitle: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: -8, // compensa el gap del padre
  },

  // ── Campo genérico ───────────────────────────────────────
  fieldGroup: { gap: 6 },
  fieldLabel: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  fieldHint: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
  },

  // ── Input de fecha ───────────────────────────────────────
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 12,
    height: 48,
  },
  dateIcon:  { width: 18, height: 18, tintColor: "#9CA3AF", marginRight: 8 },
  dateInput: { flex: 1, fontSize: 14, color: "#101828" },
  datesRow:  { flexDirection: "row", gap: 12 },

  // ── Campo deshabilitado (habitación) ─────────────────────
  disabledInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  disabledInputText: { color: "#9CA3AF", fontSize: 14 },

  // ── Selector de tipo de hospedaje ────────────────────────
  selectorRow: { flexDirection: "row", gap: 10 },
  selectorBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
  },
  selectorBtnActive:  { backgroundColor: "#00A63E", borderColor: "#008236" },
  selectorText:       { color: "#374151", fontSize: 15, fontWeight: "500" },
  selectorTextActive: { color: "white",   fontWeight: "600" },

  // ── Lista de mascotas ────────────────────────────────────
  petPickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    overflow: "hidden",
  },
  petOption: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "white",
  },
  petOptionPlaceholder: { backgroundColor: "#F9FAFB" },
  petOptionActive:      { backgroundColor: "#DCFCE7" },
  petOptionText:        { color: "#6B7280", fontSize: 14 },
  petOptionTextPlaceholder: { color: "#9CA3AF", fontStyle: "italic" },
  petOptionTextActive:  { color: "#008236", fontWeight: "600" },

  // ── Sin mascotas ─────────────────────────────────────────
  noPetsBox: {
    backgroundColor: "#FEF9C2",
    borderRadius: 10,
    padding: 14,
    gap: 6,
  },
  noPetsText: { color: "#A65F00", fontSize: 14 },
  noPetsLink: { color: "#155DFC", fontSize: 14, fontWeight: "600" },

  // ── Checkboxes de servicios ──────────────────────────────
  checkboxList: { gap: 8 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "white",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkboxChecked: { backgroundColor: "#00A63E", borderColor: "#008236" },
  checkboxTick:    { color: "white", fontSize: 13, fontWeight: "700", lineHeight: 16 },
  checkboxLabel:   { color: "#374151", fontSize: 14, fontWeight: "400", flex: 1 },

  // ── Textarea ─────────────────────────────────────────────
  textarea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: "#101828",
    backgroundColor: "white",
    minHeight: 88,
    lineHeight: 20,
  },

  // ── Calendario de disponibilidad ─────────────────────────
  calendarBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  calendarTitle:    { color: "#1E3A8A", fontSize: 14, fontWeight: "700" },
  calendarSubtitle: { color: "#3B82F6", fontSize: 12, lineHeight: 18 },
  calendarGrid: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  calCell: {
    width: "12%",        // 7 columnas ≈ 100/7 ≈ 14%, usamos 12% + gap
    aspectRatio: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  calCellWeekend:  { backgroundColor: "#F3F4F6" },
  calCellOccupied: { backgroundColor: "#FEE2E2" },
  calCellFree:     { backgroundColor: "#DCFCE7" },
  calDayHeader:    { color: "#6B7280", fontSize: 10, fontWeight: "700" },
  calDayText:      { fontSize: 10, fontWeight: "500" },
  calTextWeekend:  { color: "#9CA3AF" },
  calTextOccupied: { color: "#EF4444" },
  calTextFree:     { color: "#16A34A" },

  // ── Leyenda del calendario ───────────────────────────────
  legend: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#374151", fontSize: 11 },

  // ── Botones de acción ────────────────────────────────────
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

export default NewReservationScreen;
