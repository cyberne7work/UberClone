import React, { useState } from "react";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import Oauth from "@/components/Oauth";
import { useSignIn } from "@clerk/clerk-expo";

const SignUp = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [login, setLogin] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        // Redirect user to the explore tab
        router.replace("/(root)/(tabs)/home");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setLogin({
          ...login,
          error: (err as any).errors[0].longMessage,
        });
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setLogin({
        ...login,
        error: (err as any).errors[0].longMessage,
      });
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-black text-2xl font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            keyboardType="email-address"
            textContentType="username" // Important for autofill
            autoComplete="email"
          />
          <InputField
            label="Password"
            placeholder="Password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
            textContentType="password" // Important for autofill
            autoComplete="password"
          />
          {login.error ? (
            <Text className="text-red-500">{login.error}</Text>
          ) : null}

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-5 p-5"
          />
          <Oauth />
          <Link
            href={"/(auth)/sign-up"}
            className="text-lg text-center mt-5 ml-5 text-general-200"
          >
            <Text>Create an Account </Text>
            <Text className="text-blue-500">Signup</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
