import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />

      <Stack.Screen
        name="newReservation"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="reservationDetail"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
