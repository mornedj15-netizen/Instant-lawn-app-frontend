import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './ordersStyles';

const orders = [
  {
    id: '001',
    lawnType: 'Kikuyu',
    area: '50m²',
    date: '2025-08-01',
    address: '12 Green Street, Johannesburg',
    status: 'Delivered',
    statusColor: '#D1FAE5',
    statusTextColor: '#065F46',
  },
  {
    id: '002',
    lawnType: 'LM Berea',
    area: '30m²',
    date: '2025-08-10',
    address: '45 Lawn Avenue, Pretoria',
    status: 'Pending',
    statusColor: '#FEF3C7',
    statusTextColor: '#92400E',
  },
  {
    id: '003',
    lawnType: 'Buffalo',
    area: '75m²',
    date: '2025-08-15',
    address: '8 Garden Road, Sandton',
    status: 'Processing',
    statusColor: '#DBEAFE',
    statusTextColor: '#1E40AF',
  },
];

export default function OrdersScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders found</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>

        {orders.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>Order #{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: order.statusColor }]}>
                <Text style={[styles.statusText, { color: order.statusTextColor }]}>
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons name="grass" size={16} color="#2D6A4F" />
              <Text style={styles.orderDetailText}>{order.lawnType} — {order.area}</Text>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons name="calendar-outline" size={16} color="#2D6A4F" />
              <Text style={styles.orderDetailText}>{order.date}</Text>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#2D6A4F" />
              <Text style={styles.orderDetailText}>{order.address}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}