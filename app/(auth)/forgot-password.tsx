import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authAPI } from '../services/api';
import { styles } from './loginStyles';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setSending(true);
    try {
      await authAPI.forgotPassword(email.trim());
      Alert.alert(
        'Check your email',
        'If an account exists for that email, a reset link has been sent. Check your spam folder too.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login' as any) }]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F8FFF8', '#E8F5E9', '#D8F3DC']}
      style={styles.container}
    >
      <Image source={require('../../assets/logo.jpg')} style={styles.logo} />

      <Text style={styles.title}>SESMYL</Text>
      <Text style={styles.subtitle}>Instant Lawn Solutions</Text>

      <View style={styles.card}>
        <Text style={styles.welcome}>Reset Password</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={22} color="#2D6A4F" />
          <TextInput
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSend} disabled={sending}>
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/(auth)/login' as any)}>
          <Text style={styles.register}>
            {'Back to '}
            <Text style={{ fontWeight: '700' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grass} />
    </LinearGradient>
  );
}