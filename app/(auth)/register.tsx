import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { styles } from './registerStyles';

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <LinearGradient
      colors={['#F8FFF8', '#E8F5E9', '#D8F3DC']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/logo.jpg')}
          style={styles.logo}
        />

        <Text style={styles.title}>SESMYL</Text>
        <Text style={styles.subtitle}>Instant Lawn Solutions</Text>

        <View style={styles.card}>
          <Text style={styles.welcome}>Create Account</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={22} color="#2D6A4F" />
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={22} color="#2D6A4F" />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

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
            <MaterialCommunityIcons name="phone-outline" size={22} color="#2D6A4F" />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={22} color="#2D6A4F" />
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-check-outline" size={22} color="#2D6A4F" />
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
            onPress={() => router.push('/(tabs)/' as any)}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
            <Text style={styles.login}>
              {'Already have an account? '}
              <Text style={{ fontWeight: '700' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.grass} />
    </LinearGradient>
  );
}