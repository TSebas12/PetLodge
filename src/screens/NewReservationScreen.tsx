import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import SingleBtnModal from "../components/modals/SingleBtnModal";
import API_BASE_URL from "../config/api";

const BackIcon = require("../../assets/IconoVolver.webp");
const CalendarIcon = require("../../assets/IconoCalendario.webp");
const CheckIcon = require("../../assets/IconoCheck.webp");
const AlertIcon = require("../../assets/IconoAlerta.webp");

const API_URL = API_BASE_URL;

// ── Tipos ─────────────────────────────────────────────────────
interface Pet {
  _id: string;
  nombre: string;
  tipo: string;
}

interface ModalState {
  visible: boolean;
  title: string;
  subtitle: string;
  success: boolean;
}

// ── Selector de Mascota ───────────────────────────────────────
const PetSelector = ({
  pets,
  selected,
  onSelect,
}: {
  pets: Pet[];
  selected: string;
  onSelect: (id: string) => void;
}) => (
  <View style={selectorStyles.container}>
    {pets.map((pet) => (
      <TouchableOpacity
        key={pet._id}
        activeOpacity={0.7}
        onPress={() => onSelect(pet._id)}
        style={[
          selectorStyles.option,
          selected === pet._id && selectorStyles.optionActive,
        ]}
      >
        <Text
          style={[
            selectorStyles.text,
            selected === pet._id && selectorStyles.textActive,
          ]}
        >
          {pet.nombre} ({pet.tipo})
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const selectorStyles = StyleSheet.create({
  container: { gap: 8, marginBottom: 16 },
  option: {
    borderWidth: 1,
    borderColor: "#D1D5DC",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  optionActive: { borderColor: "#00A63E", backgroundColor: "#DCFCE7" },
  text: { color: "#4A5565", fontSize: 15, fontWeight: "400" },
  textActive: { color: "#008236", fontWeight: "600" },
});

// ── Selector de Tipo de Hospedaje ─────────────────────────────
const HospedajeSelector = ({
  value,
  onChange,
}: {
  value: "estandar" | "especial";
  onChange: (v: "estandar" | "especial") => void;
}) => (
  <View style={hospStyles.row}>
    {(["estandar", "especial"] as const).map((tipo) => (
      <TouchableOpacity
        key={tipo}
        activeOpacity={0.7}
        onPress={() => onChange(tipo)}
        style={[hospStyles.btn, value === tipo && hospStyles.btnActive]}
      >
        <Text
          style={[
            hospStyles.btnText,
            value === tipo && hospStyles.btnTextActive,
          ]}
        >
          {tipo === "estandar" ? "Estándar" : "Especial"}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const hospStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DC",
    alignItems: "center",
    backgroundColor: "white",
  },
  btnActive: { borderColor: "#00A63E", backgroundColor: "#DCFCE7" },
  btnText: { color: "#4A5565", fontSize: 15, fontWeight: "500" },
  btnTextActive: { color: "#008236", fontWeight: "700" },
});

// ── Fila de Switch para servicio adicional ────────────────────
const ServiceRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <View style={switchStyles.row}>
    <Text style={switchStyles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "#E5E7EB", true: "#DCFCE7" }}
      thumbColor={value ? "#00A63E" : "#9CA3AF"}
    />
  </View>
);

const switchStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  label: { color: "#101828", fontSize: 15, fontWeight: "500" },
});

// ── Pantalla ──────────────────────────────────────────────────
const NewReservationScreen = () => {
  const router = useRouter();

  // Sesión y mascotas
  const [userId, setUserId] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Campos del formulario
  const [selectedPetId, setSelectedPetId] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [numeroHabitacion, setNumeroHabitacion] = useState("");
  const [tipoHospedaje, setTipoHospedaje] = useState<"estandar" | "especial">(
    "estandar",
  );

  // Servicios adicionales
  const [bano, setBano] = useState(false);
  const [paseo, setPaseo] = useState(false);
  const [alimentacionEspecial, setAlimentacionEspecial] = useState(false);

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: "",
    subtitle: "",
    success: false,
  });

  // ── Cargar datos de sesión y mascotas ────────────────────
  const loadData = useCallback(async () => {
    try {
      let session: string | null = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }
      if (!session) {
        router.replace("/");
        return;
      }

      const parsed = JSON.parse(session);
      setUserId(parsed._id);

      const res = await axios.get(`${API_URL}/api/pets/user/${parsed._id}`);
      setPets(res.data);
    } catch (err) {
      console.error("Error al cargar mascotas:", err);
    } finally {
      setLoadingPets(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset servicios al cambiar a estándar
  useEffect(() => {
    if (tipoHospedaje === "estandar") {
      setBano(false);
      setPaseo(false);
      setAlimentacionEspecial(false);
    }
  }, [tipoHospedaje]);

  // ── Validación ───────────────────────────────────────────
  const validate = (): string | null => {
    if (!selectedPetId) return "Selecciona una mascota.";
    if (!fechaIngreso) return "Ingresa la fecha de ingreso (YYYY-MM-DD).";
    if (!fechaSalida) return "Ingresa la fecha de salida (YYYY-MM-DD).";
    const ing = new Date(fechaIngreso);
    const sal = new Date(fechaSalida);
    if (isNaN(ing.getTime()))
      return "Formato de fecha de ingreso inválido (YYYY-MM-DD).";
    if (isNaN(sal.getTime()))
      return "Formato de fecha de salida inválido (YYYY-MM-DD).";
    if (sal <= ing) return "La fecha de salida debe ser posterior al ingreso.";
    if (!numeroHabitacion || isNaN(Number(numeroHabitacion)))
      return "Ingresa un número de habitación válido.";
    return null;
  };

  // ── Envío ────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setModal({
        visible: true,
        title: "Campos inválidos",
        subtitle: err,
        success: false,
      });
      return;
    }

    const pet = pets.find((p) => p._id === selectedPetId);
    if (!pet) return;

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/api/reservations`, {
        ownerId: userId,
        petId: selectedPetId,
        petName: pet.nombre,
        petType: pet.tipo,
        fechaIngreso,
        fechaSalida,
        numeroHabitacion: Number(numeroHabitacion),
        tipoHospedaje,
        serviciosAdicionales: { bano, paseo, alimentacionEspecial },
      });
      setModal({
        visible: true,
        title: "¡Reserva creada!",
        subtitle:
          "Tu solicitud fue registrada. Pronto recibirás una confirmación.",
        success: true,
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        "Error al crear la reserva. Intenta de nuevo.";
      setModal({
        visible: true,
        title: "Error",
        subtitle: msg,
        success: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cuando el usuario cierra el modal de éxito vuelve atrás
  const handleModalConfirm = () => {
    setModal((prev) => ({ ...prev, visible: false }));
    if (modal.success) router.back();
  };

  // ── Render ───────────────────────────────────────────────
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
        <Text style={styles.headerTitle}>Nueva Reserva</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Mascota ── */}
        <Text style={styles.sectionLabel}>Mascota *</Text>
        {loadingPets ? (
          <ActivityIndicator color="#00A63E" style={{ marginBottom: 16 }} />
        ) : pets.length === 0 ? (
          <View style={styles.noPetsBox}>
            <Text style={styles.noPetsText}>
              No tienes mascotas registradas. Registra una primero para hacer
              una reserva.
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/registerPet" as any)}
            >
              <Text style={styles.noPetsLink}>Registrar mascota →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <PetSelector
            pets={pets}
            selected={selectedPetId}
            onSelect={setSelectedPetId}
          />
        )}

        {/* ── Fechas ── */}
        <CustomInput
          label="Fecha de Ingreso *"
          placeholder="YYYY-MM-DD"
          icon={CalendarIcon}
          value={fechaIngreso}
          onChangeText={setFechaIngreso}
        />
        <CustomInput
          label="Fecha de Salida *"
          placeholder="YYYY-MM-DD"
          icon={CalendarIcon}
          value={fechaSalida}
          onChangeText={setFechaSalida}
        />

        {/* ── Habitación ── */}
        <CustomInput
          label="Número de Habitación *"
          placeholder="Ej. 101"
          value={numeroHabitacion}
          onChangeText={setNumeroHabitacion}
          keyboardType="numeric"
        />

        {/* ── Tipo de Hospedaje ── */}
        <Text style={styles.sectionLabel}>Tipo de Hospedaje *</Text>
        <HospedajeSelector value={tipoHospedaje} onChange={setTipoHospedaje} />

        {/* ── Servicios Adicionales (solo Especial) ── */}
        {tipoHospedaje === "especial" ? (
          <View style={styles.serviciosSection}>
            <Text style={styles.sectionLabel}>Servicios Adicionales</Text>
            <Text style={styles.serviciosHint}>
              Disponibles únicamente en hospedaje de tipo Especial.
            </Text>
            <ServiceRow label="Baño" value={bano} onChange={setBano} />
            <ServiceRow label="Paseo" value={paseo} onChange={setPaseo} />
            <ServiceRow
              label="Alimentación Especial"
              value={alimentacionEspecial}
              onChange={setAlimentacionEspecial}
            />
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ℹ️ Los servicios adicionales (baño, paseo, alimentación especial)
              solo están disponibles en el hospedaje de tipo{" "}
              <Text style={{ fontWeight: "700" }}>Especial</Text>.
            </Text>
          </View>
        )}

        {/* ── Botón de envío ── */}
        <View style={styles.submitWrapper}>
          {submitting ? (
            <ActivityIndicator color="#00A63E" size="large" />
          ) : (
            <CustomButton
              title="Crear Reserva"
              type="primary"
              onPress={handleSubmit}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal de resultado */}
      <SingleBtnModal
        visible={modal.visible}
        title={modal.title}
        subtitle={modal.subtitle}
        icon={modal.success ? CheckIcon : AlertIcon}
        onConfirm={handleModalConfirm}
      />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    color: "#364153",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  noPetsBox: {
    backgroundColor: "#FEF9C2",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  noPetsText: { color: "#A65F00", fontSize: 14 },
  noPetsLink: { color: "#155DFC", fontSize: 14, fontWeight: "600" },
  serviciosSection: { marginBottom: 16, gap: 4 },
  serviciosHint: { color: "#6A7282", fontSize: 12, marginBottom: 10 },
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoText: { color: "#1D4ED8", fontSize: 13, lineHeight: 20 },
  submitWrapper: { marginTop: 8 },
});

export default NewReservationScreen;
