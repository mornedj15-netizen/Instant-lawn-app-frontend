import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from '../store/useAuthStore';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2D6A4F",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={24}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={24}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
