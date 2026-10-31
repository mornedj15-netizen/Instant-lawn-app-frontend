import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { orderAPI } from '../services/api';
import { styles } from './ordersStyles';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF' },
  Delivered: { bg: '#D1FAE5', text: '#065F46' },
  Cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        setLoading(true);
        try {
          const response = await orderAPI.getMyOrders();
          setOrders(response.data);
        } catch (error) {
          console.error('Failed to load orders:', error);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    }, [])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders found</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2D6A4F" />
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>You have no orders yet</Text>
          </View>
        ) : (
          orders.map((order) => {
            const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTitle}>Order #{order.id.slice(0, 6)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statusText, { color: colors.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons name="grass" size={16} color="#2D6A4F" />
                  <Text style={styles.orderDetailText}>
                    {order.lawnType} — {order.area}m²
                  </Text>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons name="calendar-outline" size={16} color="#2D6A4F" />
                  <Text style={styles.orderDetailText}>{order.deliveryDate}</Text>
                </View>

                <View style={styles.orderDetail}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#2D6A4F" />
                  <Text style={styles.orderDetailText}>{order.address}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}