import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import Rides from "@/components/Rides";
import { icons, images } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";
import { Link, useRouter } from "expo-router";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

// const recendLides = [
//   {
//     ride_id: "1",
//     origin_address: "Kathmandu, Nepal",
//     destination_address: "Pokhara, Nepal",
//     origin_latitude: "27.717245",
//     origin_longitude: "85.323961",
//     destination_latitude: "28.209583",
//     destination_longitude: "83.985567",
//     ride_time: 391,
//     fare_price: "19500.00",
//     payment_status: "paid",
//     driver_id: 2,
//     user_id: "1",
//     created_at: "2024-08-12 05:19:20.620007",
//     driver: {
//       driver_id: "2",
//       first_name: "David",
//       last_name: "Brown",
//       profile_image_url:
//         "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
//       car_seats: 5,
//       rating: "4.60",
//     },
//   },
//   {
//     ride_id: "2",
//     origin_address: "Jalkot, MH",
//     destination_address: "Pune, Maharashtra, India",
//     origin_latitude: "18.609116",
//     origin_longitude: "77.165873",
//     destination_latitude: "18.520430",
//     destination_longitude: "73.856744",
//     ride_time: 491,
//     fare_price: "24500.00",
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     created_at: "2024-08-12 06:12:17.683046",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "3",
//     origin_address: "Zagreb, Croatia",
//     destination_address: "Rijeka, Croatia",
//     origin_latitude: "45.815011",
//     origin_longitude: "15.981919",
//     destination_latitude: "45.327063",
//     destination_longitude: "14.442176",
//     ride_time: 124,
//     fare_price: "6200.00",
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     created_at: "2024-08-12 08:49:01.809053",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "4",
//     origin_address: "Okayama, Japan",
//     destination_address: "Osaka, Japan",
//     origin_latitude: "34.655531",
//     origin_longitude: "133.919795",
//     destination_latitude: "34.693725",
//     destination_longitude: "135.502254",
//     ride_time: 159,
//     fare_price: "7900.00",
//     payment_status: "paid",
//     driver_id: 3,
//     user_id: "1",
//     created_at: "2024-08-12 18:43:54.297838",
//     driver: {
//       driver_id: "3",
//       first_name: "Michael",
//       last_name: "Johnson",
//       profile_image_url:
//         "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
//       car_image_url:
//         "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
//       car_seats: 4,
//       rating: "4.70",
//     },
//   },
// ];
export default function HomeScreen() {
  const { setDestinationLocation, setUserLocation, userAddress } =
    useLocationStore();
  const { userId, signOut } = useAuth();

  console.log("userId--------", userId);

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/(ride)/${userId}`);

  console.log("Rides", recentRides);

  console.log(userAddress);
  const [hasPermission, setPermission] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const requestLocation = async () => {
      // Request Foreground Permissions
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      console.log("Foreground Permission:", foregroundStatus);
      if (foregroundStatus !== "granted") {
        setPermission(false);
        console.warn("Foreground location permission not granted.");
        return;
      }

      // Optionally Request Background Permissions (if needed)
      // let { status: backgroundStatus } =
      //   await Location.requestBackgroundPermissionsAsync();
      // console.log("Background Permission:", backgroundStatus);
      // if (backgroundStatus !== "granted") {
      //   console.warn("Background location permission not granted.");
      // }

      let location = await Location.getCurrentPositionAsync({});
      console.log("Location:", location);

      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log("Address:", address);

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0]?.name || ""}, ${address[0]?.region || ""}`,
      });
    };

    requestLocation();
  }, []);

  const { user } = useUser();
  const isLoading = true;
  console.log(user?.emailAddresses);
  const handleLogout = () => {
    // user?.logout();
    signOut();
    router.push("/(auth)/sign-in");
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    console.log("Destination pressed:", location);
    setDestinationLocation(location);
    router.push("/(root)/find-rides");
  };
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides}
        keyExtractor={(item) => item.ride_id}
        renderItem={({ item }) => <Rides ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!isLoading ? (
              <View>
                <Image
                  className="w-40 h-40"
                  alt="No recent rides found."
                  resizeMethod="auto"
                  source={images.noResult}
                />
                <Text className="text-sm">No recent rides found.</Text>
              </View>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => {
          return (
            <View>
              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-2xl font-semibold">{`Welcome  ${user?.emailAddresses[0].emailAddress.split("@")[0].toUpperCase() || "User"}`}</Text>
                <TouchableOpacity
                  onPress={handleLogout}
                  className="justify-center items-center w-10 h-10 rounded-full bg-white"
                >
                  <Image
                    className="w-5 h-5"
                    alt="Logout"
                    resizeMethod="auto"
                    source={icons.out}
                  />
                </TouchableOpacity>
              </View>
              <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white shadow-md shadow-neutral-300"
                handlePress={handleDestinationPress}
              />
              <View>
                <Text className="text-xl font-JakartaBold mt-5 mb-3">
                  Your Current Location
                </Text>
                <View className="flex flex-row items-center h-[300px]">
                  <Map />
                </View>
              </View>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Recent Rides
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
// className="flex flex-row items-center bg-transparent h-[300px]"
