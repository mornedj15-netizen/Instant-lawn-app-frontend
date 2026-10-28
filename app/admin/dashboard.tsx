import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './dashboardStyles';

const orders = [
  {
    id: '001',
    customer: 'John Doe',
    lawnType: 'Kikuyu',
    area: '50m²',
    date: '2025-08-01',
    address: '12 Green Street, Johannesburg',
    serviceType: 'Delivery',
    status: 'Pending',
    statusColor: '#FEF3C7',
    statusTextColor: '#92400E',
  },
  {
    id: '002',
    customer: 'Jane Smith',
    lawnType: 'LM Berea',
    area: '30m²',
    date: '2025-08-03',
    address: '45 Lawn Avenue, Pretoria',
    serviceType: 'Installation',
    status: 'Processing',
    statusColor: '#DBEAFE',
    statusTextColor: '#1E40AF',
  },
  {
    id: '003',
    customer: 'Mike Johnson',
    lawnType: 'Golf Green',
    area: '75m²',
    date: '2025-08-05',
    address: '8 Garden Road, Sandton',
    serviceType: 'Delivery',
    status: 'Delivered',
    statusColor: '#D1FAE5',
    statusTextColor: '#065F46',
  },
];

const stats = [
  { label: 'Total Orders', value: '24', icon: 'clipboard-list-outline' },
  { label: 'Pending', value: '8', icon: 'clock-outline' },
  { label: 'Delivered', value: '14', icon: 'check-circle-outline' },
  { label: 'Cancelled', value: '2', icon: 'close-circle-outline' },
];

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage orders and deliveries</Text>
      </View>

      <View style={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.slice(0, 2).map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={28}
                color="#2D6A4F"
              />
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          {stats.slice(2, 4).map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={28}
                color="#2D6A4F"
              />
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Orders</Text>

        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>
                Order #{order.id} — {order.customer}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: order.statusColor },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: order.statusTextColor },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons name="grass" size={14} color="#2D6A4F" />
              <Text style={styles.orderDetailText}>
                {order.lawnType} — {order.area}
              </Text>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={14}
                color="#2D6A4F"
              />
              <Text style={styles.orderDetailText}>{order.date}</Text>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={14}
                color="#2D6A4F"
              />
              <Text style={styles.orderDetailText}>{order.address}</Text>
            </View>

            <View style={styles.orderDetail}>
              <MaterialCommunityIcons
                name={
                  order.serviceType === 'Delivery'
                    ? 'truck-delivery-outline'
                    : 'shovel'
                }
                size={14}
                color="#2D6A4F"
              />
              <Text style={styles.orderDetailText}>{order.serviceType}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Mark Delivered</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
                ]}
              >
                <Text
                  style={[styles.actionButtonText, { color: '#EF4444' }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}