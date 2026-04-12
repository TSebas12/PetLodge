import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footer";
import NotificationItem from "../components/NotificationItem";
import API_BASE_URL from "../config/api";
import type { AppNotification } from "../types/notifications";

const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");

interface SessionUser {
  _id: string;
  fullName?: string;
  email?: string;
}

const NotificationsScreen = () => {
  const router = useRouter();
  const hasLoadedOnceRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<SessionUser | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const getStoredSession = useCallback(async () => {
    if (Platform.OS === "web") {
      const rawSession = localStorage.getItem("userSession");
      return rawSession ? (JSON.parse(rawSession) as SessionUser) : null;
    }

    const rawSession = await SecureStore.getItemAsync("userSession");
    return rawSession ? (JSON.parse(rawSession) as SessionUser) : null;
  }, []);

  const syncNotificationsAsRead = useCallback(
    async (sessionUserId: string, loadedNotifications: AppNotification[]) => {
      if (!loadedNotifications.some((item) => !item.isRead)) return;

      try {
        await axios.patch(
          `${API_BASE_URL}/api/notifications/user/${sessionUserId}/read-all`,
        );
      } catch (error) {
        console.error("Error sincronizando avisos leidos:", error);
      }
    },
    [],
  );

  const hydrateScreen = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const sessionUser = await getStoredSession();

      if (!sessionUser?._id) {
        router.replace("/");
        return;
      }

      setUserData(sessionUser);
      const response = await axios.get<AppNotification[]>(
        `${API_BASE_URL}/api/notifications/user/${sessionUser._id}`,
      );

      const nextNotifications = Array.isArray(response.data)
        ? response.data.filter((item) => item.channels?.inApp)
        : [];

      setNotifications(nextNotifications);
      void syncNotificationsAsRead(sessionUser._id, nextNotifications);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getStoredSession, router, syncNotificationsAsRead]);

  useFocusEffect(
    useCallback(() => {
      const shouldShowLoader = !hasLoadedOnceRef.current;
      hasLoadedOnceRef.current = true;
      void hydrateScreen(shouldShowLoader);
    }, [hydrateScreen]),
  );

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("userSession");
      } else {
        await SecureStore.deleteItemAsync("userSession");
      }

      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      router.replace("/");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void hydrateScreen(false);
  };

  const handleOpenNotification = async (notification: AppNotification) => {
    try {
      if (!notification.isRead) {
        await axios.patch(
          `${API_BASE_URL}/api/notifications/${notification._id}/read`,
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }

    if (notification.relatedReservationId) {
      router.push({
        pathname: "/reservationDetail",
        params: { id: notification.relatedReservationId },
      });
      return;
    }

    if (notification.relatedPetId) {
      router.push("/pets");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userData?._id || unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);
      await axios.patch(
        `${API_BASE_URL}/api/notifications/user/${userData._id}/read-all`,
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt ?? new Date().toISOString(),
        })),
      );
    } catch (error) {
      console.error("Error marcando todas las notificaciones:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const formatRelativeDate = (value: string) => {
    const target = new Date(value).getTime();
    const diffInSeconds = Math.max(1, Math.floor((Date.now() - target) / 1000));

    if (diffInSeconds < 60) {
      return "Hace unos segundos";
    }

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
      return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `Hace ${days} ${days === 1 ? "día" : "días"}`;
    }

    return new Date(value).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#155DFC"]}
          />
        }
      >
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Panel de Notificaciones</Text>
          <Text style={styles.subtitle}>
            Mantente informado sobre tus mascotas
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              (unreadCount === 0 || markingAll) ? styles.buttonDisabled : null,
            ]}
            activeOpacity={0.88}
            disabled={unreadCount === 0 || markingAll}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.actionButtonText}>
              {markingAll ? "Marcando..." : "Marcar todas como leídas"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panelCard}>
          <Text style={styles.panelTitle}>Notificaciones Recientes</Text>

          {loading ? (
            <View style={styles.centeredState}>
              <ActivityIndicator size="small" color="#155DFC" />
              <Text style={styles.stateText}>Cargando notificaciones...</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.centeredState}>
              <Text style={styles.emptyTitle}>No tienes avisos todavía</Text>
              <Text style={styles.emptySubtitle}>
                Cuando tengamos novedades sobre tus reservas o mascotas, las
                verás aquí.
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                timeLabel={formatRelativeDate(notification.createdAt)}
                onPress={() => handleOpenNotification(notification)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<{
  safeArea: ViewStyle;
  header: ViewStyle;
  headerLeft: ViewStyle;
  headerLogo: ImageStyle;
  headerTitle: TextStyle;
  logoutIcon: ImageStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  titleContainer: ViewStyle;
  mainTitle: TextStyle;
  subtitle: TextStyle;
  buttonContainer: ViewStyle;
  buttonDisabled: ViewStyle;
  actionButton: ViewStyle;
  actionButtonText: TextStyle;
  panelCard: ViewStyle;
  panelTitle: TextStyle;
  centeredState: ViewStyle;
  stateText: TextStyle;
  emptyTitle: TextStyle;
  emptySubtitle: TextStyle;
}>({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: "#4A5565",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  titleContainer: {
    marginBottom: 12,
  },
  mainTitle: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 32,
  },
  subtitle: {
    color: "#6A7282",
    fontSize: 14,
    marginTop: 2,
  },
  buttonContainer: {
    marginBottom: 18,
  },
  buttonDisabled: {
    opacity: 0.62,
  },
  actionButton: {
    width: "100%",
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: "#155DFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  panelCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  panelTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },
  centeredState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 10,
  },
  stateText: {
    color: "#4B5563",
    fontSize: 14,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
});

export default NotificationsScreen;
