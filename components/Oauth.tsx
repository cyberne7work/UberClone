import { ButtonProps } from "@/types/type";
import React, { useCallback } from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { fetchAPI } from "@/lib/fetch";
import { router } from "expo-router";

const Oauth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(root)/(tabs)/home", {
            scheme: "myapp",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        if (signIn) {
          setActive!({ session: createdSessionId });
          router.push("/(root)/(tabs)/home");
        }
        if (signUp?.createdUserId) {
          setActive!({ session: createdSessionId });
          // Redirect the user to the dashboard
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: signUp.firstName,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
          router.push("/(root)/(tabs)/home");
        }
      } else {
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default Oauth;
