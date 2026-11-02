import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { styles } from "./registerStyles";
import { isValidEmail, isValidPhone } from "../services/validation";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser, setLoading, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert(
        "Error",
        "Please enter a valid South African phone number, for example 0821234567",
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      const { token, ...user } = response.data;
      setUser(user, token);
      router.push("/(tabs)/" as any);
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#F8FFF8", "#E8F5E9", "#D8F3DC"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={require("../../assets/logo.jpg")} style={styles.logo} />

        <Text style={styles.title}>SESMYL</Text>
        <Text style={styles.subtitle}>Instant Lawn Solutions</Text>

        <View style={styles.card}>
          <Text style={styles.welcome}>Create Account</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={22}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={22}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={22}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="Email Address"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={22}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={22}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check-outline"
              size={22}
              color="#2D6A4F"
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
            <Text style={styles.login}>
              {"Already have an account? "}
              <Text style={{ fontWeight: "700" }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.grass} />
    </LinearGradient>
  );
}
