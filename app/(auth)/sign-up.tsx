import React, { useState } from "react";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import Oauth from "@/components/Oauth";
import { useSignUp } from "@clerk/clerk-expo";
import Modal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";
const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      console.log(form.email);
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err) {
      const error = err as any;
      Alert.alert("Error", error.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
        setPendingVerification(false);
        // Create a user in the database
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        router.replace("/(root)/(tabs)/home");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      setVerification({
        ...verification,
        error: (err as any).errors[0].longMessage,
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-black text-2xl font-JakartaSemiBold absolute bottom-5 left-5">
            Create an account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-5 p-5"
          />

          <Oauth />

          <Link
            href={"/(auth)/sign-in"}
            className="text-lg text-center mt-5 ml-5 text-general-200"
          >
            <Text>Already have an account? </Text>
            <Text className="text-blue-500">Login</Text>
          </Link>

          <Modal
            isVisible={pendingVerification}
            animationIn="slideInUp"
            onModalHide={() => setPendingVerification(false)}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">{`Enter the code sent to your email: ${form.email}`}</Text>
              <InputField
                label="Code"
                placeholder="123456"
                value={code}
                onChangeText={(value) => setCode(value)}
              />
              <CustomButton
                title="Verify"
                onPress={onVerifyPress}
                className="mt-5 p-5"
              />
              {verification.error ? (
                <Text className="text-red-500">{verification.error}</Text>
              ) : null}
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
