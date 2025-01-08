import { icons } from "@/constants";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import Map from "./Map";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef } from "react";

const RideLayout = ({ title, children, snapPoints }) => {
  const router = useRouter();
  const bottomRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {/* Map and Header Section */}
          <View style={{ flex: 1, backgroundColor: "blue" }}>
            <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
              <TouchableOpacity onPress={() => router.back()}>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Image
                    source={icons.backArrow}
                    resizeMethod="auto"
                    className="w-6 h-6"
                  />
                </View>
              </TouchableOpacity>
              <Text className="text-xl font-JakartaSemiBold ml-5">
                {title || "Go Back"}
              </Text>
            </View>
            <Map />
          </View>

          {/* Bottom Sheet Section */}
          <BottomSheet
            ref={bottomRef}
            snapPoints={snapPoints || ["40%", "85%"]}
            index={0}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            enablePanDownToClose={false}
          >
            {/* KeyboardAvoidingView for adjusting input visibility */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <BottomSheetScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  padding: 20,
                }}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </BottomSheetScrollView>
            </KeyboardAvoidingView>
          </BottomSheet>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
