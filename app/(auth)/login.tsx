import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { styles } from "./loginStyles";
import { isValidEmail } from "../services/validation";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setLoading, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...user } = response.data;
      setUser(user, token);
      router.push("/(tabs)/" as any);
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
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
      <Image source={require("../../assets/logo.jpg")} style={styles.logo} />

      <Text style={styles.title}>SESMYL</Text>
      <Text style={styles.subtitle}>Instant Lawn Solutions</Text>

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome Back</Text>

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
            name="lock-outline"
            size={22}
            color="#2D6A4F"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password" as any)}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register" as any)}
        >
          <Text style={styles.register}>
            {"Don't have an account? "}
            <Text style={{ fontWeight: "700" }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grass} />
    </LinearGradient>
  );
}
