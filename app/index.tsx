import { Redirect } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import "react-native-get-random-values";

export default function HomeScreen() {
  const { isSignedIn } = useAuth();

  console.log(isSignedIn);

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  return <Redirect href={"/(auth)/welcome"} />;
}
