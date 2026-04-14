import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router"; // Añadimos useLocalSearchParams
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react"; // Añadimos useEffect
import {
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
// Componentes del proyecto
import CustomButton from "../components/CustomButton";
import Footer from "../components/Footer";
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";

// Activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const IconoAlerta = require("../../assets/IconoAlerta.webp");
const IconoCheck = require("../../assets/IconoCheck.webp");
const IconUpload = require("../../assets/IconUpload.webp");
const IconoVolver = require("../../assets/IconoVolver.webp");

interface PetFormData {
  nombre: string;
  tipo: string;
  raza: string;
  edad: string;
  sexo: string;
  tamano: string;
  foto: string;
  vacunado: boolean | null; // <-- Aquí permitimos ambos
  especificarVacunas: string;
  condicionesMedicas: boolean | null; // <-- Aquí también
  especificarCondiciones: string;
  vetNombre: string;
  vetTelefono: string;
  cuidados: string;
}

const RegisterPetScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id; // Booleano para saber si estamos editando

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    msg: "",
    icon: IconoCheck,
  });

  // Estado del formulario
  const initialFormState = {
    nombre: "",
    tipo: "",
    raza: "",
    edad: "",
    sexo: "",
    tamano: "",
    foto: "sample_url.jpg",
    vacunado: null,
    especificarVacunas: "",
    condicionesMedicas: null,
    especificarCondiciones: "",
    vetNombre: "",
    vetTelefono: "",
    cuidados: "",
  };

  const [formData, setFormData] = useState<PetFormData>(initialFormState);

  useEffect(() => {
    if (isEditing) {
      loadPetData();
    } else {
      // Si entramos a registrar (no hay ID), reseteamos al estado inicial
      setFormData(initialFormState);
    }
  }, [id]);

  const loadPetData = async () => {
    setLoading(true);
    try {
      const API_URL = API_BASE_URL;
      const petId = Array.isArray(id) ? id[0] : id;
      const response = await axios.get(`${API_URL}/api/pets/${petId}`);

      if (response.status === 200) {
        const data = response.data;
        setFormData({
          ...data,
          edad: data.edad ? data.edad.toString() : "",
          tamano: data.tamano || "",
          vetNombre: data.vetNombre || "",
          vetTelefono: data.vetTelefono || "",
          cuidados: data.cuidados || "",
        });
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      handleInputChange("foto", result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const camposIncompletos = Object.entries(formData).some(([key, value]) => {
      if (key === "foto") return false;
      if (value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    });

    if (camposIncompletos) {
      setModalConfig({
        title: "Formulario Incompleto",
        msg: "Por favor, completa todos los campos del formulario antes de continuar.",
        icon: IconoAlerta,
      });
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      console.log("Datos a enviar:", formData); // Debug: Ver qué datos se están enviando
      const API_URL = API_BASE_URL;

      let response;
      if (isEditing) {
        const petId = Array.isArray(id) ? id[0] : id;
        response = await axios.put(`${API_URL}/api/pets/${petId}`, formData);
      } else {
        const sessionStr =
          Platform.OS === "web"
            ? localStorage.getItem("userSession")
            : await SecureStore.getItemAsync("userSession");
        const user = JSON.parse(sessionStr || "{}");
        const payload = {
          ...formData,
          ownerId: user._id,
          foto: formData.foto,

          especificarVacunas: formData.vacunado
            ? formData.especificarVacunas
            : "Al día / No aplica",

          especificarCondiciones: formData.condicionesMedicas
            ? formData.especificarCondiciones
            : "Ninguna",
        };
        response = await axios.post(`${API_URL}/api/pets`, payload);
        console.log("Respuesta del servidor:", response); // Debug: Ver qué responde el servidor
      }

      if (response.status === 200 || response.status === 201) {
        if (!isEditing) {
          setFormData(initialFormState);
        }

        setModalConfig({
          title: isEditing ? "¡Actualizado!" : "¡Registrado!",
          msg: isEditing
            ? "Los cambios se guardaron correctamente."
            : "Mascota registrada con éxito. Ya puedes registrar otra o volver al inicio.",
          icon: IconoCheck,
        });
        setModalVisible(true);
      }
    } catch (error) {
      setModalConfig({
        title: "Error",
        msg: "Hubo un problema con el servidor.",
        icon: IconoAlerta,
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Image source={LogoutIcon} style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Image
              source={IconoVolver}
              style={styles.backIcon}
              resizeMode="contain"
            />
            <Text style={styles.mainTitle}>
              {isEditing ? "Editar Mascota" : "Registro de Mascota"}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing
                ? "Actualiza los datos de tu mascota"
                : "Completa los datos de tu mascota"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre de la mascota</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              placeholder="Nombre de la mascota"
              placeholderTextColor="rgba(10, 10, 10, 0.50)"
              onChangeText={(v) => handleInputChange("nombre", v)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo</Text>
            <TextInput
              style={styles.input}
              value={formData.tipo}
              placeholder="Perro, Gato, etc."
              placeholderTextColor="rgba(10, 10, 10, 0.50)"
              onChangeText={(v) => handleInputChange("tipo", v)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Raza</Text>
            <TextInput
              style={styles.input}
              value={formData.raza}
              placeholder="Raza de la mascota"
              placeholderTextColor="rgba(10, 10, 10, 0.50)"
              onChangeText={(v) => handleInputChange("raza", v)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Edad (años)</Text>
            <TextInput
              style={styles.input}
              value={formData.edad.toString()}
              placeholder="Edad de la mascota"
              keyboardType="numeric"
              placeholderTextColor="rgba(10, 10, 10, 0.50)"
              onChangeText={(v) => handleInputChange("edad", v)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tamaño</Text>
            <TextInput
              style={styles.input}
              value={formData.tamano}
              placeholder="Pequeño, Mediano, Grande"
              onChangeText={(v) => handleInputChange("tamano", v)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Fotografía de la mascota</Text>
            <TouchableOpacity
              style={styles.photoUploadContainer}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {formData.foto && formData.foto !== "sample_url.jpg" ? (
                <Image
                  source={{ uri: formData.foto }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Image
                    source={IconUpload}
                    style={styles.uploadIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.uploadText}>
                    Haz clic para subir la fotografía aquí
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.selectorRow}>
              <TouchableOpacity
                style={[
                  styles.selectorBtn,
                  formData.sexo === "Masculino" && styles.selectorBtnActive,
                ]}
                onPress={() => handleInputChange("sexo", "Masculino")}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.sexo === "Masculino" && styles.selectorTextActive,
                  ]}
                >
                  Macho
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectorBtn,
                  formData.sexo === "Femenino" && styles.selectorBtnActive,
                ]}
                onPress={() => handleInputChange("sexo", "Femenino")}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.sexo === "Femenino" && styles.selectorTextActive,
                  ]}
                >
                  Hembra
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECCIÓN: SALUD */}
          <Text style={styles.sectionTitle}>Estado de Salud</Text>

          {/* SECCIÓN VACUNAS */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>¿Tiene sus vacunas al día?</Text>
            <View style={styles.selectorRow}>
              <TouchableOpacity
                style={[
                  styles.selectorBtn,
                  formData.vacunado === true && styles.selectorBtnActive,
                ]}
                onPress={() => {
                  setFormData({
                    ...formData,
                    vacunado: true,
                    especificarVacunas: "",
                  });
                }}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.vacunado === true && styles.selectorTextActive,
                  ]}
                >
                  Sí
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectorBtn,
                  formData.vacunado === false && styles.selectorBtnActive,
                ]}
                onPress={() => {
                  setFormData({
                    ...formData,
                    vacunado: false,
                    especificarVacunas: "Al día / No aplica",
                  });
                }}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.vacunado === false && styles.selectorTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* INPUT CONDICIONAL VACUNAS: Solo visible si es TRUE */}
          {formData.vacunado === true && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Especificar vacunas</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Distemper, Parvovirus..."
                value={formData.especificarVacunas}
                onChangeText={(v) => handleInputChange("especificarVacunas", v)}
              />
            </View>
          )}

          {/* SECCIÓN CONDICIONES MÉDICAS */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>¿Tiene condiciones médicas?</Text>
            <View style={styles.selectorRow}>
              <TouchableOpacity
                style={[
                  styles.selectorBtn,
                  formData.condicionesMedicas === true &&
                    styles.selectorBtnActiveRed,
                ]}
                onPress={() => {
                  setFormData({
                    ...formData,
                    condicionesMedicas: true,
                    especificarCondiciones: "",
                  });
                }}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.condicionesMedicas === true &&
                      styles.selectorTextActive,
                  ]}
                >
                  Sí
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectorBtn,
                  formData.condicionesMedicas === false &&
                    styles.selectorBtnActive,
                ]}
                onPress={() => {
                  setFormData({
                    ...formData,
                    condicionesMedicas: false,
                    especificarCondiciones: "Ninguna",
                  });
                }}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.condicionesMedicas === false &&
                      styles.selectorTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* INPUT CONDICIONAL CONDICIONES: Solo visible si es TRUE */}
          {formData.condicionesMedicas === true && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Especificar condiciones</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Alergias, asma..."
                value={formData.especificarCondiciones}
                onChangeText={(v) =>
                  handleInputChange("especificarCondiciones", v)
                }
              />
            </View>
          )}

          {/* SECCIÓN: VETERINARIO */}
          <Text style={styles.sectionTitle}>Veterinario de Confianza</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={formData.vetNombre}
              placeholder="Dr. / Clínica"
              placeholderTextColor="#9CA3AF"
              onChangeText={(v) => handleInputChange("vetNombre", v)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.vetTelefono}
              placeholder="8888-8888"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
              onChangeText={(v) => handleInputChange("vetTelefono", v)}
            />
          </View>

          {/* SECCIÓN: CUIDADOS */}
          <Text style={styles.sectionTitle}>Cuidados Especiales</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Alimentación y notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.cuidados}
              multiline
              placeholder="Ej: Solo come alimento seco, 2 veces al día..."
              placeholderTextColor="#9CA3AF"
              onChangeText={(v) => handleInputChange("cuidados", v)}
            />
          </View>

          <View style={styles.buttonSection}>
            <CustomButton
              title={isEditing ? "Guardar Cambios" : "Registrar Mascota"}
              type="primary"
              onPress={handleSave}
            />
            <CustomButton
              title="Cancelar"
              type="danger"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>

      <LoadingModal visible={loading} />
      <SingleBtnModal
        visible={modalVisible}
        onConfirm={() => setModalVisible(false)}
        title={modalConfig.title}
        subtitle={modalConfig.msg}
        icon={modalConfig.icon}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB", // El background del contenedor principal en Figma
  },
  header: {
    width: "100%",
    backgroundColor: "#FFFFFF",
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
    color: "#101828", // Valor Figma: PetLodge
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    fontFamily: "Inter", // Si tienes la fuente instalada
    marginLeft: 8,
  },
  logoutIcon: { width: 20, height: 20, tintColor: "#4A5565" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  titleContainer: { marginBottom: 24 },
  mainTitle: {
    color: "#101828", // Registro de Mascota
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    fontFamily: "Inter",
  },
  subtitle: {
    color: "#4A5565", // Completa los datos...
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    fontFamily: "Inter",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: "#101828", // Información Básica / Salud / Vet / Cuidados
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    fontFamily: "Inter",
    marginTop: 20,
    marginBottom: 12,
  },
  fieldGroup: { marginBottom: 16 },
  label: {
    color: "#364153", // Labels de los campos
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    fontFamily: "Inter",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16, // Valor Figma para el texto placeholder/input
    color: "#0A0A0A",
    fontFamily: "Inter",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    lineHeight: 24, // Basado en cuidados especiales de Figma
  },
  selectorRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  selectorBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  selectorBtnActive: {
    backgroundColor: "#00A63E", // Azul primario para selecciones "Sí"
    borderColor: "#008236",
  },
  selectorBtnActiveRed: {
    backgroundColor: "#00A63E", // Rojo para selecciones de alerta
    borderColor: "#008236",
  },
  selectorText: {
    color: "#0A0A0A", // Color Sí/No sin seleccionar
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    fontFamily: "Inter",
  },
  selectorTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  buttonSection: {
    marginTop: 30,
    gap: 12,
  },
  photoUploadContainer: {
    alignSelf: "stretch",
    height: 166,
    borderRadius: 10,
    borderWidth: 1.28,
    borderColor: "#D1D5DC",
    borderStyle: "dashed", // Estilo Drag & Drop
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  uploadText: {
    color: "#4A5565", // Color Figma
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
    width: 190,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    marginBottom: 12, // Espaciado con el texto inferior
  },
  backButton: {
    marginRight: 12, // Espacio entre la flecha y el logo
    padding: 4, // Área de toque más amplia
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#101828", // Color oscuro para que combine con el título
  },
});

export default RegisterPetScreen;
