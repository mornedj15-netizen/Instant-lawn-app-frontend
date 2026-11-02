import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { styles } from "./map-pickerStyles";
import { useOrderStore } from "./store/useOrderStore";
import { useRef } from "react";

interface Suggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapPickerScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [region, setRegion] = useState<Region>({
    latitude: -25.7479,
    longitude: 28.2293,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const debounceTimer = useRef<any>(null);

  const searchAddress = (text: string) => {
    setSearch(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: text,
              format: "json",
              limit: 8,
              countrycodes: "za",
              addressdetails: 1,
              "accept-language": "en",
            },
            headers: {
              "User-Agent": "SesmylApp/1.0",
            },
          },
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Search error:", error);
      }
      setLoading(false);
    }, 800);
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setMarker({ latitude: lat, longitude: lon });
    setSelectedAddress(suggestion.display_name);
    setSearch(suggestion.display_name);
    setSuggestions([]);
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
          },
          headers: {
            "User-Agent": "SesmylApp/1.0",
          },
        },
      );
      setSelectedAddress(response.data.display_name);
      setSearch(response.data.display_name);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const setLocation = useOrderStore((state) => state.setLocation);

  const confirmLocation = () => {
    if (marker && selectedAddress) {
      setLocation(selectedAddress, marker.latitude, marker.longitude);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Location</Text>
        <Text style={styles.headerSubtitle}>
          Search the street, then tap your exact spot on the map
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="map-search-outline"
          size={20}
          color="#2D6A4F"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search address..."
          value={search}
          onChangeText={searchAddress}
        />
        {loading && <ActivityIndicator size="small" color="#2D6A4F" />}
      </View>

      {suggestions.length > 0 && (
        <FlatList
          style={styles.suggestionsList}
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => selectSuggestion(item)}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color="#2D6A4F"
              />
              <Text style={styles.suggestionText} numberOfLines={2}>
                {item.display_name.split(",").slice(0, 4).join(",")}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <MapView style={styles.map} region={region} onPress={handleMapPress}>
        {marker && <Marker coordinate={marker} pinColor="#2D6A4F" />}
      </MapView>

      {selectedAddress !== "" && (
        <View style={styles.selectedAddressContainer}>
          <MaterialCommunityIcons
            name="map-marker-check"
            size={20}
            color="#2D6A4F"
          />
          <Text style={styles.selectedAddressText} numberOfLines={2}>
            {selectedAddress}
          </Text>
        </View>
      )}

      {marker && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmLocation}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
