import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";
import API_BASE_URL from "../config/api";

const IconoVolver = require("../../assets/IconoVolver.webp");
const IconoCheck = require("../../assets/IconoCheck.webp");
const IconoAlerta = require("../../assets/IconoAlerta.webp");
const CalendarIcon = require("../../assets/IconoCalendario.webp");

const API_URL = API_BASE_URL;

const ADDITIONAL_SERVICES = [
  "Baño",
  "Paseo",
  "Alimentación especial",
  "Entretenimiento",
] as const;

type AvailStatus = "idle" | "checking" | "available" | "unavailable" | "error";

interface Pet {
  _id: string;
  nombre: string;
  tipo: string;
}

interface ModalState {
  visible: boolean;
  title: string;
  msg: string;
  success: boolean;
}

type CalendarCell =
  | { type: "empty" }
  | {
      type: "day";
      value: number;
      isWeekend: boolean;
      isToday: boolean;
      isoDate: string;
      isAvailable: boolean | null;
    };

const DateInput = ({
  label,
  value,
  onChange,
  onPressIcon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onPressIcon: () => void;
}) => {
  const webInputRef = useRef<any>(null); // Tipado como 'any' para evitar errores de TS

  const handleIconClick = () => {
    if (Platform.OS === "web") {
      const input = webInputRef.current;
      if (input) {
        // Intentamos abrir el calendario nativo
        if (typeof input.showPicker === "function") {
          input.showPicker();
        } else {
          input.focus();
        }
      }
    } else {
      onPressIcon();
    }
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.dateInputWrapper}>
        <TouchableOpacity onPress={handleIconClick} style={{ padding: 5 }}>
          <Image
            source={CalendarIcon}
            style={styles.dateIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {Platform.OS === "web" ? (
          <input
            ref={webInputRef}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              color: "#101828",
              fontFamily: "inherit",
              height: 40,
              paddingLeft: 8,
              cursor: "text",
              appearance: "none",
              WebkitAppearance: "none",
            }}
          />
        ) : (
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            keyboardType="default"
            autoCapitalize="none"
          />
        )}
      </View>
    </View>
  );
};

const DropdownField = ({
  label,
  placeholder,
  value,
  options,
  onSelect,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setOpen((prev) => !prev)}
          style={styles.dropdownTrigger}
        >
          <Text
            style={[
              styles.dropdownTriggerText,
              !value && styles.dropdownPlaceholderText,
            ]}
          >
            {value || placeholder}
          </Text>
          <Text style={styles.dropdownArrow}>{open ? "▴" : "▾"}</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownMenu}>
            {options.map((option, index) => {
              const selected = value === option;
              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  style={[
                    styles.dropdownOption,
                    selected && styles.dropdownOptionActive,
                    index === options.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      selected && styles.dropdownOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const getCalendarData = (
  baseDate = new Date(),
  availabilityMap: Record<string, boolean> = {},
) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();

  const daysInMonth = lastDay.getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ type: "empty" });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const jsDay = dateObj.getDay();
    const isWeekend = jsDay === 0 || jsDay === 6;
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;

    cells.push({
      type: "day",
      value: day,
      isWeekend,
      isToday,
      isoDate,
      isAvailable:
        availabilityMap[isoDate] === undefined
          ? null
          : availabilityMap[isoDate],
    });
  }

  return {
    monthLabel: firstDay.toLocaleDateString("es-CR", {
      month: "long",
      year: "numeric",
    }),
    cells,
  };
};

const NewReservationScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [notas, setNotas] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"ingreso" | "salida">("ingreso");

  const openDatePicker = (mode: "ingreso" | "salida") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/pets" as any);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      if (pickerMode === "ingreso") {
        setFormData((p) => ({ ...p, checkIn: formattedDate }));
      } else {
        setFormData((p) => ({ ...p, checkOut: formattedDate }));
      }
    }
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  const [formData, setFormData] = useState({
    petId: "",
    checkIn: "",
    checkOut: "",
    room: "",
    roomType: "",
    additionalServices: [] as string[],
    specialRequests: "",
  });

  const [availStatus, setAvailStatus] = useState<AvailStatus>("idle");
  const [availMessage, setAvailMessage] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: "",
    msg: "",
    success: false,
  });

  const [calendarBaseDate] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    Record<string, boolean>
  >({});
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const calendarData = useMemo(
    () => getCalendarData(calendarBaseDate, monthAvailability),
    [calendarBaseDate, monthAvailability],
  );

  const buildServicesArray = (s?: {
    bano?: boolean;
    paseo?: boolean;
    alimentacionEspecial?: boolean;
  }): string[] => {
    if (!s) return [];
    const arr: string[] = [];
    if (s.bano) arr.push("Baño");
    if (s.paseo) arr.push("Paseo");
    if (s.alimentacionEspecial) arr.push("Alimentación especial");
    return arr;
  };

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

      if (isEditing && id) {
        const { data: r } = await axios.get(
          `${API_URL}/api/reservations/${id}`,
        );

        setFormData({
          petId: r.petId,
          checkIn: r.fechaIngreso?.slice(0, 10) ?? "",
          checkOut: r.fechaSalida?.slice(0, 10) ?? "",
          room: String(r.numeroHabitacion ?? ""),
          roomType: r.tipoHospedaje === "especial" ? "Especial" : "Estándar",
          additionalServices: buildServicesArray(r.serviciosAdicionales),
          specialRequests: r.solicitudesEspeciales ?? "",
        });
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoadingPets(false);
    }
  }, [router, isEditing, id]);

  const loadMonthAvailability = useCallback(async () => {
    try {
      setLoadingCalendar(true);

      const year = calendarBaseDate.getFullYear();
      const month = calendarBaseDate.getMonth() + 1;

      const params: Record<string, string | number> = {
        year,
        month,
      };

      if (isEditing && id) {
        params.excludeId = String(id);
      }

      const { data } = await axios.get(
        `${API_URL}/api/reservations/month-availability`,
        { params },
      );

      setMonthAvailability(data.availability || {});
    } catch (error) {
      console.error("Error cargando disponibilidad mensual:", error);
      setMonthAvailability({});
    } finally {
      setLoadingCalendar(false);
    }
  }, [calendarBaseDate, isEditing, id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadMonthAvailability();
  }, [loadMonthAvailability]);

  const assignRoomAutomatically = useCallback(
    (checkIn: string, checkOut: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!checkIn || !checkOut) {
        setFormData((prev) => ({ ...prev, room: "" }));
        setAvailStatus("idle");
        setAvailMessage("");
        return;
      }

      const ing = new Date(checkIn);
      const sal = new Date(checkOut);

      if (isNaN(ing.getTime()) || isNaN(sal.getTime()) || sal <= ing) {
        setFormData((prev) => ({ ...prev, room: "" }));
        setAvailStatus("idle");
        setAvailMessage("");
        return;
      }

      setAvailStatus("checking");
      setAvailMessage("Buscando habitación disponible...");

      debounceRef.current = setTimeout(async () => {
        try {
          const params: Record<string, string> = { checkIn, checkOut };

          if (isEditing && id) {
            params.excludeId = String(id);
          }

          const { data } = await axios.get(
            `${API_URL}/api/reservations/first-available-room`,
            { params },
          );

          if (data.available && data.room) {
            setFormData((prev) => ({
              ...prev,
              room: String(data.room),
            }));
            setAvailStatus("available");
            setAvailMessage(
              `Habitación ${data.room} asignada automáticamente según disponibilidad.`,
            );
          } else {
            setFormData((prev) => ({ ...prev, room: "" }));
            setAvailStatus("unavailable");
            setAvailMessage(
              "No hay habitaciones disponibles para las fechas seleccionadas.",
            );
          }
        } catch (error: any) {
          const msg =
            error?.response?.data?.message ||
            "No se pudo verificar la disponibilidad.";
          setFormData((prev) => ({ ...prev, room: "" }));
          setAvailStatus("error");
          setAvailMessage(msg);
        }
      }, 500);
    },
    [isEditing, id],
  );

  useEffect(() => {
    assignRoomAutomatically(formData.checkIn, formData.checkOut);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.checkIn, formData.checkOut, assignRoomAutomatically]);

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service],
    }));
  };

  const validate = (): string | null => {
    if (!formData.petId) return "Selecciona una mascota.";
    if (!formData.checkIn) return "Ingresa la fecha de ingreso.";
    if (!formData.checkOut) return "Ingresa la fecha de salida.";

    const ing = new Date(formData.checkIn);
    const sal = new Date(formData.checkOut);

    if (isNaN(ing.getTime())) return "Formato de fecha de ingreso inválido.";
    if (isNaN(sal.getTime())) return "Formato de fecha de salida inválido.";
    if (sal <= ing) return "La fecha de salida debe ser posterior al ingreso.";

    if (!formData.room) {
      return "No hay una habitación disponible asignada para esas fechas.";
    }

    if (availStatus === "unavailable") {
      return "No hay habitaciones disponibles para esas fechas.";
    }

    if (availStatus === "checking") {
      return "Espera a que se verifique la disponibilidad.";
    }

    if (!formData.roomType) return "Selecciona el tipo de hospedaje.";

    return null;
  };

  const handleSubmit = async () => {
    const err = validate();

    if (err) {
      setModal({
        visible: true,
        title: "Campos inválidos",
        msg: err,
        success: false,
      });
      return;
    }

    const pet = pets.find((p) => p._id === formData.petId);
    if (!pet) return;

    const tipoHospedaje =
      formData.roomType === "Especial" ? "especial" : "estandar";

    const payload = {
      petId: formData.petId,
      petName: pet.nombre,
      petType: pet.tipo,
      fechaIngreso: formData.checkIn,
      fechaSalida: formData.checkOut,
      numeroHabitacion: Number(formData.room),
      tipoHospedaje,
      solicitudesEspeciales: formData.specialRequests,
      serviciosAdicionales: {
        bano: formData.additionalServices.includes("Baño"),
        paseo: formData.additionalServices.includes("Paseo"),
        alimentacionEspecial: formData.additionalServices.includes(
          "Alimentación especial",
        ),
      },
    };

    try {
      setLoading(true);

      if (isEditing) {
        await axios.put(`${API_URL}/api/reservations/${id}`, payload);
        setModal({
          visible: true,
          title: "¡Cambios guardados!",
          msg: `La reserva #${String(id)
            .slice(-5)
            .toUpperCase()} fue modificada exitosamente.`,
          success: true,
        });
      } else {
        await axios.post(`${API_URL}/api/reservations`, {
          ownerId: userId,
          ...payload,
        });
        setModal({
          visible: true,
          title: "¡Reserva creada!",
          msg: "Tu solicitud fue registrada. Pronto recibirás una confirmación.",
          success: true,
        });
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        "Error al procesar la reserva. Intenta de nuevo.";

      setModal({
        visible: true,
        title: "Error",
        msg,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setModal((prev) => ({ ...prev, visible: false }));
    if (modal.success) router.back();
  };

  const availIndicator = () => {
    if (availStatus === "idle") return null;
    if (availStatus === "checking") {
      return { color: "#6B7280", bg: "#F3F4F6", icon: "⏳" };
    }
    if (availStatus === "available") {
      return { color: "#008236", bg: "#DCFCE7", icon: "✓" };
    }
    if (availStatus === "unavailable") {
      return { color: "#B91C1C", bg: "#FEE2E2", icon: "✗" };
    }
    return { color: "#A65F00", bg: "#FEF9C2", icon: "⚠" };
  };

  const indic = availIndicator();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Image
              source={IconoVolver}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {isEditing ? "Modificar Reserva" : "Registro de Reserva"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditing
                ? `Actualiza la reserva #${String(id).slice(-5).toUpperCase()}`
                : "Completa la información para crear una nueva reserva"}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Información de la Reserva</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mascota</Text>
              {loadingPets ? (
                <ActivityIndicator
                  color="#00A63E"
                  style={{ marginVertical: 8 }}
                />
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
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setFormData((p) => ({ ...p, petId: "" }))}
                    style={[
                      styles.petOption,
                      formData.petId === "" && styles.petOptionPlaceholder,
                    ]}
                  >
                    <Text
                      style={[
                        styles.petOptionText,
                        formData.petId === "" &&
                          styles.petOptionTextPlaceholder,
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
                        setFormData((p) => ({ ...p, petId: pet._id }))
                      }
                      style={[
                        styles.petOption,
                        formData.petId === pet._id && styles.petOptionActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.petOptionText,
                          formData.petId === pet._id &&
                            styles.petOptionTextActive,
                        ]}
                      >
                        {pet.nombre} ({pet.tipo})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.datesColumn}>
              <DateInput
                label="Fecha de Ingreso"
                value={formData.checkIn}
                onChange={(v) => setFormData((p) => ({ ...p, checkIn: v }))}
                onPressIcon={() => openDatePicker("ingreso")}
              />

              <DateInput
                label="Fecha de Salida"
                value={formData.checkOut}
                onChange={(v) => setFormData((p) => ({ ...p, checkOut: v }))}
                onPressIcon={() => openDatePicker("salida")}
              />
            </View>

            {showPicker &&
              (Platform.OS === "web" ? null : (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              ))}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Número de Habitación</Text>
              <Text style={styles.fieldHint}>
                El sistema asignará automáticamente según disponibilidad.
              </Text>

              <View style={styles.autoRoomInput}>
                <Text
                  style={[
                    styles.autoRoomText,
                    !formData.room && styles.autoRoomPlaceholder,
                  ]}
                >
                  {formData.room
                    ? `Habitación ${formData.room}`
                    : "Asignado automáticamente"}
                </Text>
              </View>

              {indic && (
                <View
                  style={[styles.availBadge, { backgroundColor: indic.bg }]}
                >
                  <Text style={[styles.availBadgeText, { color: indic.color }]}>
                    {indic.icon} {availMessage}
                  </Text>
                  {availStatus === "checking" && (
                    <ActivityIndicator
                      size="small"
                      color={indic.color}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>
              )}
            </View>

            <DropdownField
              label="Tipo de Hospedaje"
              placeholder="Seleccionar tipo"
              options={["Estándar", "Especial"]}
              value={formData.roomType}
              onSelect={(v) =>
                setFormData((p) => ({
                  ...p,
                  roomType: v,
                  additionalServices:
                    v === "Estándar" ? [] : p.additionalServices,
                }))
              }
            />

            {formData.roomType === "Especial" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Servicios Adicionales</Text>
                <Text style={styles.fieldHint}>
                  Solo disponibles en hospedaje de tipo Especial.
                </Text>

                <View style={styles.checkboxList}>
                  {ADDITIONAL_SERVICES.map((service) => {
                    const checked =
                      formData.additionalServices.includes(service);

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

            <View style={styles.calendarBox}>
              <Text style={styles.calendarTitle}>
                Calendario de Disponibilidad
              </Text>
              <Text style={styles.calendarSubtitle}>
                El sistema verificará la disponibilidad de habitaciones para las
                fechas seleccionadas.
              </Text>

              <Text style={styles.calendarMonthLabel}>
                {calendarData.monthLabel.charAt(0).toUpperCase() +
                  calendarData.monthLabel.slice(1)}
              </Text>

              {loadingCalendar ? (
                <ActivityIndicator
                  color="#2563EB"
                  style={{ marginVertical: 12 }}
                />
              ) : (
                <View style={styles.calendarGrid}>
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <View key={`h-${i}`} style={styles.calCell}>
                      <Text style={styles.calDayHeader}>{d}</Text>
                    </View>
                  ))}

                  {calendarData.cells.map((cell, i) => {
                    if (cell.type === "empty") {
                      return <View key={`empty-${i}`} style={styles.calCell} />;
                    }

                    const isOccupied = cell.isAvailable === false;
                    const isFree = cell.isAvailable === true;

                    return (
                      <View
                        key={cell.isoDate}
                        style={[
                          styles.calCell,
                          isOccupied
                            ? styles.calCellOccupied
                            : cell.isWeekend
                            ? styles.calCellWeekend
                            : isFree
                            ? styles.calCellFree
                            : styles.calCellNeutral,
                          cell.isToday && styles.calCellToday,
                        ]}
                      >
                        <Text
                          style={[
                            styles.calDayText,
                            isOccupied
                              ? styles.calTextOccupied
                              : cell.isWeekend
                              ? styles.calTextWeekend
                              : isFree
                              ? styles.calTextFree
                              : styles.calTextNeutral,
                            cell.isToday && styles.calTextToday,
                          ]}
                        >
                          {cell.value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              <View style={styles.legend}>
                {[
                  { color: "#86EFAC", label: "Disponible" },
                  { color: "#FCA5A5", label: "No disponible" },
                  { color: "#D1D5DB", label: "Fin de semana" },
                  { color: "#DBEAFE", label: "Hoy" },
                ].map((l) => (
                  <View key={l.label} style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: l.color }]}
                    />
                    <Text style={styles.legendText}>{l.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.buttonsRow}>
              <View style={{ flex: 1 }}>
                <CustomButton
                  title="Cancelar"
                  type="danger"
                  onPress={handleBack}
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
      </KeyboardAvoidingView>

      <LoadingModal visible={loading} />

      <SingleBtnModal
        visible={modal.visible}
        title={modal.title}
        subtitle={modal.msg}
        icon={modal.success ? IconoCheck : IconoAlerta}
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
  backIcon: { width: 20, height: 20, tintColor: "#4A5565" },
  headerText: { flex: 1 },
  headerTitle: {
    color: "#101828",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  headerSubtitle: {
    color: "#4A5565",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
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
  sectionTitle: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: -8,
  },

  fieldGroup: { gap: 6 },
  fieldLabel: { color: "#374151", fontSize: 14, fontWeight: "500" },
  fieldHint: { color: "#6B7280", fontSize: 12, lineHeight: 16 },

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
  dateIcon: { width: 18, height: 18, tintColor: "#9CA3AF", marginRight: 8 },
  dateInput: { flex: 1, fontSize: 14, color: "#101828" },
  datesColumn: { gap: 14 },

  autoRoomInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  autoRoomText: {
    color: "#101828",
    fontSize: 14,
    fontWeight: "500",
  },
  autoRoomPlaceholder: {
    color: "#9CA3AF",
  },

  availBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  availBadgeText: { fontSize: 13, fontWeight: "600", flex: 1 },

  dropdownContainer: {
    position: "relative",
    zIndex: 20,
  },
  dropdownTrigger: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTriggerText: {
    fontSize: 14,
    color: "#101828",
  },
  dropdownPlaceholderText: {
    color: "#9CA3AF",
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "white",
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownOptionActive: {
    backgroundColor: "#DCFCE7",
  },
  dropdownOptionText: {
    color: "#374151",
    fontSize: 14,
  },
  dropdownOptionTextActive: {
    color: "#008236",
    fontWeight: "600",
  },

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
  petOptionActive: { backgroundColor: "#DCFCE7" },
  petOptionText: { color: "#6B7280", fontSize: 14 },
  petOptionTextPlaceholder: { color: "#9CA3AF", fontStyle: "italic" },
  petOptionTextActive: { color: "#008236", fontWeight: "600" },

  noPetsBox: {
    backgroundColor: "#FEF9C2",
    borderRadius: 10,
    padding: 14,
    gap: 6,
  },
  noPetsText: { color: "#A65F00", fontSize: 14 },
  noPetsLink: { color: "#155DFC", fontSize: 14, fontWeight: "600" },

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
  checkboxTick: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  checkboxLabel: { color: "#374151", fontSize: 14, flex: 1 },

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

  calendarBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  calendarTitle: { color: "#1E3A8A", fontSize: 14, fontWeight: "700" },
  calendarSubtitle: { color: "#3B82F6", fontSize: 12, lineHeight: 18 },
  calendarMonthLabel: {
    color: "#1E3A8A",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: -4,
  },
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
    width: "12%",
    aspectRatio: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  calCellWeekend: { backgroundColor: "#F3F4F6" },
  calCellOccupied: { backgroundColor: "#FEE2E2" },
  calCellFree: { backgroundColor: "#DCFCE7" },
  calCellNeutral: { backgroundColor: "#F9FAFB" },
  calCellToday: {
    borderWidth: 1,
    borderColor: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  calDayHeader: { color: "#6B7280", fontSize: 10, fontWeight: "700" },
  calDayText: { fontSize: 10, fontWeight: "500" },
  calTextWeekend: { color: "#9CA3AF" },
  calTextOccupied: { color: "#EF4444" },
  calTextFree: { color: "#16A34A" },
  calTextNeutral: { color: "#94A3B8" },
  calTextToday: { color: "#1D4ED8", fontWeight: "700" },

  legend: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#374151", fontSize: 11 },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

export default NewReservationScreen;
