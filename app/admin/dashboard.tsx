import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { orderAPI } from '../services/api';
import { styles } from './dashboardStyles';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF' },
  Delivered: { bg: '#D1FAE5', text: '#065F46' },
  Cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

const NEXT_STEP: Record<string, { status: string; label: string }> = {
  Pending: { status: 'Processing', label: 'Start Processing' },
  Processing: { status: 'Delivered', label: 'Mark Delivered' },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not load orders'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [])
  );

  const updateStatus = async (id: string, status: string) => {
    try {
      await orderAPI.updateOrderStatus(id, status);
      await loadOrders();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not update order'
      );
    }
  };

  const count = (status: string) =>
    orders.filter((o) => o.status === status).length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: 'clipboard-list-outline' },
    { label: 'Pending', value: count('Pending'), icon: 'clock-outline' },
    { label: 'Delivered', value: count('Delivered'), icon: 'check-circle-outline' },
    { label: 'Cancelled', value: count('Cancelled'), icon: 'close-circle-outline' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage orders and deliveries</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          {stats.slice(0, 2).map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon as any} size={28} color="#2D6A4F" />
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          {stats.slice(2, 4).map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon as any} size={28} color="#2D6A4F" />
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>All Orders</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2D6A4F" />
        ) : orders.length === 0 ? (
          <Text style={styles.orderDetailText}>No orders yet</Text>
        ) : (
          orders.map((order) => {
            const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
            const next = NEXT_STEP[order.status];
            const canCancel = order.status === 'Pending' || order.status === 'Processing';

            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTitle}>
                    #{order.id.slice(0, 6)} — {order.customerName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statusText, { color: colors.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons name="grass" size={14} color="#2D6A4F" />
                  <Text style={styles.orderDetailText}>
                    {order.lawnType} — {order.area}m²
                  </Text>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons name="calendar-outline" size={14} color="#2D6A4F" />
                  <Text style={styles.orderDetailText}>{order.deliveryDate}</Text>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons name="map-marker-outline" size={14} color="#2D6A4F" />
                  <Text style={styles.orderDetailText}>{order.address}</Text>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons
                    name={order.serviceType === 'Delivery' ? 'truck-delivery-outline' : 'shovel'}
                    size={14}
                    color="#2D6A4F"
                  />
                  <Text style={styles.orderDetailText}>{order.serviceType}</Text>
                </View>

                {(next || canCancel) && (
                  <View style={styles.actionRow}>
                    {next && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => updateStatus(order.id, next.status)}
                      >
                        <Text style={styles.actionButtonText}>{next.label}</Text>
                      </TouchableOpacity>
                    )}
                    {canCancel && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#FEF2F2', borderColor: '#EF4444' }]}
                        onPress={() => updateStatus(order.id, 'Cancelled')}
                      >
                        <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}