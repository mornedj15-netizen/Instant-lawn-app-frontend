import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './loginStyles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LinearGradient
      colors={['#F8FFF8', '#E8F5E9', '#D8F3DC']}
      style={styles.container}
    >
      <Image
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
      />

      <Text style={styles.title}>SESMYL</Text>
      <Text style={styles.subtitle}>Instant Lawn Solutions</Text>

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome Back</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={22} color="#2D6A4F" />
          <TextInput
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={22} color="#2D6A4F" />
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
          onPress={() => router.push('/(tabs)/' as any)}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
          <Text style={styles.register}>
            {"Don't have an account? "}
            <Text style={{ fontWeight: '700' }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grass} />
    </LinearGradient>
  );
}