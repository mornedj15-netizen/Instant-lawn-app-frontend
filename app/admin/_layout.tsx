import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout() {
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
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={24}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={24}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
