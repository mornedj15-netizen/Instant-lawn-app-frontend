import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { inventoryAPI } from '../services/api';
import { styles } from './inventoryStyles';

const getStockStatus = (stock: number, maxStock: number) => {
  const percentage = (stock / maxStock) * 100;
  if (percentage > 50) return { label: 'In Stock', color: '#D1FAE5', textColor: '#065F46', barColor: '#2D6A4F' };
  if (percentage > 20) return { label: 'Low Stock', color: '#FEF3C7', textColor: '#92400E', barColor: '#F59E0B' };
  return { label: 'Critical', color: '#FEE2E2', textColor: '#DC2626', barColor: '#EF4444' };
};

export default function InventoryScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getInventory();
      setItems(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Could not load inventory');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadInventory();
    }, [])
  );

  const openModal = (item: any, newMode: 'add' | 'remove') => {
    setSelected(item);
    setMode(newMode);
    setAmount('');
  };

  const handleSave = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Invalid amount', 'Enter a number greater than 0.');
      return;
    }

    setSaving(true);
    try {
      await inventoryAPI.updateStock(selected.id, mode === 'add' ? value : -value);
      setSelected(null);
      await loadInventory();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Could not update stock');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <Text style={styles.headerSubtitle}>Manage your lawn stock</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Current Stock</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2D6A4F" />
        ) : (
          items.map((item) => {
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
                  <Text style={styles.inventoryDetailText}>{item.stock} m² available</Text>
                </View>

                <View style={styles.inventoryDetail}>
                  <MaterialCommunityIcons name="currency-usd" size={16} color="#2D6A4F" />
                  <Text style={styles.inventoryDetailText}>R{item.pricePerM2} per m²</Text>
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
                      { width: `${percentage}%` as any, backgroundColor: status.barColor },
                    ]}
                  />
                </View>

                <View style={styles.progressLabel}>
                  <Text style={styles.progressLabelText}>0</Text>
                  <Text style={styles.progressLabelText}>
                    {item.stock}/{item.maxStock} m²
                  </Text>
                  <Text style={styles.progressLabelText}>{item.maxStock}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openModal(item, 'add')}
                  >
                    <Text style={styles.actionButtonText}>Add Stock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FEF2F2', borderColor: '#EF4444' }]}
                    onPress={() => openModal(item, 'remove')}
                  >
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                      Remove Stock
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Add' : 'Remove'} {selected?.name} Stock
            </Text>
            <Text style={styles.modalSubtitle}>Enter the amount in m²</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 100"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setSelected(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}