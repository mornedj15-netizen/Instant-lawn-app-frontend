import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./profileStyles";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>
          {user ? `${user.firstName} ${user.lastName}` : "Guest"}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={22}
              color="#2D6A4F"
            />
            <Text style={styles.menuText}>Edit Profile</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color="#2D6A4F"
            />
            <Text style={styles.menuText}>Notifications</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemLast}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={22}
              color="#2D6A4F"
            />
            <Text style={styles.menuText}>Saved Addresses</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {user?.role === 'admin' && (
          <>
            <Text style={styles.sectionTitle}>Admin</Text>

            <View style={styles.card}>
              <TouchableOpacity
                style={styles.menuItemLast}
                onPress={() => router.push("/admin/dashboard" as any)}
              >
                <MaterialCommunityIcons
                  name="view-dashboard-outline"
                  size={22}
                  color="#2D6A4F"
                />
                <Text style={styles.menuText}>Admin Dashboard</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={22}
              color="#2D6A4F"
            />
            <Text style={styles.menuText}>Help & FAQ</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemLast}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={22}
              color="#2D6A4F"
            />
            <Text style={styles.menuText}>Contact Us</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            clearUser();
            router.replace("/(auth)/login" as any);
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
