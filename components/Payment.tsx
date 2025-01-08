// import React, { useState } from "react";
// import { Alert, Image, Text, View, Platform } from "react-native";
// import { useAuth } from "@clerk/clerk-expo";
// import { useStripe } from "@stripe/stripe-react-native";
// import { router } from "expo-router";
// import { ReactNativeModal } from "react-native-modal";

// import CustomButton from "@/components/CustomButton";
// import { images } from "@/constants";
// import { fetchAPI } from "@/lib/fetch";
// import { useLocationStore } from "@/store";
// import { PaymentProps } from "@/types/type";

// // 📌 Main Payment Component
// const Payment = ({
//   fullName,
//   email,
//   amount,
//   driverId,
//   rideTime,
// }: PaymentProps) => {
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const {
//     userAddress,
//     userLongitude,
//     userLatitude,
//     destinationLatitude,
//     destinationAddress,
//     destinationLongitude,
//   } = useLocationStore();
//   const { userId } = useAuth();

//   console.log("User  id", userId);

//   const [success, setSuccess] = useState<boolean>(false);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);

//   // ✅ Initialize Payment Sheet
//   const initializePaymentSheet = async () => {
//     try {
//       const parsedAmount = parseInt(amount, 10);
//       if (isNaN(parsedAmount)) {
//         throw new Error("Invalid payment amount");
//       }

//       const { paymentIntent, customer } = await fetchAPI(
//         "/(api)/(stripe)/create",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: fullName || email.split("@")[0] || "Vishal",
//             email: email,
//             amount: parsedAmount,
//           }),
//         }
//       );

//       if (!paymentIntent?.client_secret) {
//         throw new Error("Failed to fetch payment intent client secret");
//       }

//       const { error } = await initPaymentSheet({
//         merchantDisplayName: "Uber, Inc.",
//         paymentIntentClientSecret: paymentIntent.client_secret,
//         customerId: customer,
//         returnURL: "myapp://book-rides",
//       });

//       if (error) {
//         throw new Error(error.message);
//       }
//     } catch (error) {
//       console.error("Error initializing payment sheet:", error);
//       Alert.alert(
//         "Payment Initialization Failed",
//         error.message || "Unknown error"
//       );
//     }
//   };

//   // ✅ Confirm Payment
//   const confirmHandler = async (
//     paymentMethod: any,
//     shouldSavePaymentMethod: boolean,
//     intentCreationCallback: (params: any) => void
//   ) => {
//     try {
//       const { result } = await fetchAPI("/(api)/(stripe)/pay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           payment_method_id: paymentMethod.id,
//           payment_intent_id: paymentMethod.id,
//           customer_id: "cus_RY0J0qahNK5dEk",
//           client_secret: paymentMethod.client_secret,
//         }),
//       });

//       if (!result?.client_secret) {
//         throw new Error(
//           "Failed to retrieve client secret from payment confirmation"
//         );
//       }

//       if (result?.client_secret) {
//         console.log(result?.client_secret);
//         await fetchAPI("/(api)/ride/create", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             origin_address: userAddress,
//             destination_address: destinationAddress,
//             origin_latitude: userLatitude,
//             origin_longitude: userLongitude,
//             destination_latitude: destinationLatitude,
//             destination_longitude: destinationLongitude,
//             ride_time: rideTime.toFixed(0),
//             fare_price: parseInt(amount) * 100,
//             payment_status: "paid",
//             driver_id: driverId,
//             user_id: userId,
//           }),
//         });
//       }

//       intentCreationCallback({
//         clientSecret: result.client_secret,
//       });
//     } catch (error) {
//       console.error("Error during payment confirmation:", error);
//       Alert.alert(
//         "Payment Error",
//         error.message || "Something went wrong during payment."
//       );
//       intentCreationCallback({ error });
//     }
//   };

//   // ✅ Open Payment Sheet
//   const openPaymentSheet = async () => {
//     if (isProcessing) return;
//     setIsProcessing(true);

//     try {
//       await initializePaymentSheet();
//       const { error } = await presentPaymentSheet();

//       if (error) {
//         Alert.alert(`Error code: ${error.code}`, error.message);
//       } else {
//         setSuccess(true);
//       }
//     } catch (error) {
//       console.error("Error presenting payment sheet:", error);
//       Alert.alert(
//         "Payment Error",
//         error.message || "Failed to complete payment."
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <>
//       <CustomButton
//         title="Confirm Ride"
//         className="my-10"
//         onPress={openPaymentSheet}
//       />

//       {/* Success Modal */}
//       <ReactNativeModal
//         isVisible={success}
//         onBackdropPress={() => setSuccess(false)}
//       >
//         <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
//           <Image source={images.check} className="w-28 h-28 mt-5" />
//           <Text className="text-2xl text-center font-JakartaBold mt-5">
//             Booking placed successfully
//           </Text>
//           <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
//             Thank you for your booking. Your reservation has been successfully
//             placed. Please proceed with your trip.
//           </Text>
//           <CustomButton
//             title="Back Home"
//             onPress={() => {
//               setSuccess(false);
//               router.push("/(root)/(tabs)/home");
//             }}
//             className="mt-5"
//           />
//         </View>
//       </ReactNativeModal>
//     </>
//   );
// };

// export default Payment;

import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";

// 📌 Main Payment Component
const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();
  const { userId } = useAuth();

  const [success, setSuccess] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  console.log("🆔 User ID:", userId);

  // ✅ Initialize Payment Sheet
  const initializePaymentSheet = async () => {
    try {
      const parsedAmount = parseInt(amount, 10);
      if (isNaN(parsedAmount)) {
        throw new Error("Invalid payment amount");
      }

      console.log("🚀 Initializing payment intent...");
      const { paymentIntent, customer } = await fetchAPI(
        "/(api)/(stripe)/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName || email.split("@")[0],
            email: email,
            amount: parsedAmount * 100,
          }),
        }
      );

      if (!paymentIntent?.client_secret) {
        throw new Error("Failed to fetch payment intent client secret");
      }

      console.log("✅ Payment intent created, initializing PaymentSheet...");
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Uber, Inc.",
        intentConfiguration: {
          mode: {
            amount: parsedAmount * 100,
            currencyCode: "usd",
          },
          confirmHandler: async (
            paymentMethod,
            shouldSavePaymentMethod,
            intentCreationCallback
          ) => {
            console.log("💳 Confirming payment...");
            try {
              const { result } = await fetchAPI("/(api)/(stripe)/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  payment_method_id: paymentMethod.id,
                  payment_intent_id: paymentIntent.id,
                  customer_id: customer,
                  client_secret: paymentIntent.client_secret,
                }),
              });

              if (!result?.client_secret) {
                throw new Error(
                  "Failed to retrieve client secret from payment confirmation"
                );
              }

              console.log("✅ Payment confirmed, creating ride entry...");

              console.log("🚀 Ride API Payload:", {
                origin_address: userAddress,
                destination_address: destinationAddress,
                origin_latitude: userLatitude,
                origin_longitude: userLongitude,
                destination_latitude: destinationLatitude,
                destination_longitude: destinationLongitude,
                ride_time: rideTime.toFixed(0),
                fare_price: parseInt(amount) * 100,
                payment_status: "paid",
                driver_id: driverId,
                user_id: userId,
              });
              await fetchAPI("/(api)/(ride)/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  origin_address: userAddress,
                  destination_address: destinationAddress,
                  origin_latitude: userLatitude,
                  origin_longitude: userLongitude,
                  destination_latitude: destinationLatitude,
                  destination_longitude: destinationLongitude,
                  ride_time: rideTime.toFixed(0),
                  fare_price: parsedAmount * 100,
                  payment_status: "paid",
                  driver_id: driverId,
                  user_id: userId,
                }),
              });

              console.log("🚗 Ride entry successfully created.");
              intentCreationCallback({
                clientSecret: result.client_secret,
              });
            } catch (error) {
              console.error("❌ Error in confirmHandler:", error);
              Alert.alert(
                "Payment Confirmation Failed",
                error.message || "Unknown error"
              );
              intentCreationCallback({ error });
            }
          },
        },
        returnURL: "myapp://book-ride",
      });

      if (error) {
        throw new Error(`PaymentSheet initialization failed: ${error.message}`);
      }

      console.log("✅ PaymentSheet initialized successfully.");
    } catch (error) {
      console.error("❌ Error initializing payment sheet:", error);
      Alert.alert(
        "Payment Initialization Failed",
        error.message || "Unknown error"
      );
    }
  };

  // ✅ Open Payment Sheet
  const openPaymentSheet = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      console.log("📲 Opening PaymentSheet...");
      await initializePaymentSheet();

      const { error } = await presentPaymentSheet();
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        console.log("✅ Payment successful, displaying success modal.");
        setSuccess(true);
      }
    } catch (error) {
      console.error("❌ Error presenting payment sheet:", error);
      Alert.alert(
        "Payment Error",
        error.message || "Failed to complete payment."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />

      {/* Success Modal */}
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />
          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>
          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for your booking. Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>
          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
