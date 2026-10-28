import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './inventoryStyles';

const inventory = [
  {
    id: '1',
    name: 'Kikuyu',
    stock: 850,
    maxStock: 1000,
    unit: 'm²',
    pricePerM2: 'R45',
    lastRestocked: '2025-07-15',
  },
  {
    id: '2',
    name: 'LM Berea',
    stock: 320,
    maxStock: 500,
    unit: 'm²',
    pricePerM2: 'R65',
    lastRestocked: '2025-07-20',
  },
  {
    id: '3',
    name: 'Golf Green',
    stock: 80,
    maxStock: 300,
    unit: 'm²',
    pricePerM2: 'R95',
    lastRestocked: '2025-07-10',
  },
];

const getStockStatus = (stock: number, maxStock: number) => {
  const percentage = (stock / maxStock) * 100;
  if (percentage > 50) return { label: 'In Stock', color: '#D1FAE5', textColor: '#065F46', barColor: '#2D6A4F' };
  if (percentage > 20) return { label: 'Low Stock', color: '#FEF3C7', textColor: '#92400E', barColor: '#F59E0B' };
  return { label: 'Critical', color: '#FEE2E2', textColor: '#DC2626', barColor: '#EF4444' };
};

export default function InventoryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <Text style={styles.headerSubtitle}>Manage your lawn stock</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Stock</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Current Stock</Text>

        {inventory.map((item) => {
          const status = getStockStatus(item.stock, item.maxStock);
          const percentage = (item.stock / item.maxStock) * 100;

          return (
            <View key={item.id} style={styles.inventoryCard}>
              <View style={styles.inventoryHeader}>
                <Text style={styles.inventoryName}>{item.name}</Text>
                <View style={[styles.stockBadge, { backgroundColor: status.color }]}>
                  <Text style={[styles.stockText, { color: status.textColor }]}>
                    {status.label}
                  </Text>
                </View>
              </View>

              <View style={styles.inventoryDetail}>
                <MaterialCommunityIcons name="grass" size={16} color="#2D6A4F" />
                <Text style={styles.inventoryDetailText}>
                  {item.stock} {item.unit} available
                </Text>
              </View>

              <View style={styles.inventoryDetail}>
                <MaterialCommunityIcons name="currency-usd" size={16} color="#2D6A4F" />
                <Text style={styles.inventoryDetailText}>
                  {item.pricePerM2} per m²
                </Text>
              </View>

              <View style={styles.inventoryDetail}>
                <MaterialCommunityIcons name="calendar-outline" size={16} color="#2D6A4F" />
                <Text style={styles.inventoryDetailText}>
                  Last restocked: {item.lastRestocked}
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${percentage}%` as any,
                      backgroundColor: status.barColor,
                    },
                  ]}
                />
              </View>

              <View style={styles.progressLabel}>
                <Text style={styles.progressLabelText}>0</Text>
                <Text style={styles.progressLabelText}>
                  {item.stock}/{item.maxStock} {item.unit}
                </Text>
                <Text style={styles.progressLabelText}>{item.maxStock}</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Add Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
                  ]}
                >
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                    Remove Stock
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}