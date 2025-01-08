import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore, useLocationDriver } from "@/store";
import { Link, useRouter } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ConfirmRides = () => {
  const router = useRouter();
  const { selectedDriver, drivers, setSelectedDriver } = useLocationDriver();

  return (
    <RideLayout title={"Choose a Driver"} snapPoints={["65%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item.id))}
          />
        )}
        // contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Rides"
              onPress={() => router.push("/(root)/book-rides")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};
export default ConfirmRides;
