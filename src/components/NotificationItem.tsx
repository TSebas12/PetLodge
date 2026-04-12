import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { AppNotification } from "../types/notifications";

interface NotificationItemProps {
  notification: AppNotification;
  timeLabel: string;
  onPress: () => void;
}

const NotificationItem = ({
  notification,
  timeLabel,
  onPress,
}: NotificationItemProps) => {
  const isUnread = !notification.isRead;
  const petImageUri = notification.relatedPetImage ?? undefined;
  const hasPetImage = Boolean(petImageUri);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isUnread ? styles.cardUnread : styles.cardRead,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.contentRow}>
        {hasPetImage ? (
          <Image
            source={{ uri: petImageUri }}
            style={styles.petImage}
            resizeMode="cover"
          />
        ) : null}

        <View style={[styles.textBlock, !hasPetImage ? styles.textBlockFull : null]}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={1}>
              {notification.title}
            </Text>
            {isUnread ? <View style={styles.unreadDot} /> : null}
          </View>

          <Text style={styles.descriptionText} numberOfLines={2}>
            {notification.description}
          </Text>

          <Text style={styles.timeText}>{timeLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create<{
  card: ViewStyle;
  cardUnread: ViewStyle;
  cardRead: ViewStyle;
  cardPressed: ViewStyle;
  contentRow: ViewStyle;
  petImage: ImageStyle;
  textBlock: ViewStyle;
  textBlockFull: ViewStyle;
  titleRow: ViewStyle;
  titleText: TextStyle;
  unreadDot: ViewStyle;
  descriptionText: TextStyle;
  timeText: TextStyle;
}>({
  card: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardUnread: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BEDBFF",
    shadowColor: "#155DFC",
    shadowOpacity: 0.06,
  },
  cardRead: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  cardPressed: {
    opacity: 0.88,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  petImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  textBlock: {
    flex: 1,
  },
  textBlockFull: {
    minHeight: 48,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  titleText: {
    flex: 1,
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#155DFC",
  },
  descriptionText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
  },
  timeText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 4,
  },
});

export default NotificationItem;
