import { Stack } from "expo-router";
import "react-native-reanimated";
import "../../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find-rides" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-rides" options={{ headerShown: false }} />
      <Stack.Screen name="book-rides" options={{ headerShown: false }} />
    </Stack>
  );
}
