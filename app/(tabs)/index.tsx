import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { styles } from "./indexStyles";
import { useRouter, useFocusEffect } from "expo-router";
import { useOrderStore } from "../store/useOrderStore";
import { orderAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

const LAWN_TYPES = ["Kikuyu", "LM Berea", "Golf Green"];

const SERVICE_TYPES = [
  { label: "Delivery", icon: "truck-delivery-outline" },
  { label: "Installation", icon: "shovel" },
];

const DAY_CAPACITY_MIN = 480;

const formatMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // 1. All state first
  const [lawnType, setLawnType] = useState("Kikuyu");
  const [area, setArea] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [serviceType, setServiceType] = useState("Delivery");
  const [showLawnPicker, setShowLawnPicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<any | null>(null);
  const [estimating, setEstimating] = useState(false);

  const address = useOrderStore((state) => state.selectedAddress);
  const latitude = useOrderStore((state) => state.selectedLat);
  const longitude = useOrderStore((state) => state.selectedLon);
  const clearLocation = useOrderStore((state) => state.clearLocation);

  const today = new Date().toISOString().split("T")[0];

  // 2. Then functions
  const loadBookedDates = async (minutes?: number) => {
    try {
      const response = await orderAPI.getBookedDates(minutes);
      setBookedDates(response.data);
    } catch (error) {
      console.error("Failed to load booked dates:", error);
    }
  };

  // 3. Then effects
  // Reload the unavailable dates when the screen opens or the job time changes
  useFocusEffect(
    useCallback(() => {
      loadBookedDates(estimate?.totalMinutes);
    }, [estimate]),
  );

  // Work out the job time once a location and area are chosen
  useEffect(() => {
    const areaNum = Number(area);
    if (latitude === null || longitude === null || !areaNum || areaNum <= 0) {
      setEstimate(null);
      setEstimating(false);
      return;
    }

    setEstimating(true);
    const timer = setTimeout(async () => {
      try {
        const response = await orderAPI.getEstimate({
          latitude,
          longitude,
          area: areaNum,
          serviceType,
        });
        setEstimate(response.data);
      } catch (error) {
        console.error("Failed to get estimate:", error);
        setEstimate(null);
      } finally {
        setEstimating(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [area, latitude, longitude, serviceType]);

  // Clear the chosen date if it stops being available
  useEffect(() => {
    if (deliveryDate && bookedDates.includes(deliveryDate)) {
      setDeliveryDate("");
      Alert.alert(
        "Date unavailable",
        "That date no longer has enough time for this order. Please pick another.",
      );
    }
  }, [bookedDates]);

  const getMarkedDates = () => {
    const marked: any = {};

    bookedDates.forEach((date) => {
      marked[date] = {
        disabled: true,
        disableTouchEvent: true,
        marked: true,
        dotColor: "#EF4444",
      };
    });

    if (deliveryDate) {
      marked[deliveryDate] = {
        selected: true,
        selectedColor: "#2D6A4F",
      };
    }

    return marked;
  };

  const handleOrder = async () => {
    if (!area || !deliveryDate || !address) {
      Alert.alert(
        "Missing details",
        "Please fill in the area, date and location.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await orderAPI.createOrder({
        lawnType,
        area: Number(area),
        serviceType,
        deliveryDate,
        address,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
      });

      Alert.alert("Success", "Your order has been placed!", [
        {
          text: "View my orders",
          onPress: () => router.push("/(tabs)/orders" as any),
        },
      ]);
      setArea("");
      setDeliveryDate("");
      clearLocation();
      loadBookedDates();
    } catch (error: any) {
      Alert.alert(
        "Order failed",
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text
          style={styles.greeting}
        >{`Good day${user ? `, ${user.firstName}` : ""} 👋`}</Text>
        <Text style={styles.headerTitle}>Place an Order</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Service Type</Text>

        <View style={styles.serviceToggleContainer}>
          {SERVICE_TYPES.map((service) => (
            <TouchableOpacity
              key={service.label}
              style={[
                styles.serviceToggleButton,
                serviceType === service.label && styles.serviceToggleActive,
              ]}
              onPress={() => setServiceType(service.label)}
            >
              <MaterialCommunityIcons
                name={service.icon as any}
                size={22}
                color={serviceType === service.label ? "#fff" : "#2D6A4F"}
              />
              <Text
                style={[
                  styles.serviceToggleText,
                  serviceType === service.label &&
                    styles.serviceToggleTextActive,
                ]}
              >
                {service.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Order Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Lawn Type</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowLawnPicker(true)}
          >
            <MaterialCommunityIcons name="grass" size={20} color="#2D6A4F" />
            <Text style={styles.dropdownText}>{lawnType}</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <Text style={styles.label}>Area (m²)</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="ruler-square"
              size={20}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="e.g. 50"
              style={styles.input}
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>
            {serviceType === "Delivery" ? "Delivery Date" : "Installation Date"}
          </Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCalendar(true)}
          >
            <MaterialCommunityIcons
              name="calendar-outline"
              size={20}
              color="#2D6A4F"
            />
            <Text style={styles.dropdownText}>
              {deliveryDate || "Select a date"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <Text style={styles.label}>
            {serviceType === "Delivery"
              ? "Delivery Address"
              : "Installation Address"}
          </Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => router.push("/map-picker" as any)}
          >
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="#2D6A4F"
            />
            <Text
              style={[styles.dropdownText, !address && { color: "#9CA3AF" }]}
            >
              {address || "Select location on map"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {(estimating || estimate) && (
            <View style={styles.estimateBox}>
              {estimating || !estimate ? (
                <ActivityIndicator color="#2D6A4F" />
              ) : (
                <>
                  <Text style={styles.estimateTitle}>Estimated job time</Text>
                  <Text style={styles.estimateText}>
                    Distance:{" "}
                    {estimate.distanceKm !== null
                      ? `${estimate.distanceKm} km`
                      : "unavailable"}
                  </Text>
                  <Text style={styles.estimateText}>
                    Travel (round trip): {formatMinutes(estimate.travelMinutes)}
                  </Text>
                  <Text style={styles.estimateText}>
                    On site: {formatMinutes(estimate.workMinutes)}
                  </Text>
                  <Text style={styles.estimateTotal}>
                    Total: {formatMinutes(estimate.totalMinutes)}
                  </Text>
                  {!estimate.travelFromRouting && (
                    <Text style={styles.estimateWarning}>
                      Travel time is approximate right now.
                    </Text>
                  )}
                  {estimate.totalMinutes > DAY_CAPACITY_MIN && (
                    <Text style={styles.estimateWarning}>
                      This job is too large for one day. Please contact SESMYL.
                    </Text>
                  )}
                </>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleOrder}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {serviceType === "Delivery"
                  ? "Place Order"
                  : "Book Installation"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowCalendar(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Date</Text>
            <Calendar
              onDayPress={(day: any) => {
                setDeliveryDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={getMarkedDates()}
              minDate={today}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                selectedDayBackgroundColor: "#2D6A4F",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#2D6A4F",
                dayTextColor: "#1F2937",
                textDisabledColor: "#D1D5DB",
                dotColor: "#EF4444",
                arrowColor: "#2D6A4F",
                monthTextColor: "#2D6A4F",
                textDayFontWeight: "500",
                textMonthFontWeight: "700",
                textDayHeaderFontWeight: "600",
              }}
            />
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                />
                <Text style={styles.legendText}>Fully Booked</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#2D6A4F" }]}
                />
                <Text style={styles.legendText}>Selected</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Lawn Type Modal */}
      <Modal
        visible={showLawnPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLawnPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowLawnPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Lawn Type</Text>
            {LAWN_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.optionItem}
                onPress={() => {
                  setLawnType(type);
                  setShowLawnPicker(false);
                }}
              >
                <MaterialCommunityIcons
                  name="grass"
                  size={20}
                  color="#2D6A4F"
                />
                <Text
                  style={[
                    styles.optionText,
                    lawnType === type && styles.optionTextSelected,
                  ]}
                >
                  {type}
                </Text>
                {lawnType === type && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#2D6A4F"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
