import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './indexStyles';

const LAWN_TYPES = ['Kikuyu', 'LM Berea', 'Golf Green'];

const SERVICE_TYPES = [
  { label: 'Delivery', icon: 'truck-delivery-outline' },
  { label: 'Installation', icon: 'shovel' },
];

// Placeholder for fully booked dates — will come from backend later
const BOOKED_DATES: string[] = ['2025-08-05', '2025-08-12', '2025-08-20'];

export default function HomeScreen() {
  const [lawnType, setLawnType] = useState('Kikuyu');
  const [area, setArea] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('');
  const [showLawnPicker, setShowLawnPicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [serviceType, setServiceType] = useState('Delivery');

  const today = new Date().toISOString().split('T')[0];

  const getMarkedDates = () => {
    const marked: any = {};

    BOOKED_DATES.forEach((date) => {
      marked[date] = {
        disabled: true,
        disableTouchEvent: true,
        marked: true,
        dotColor: '#EF4444',
      };
    });

    if (deliveryDate) {
      marked[deliveryDate] = {
        selected: true,
        selectedColor: '#2D6A4F',
      };
    }

    return marked;
  };

  const handleOrder = () => {
    console.log('Order placed:', {
      lawnType,
      area,
      deliveryDate,
      address,
      serviceType,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good day 👋</Text>
        <Text style={styles.headerTitle}>Place an Order</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Service Type</Text>

        <View style={styles.serviceToggleContainer}>
          {SERVICE_TYPES.map((service) => (
            <TouchableOpacity
              key={service.label}
              style={[
                styles.serviceToggleButton,
                serviceType === service.label && styles.serviceToggleActive,
              ]}
              onPress={() => setServiceType(service.label)}
            >
              <MaterialCommunityIcons
                name={service.icon as any}
                size={22}
                color={serviceType === service.label ? '#fff' : '#2D6A4F'}
              />
              <Text
                style={[
                  styles.serviceToggleText,
                  serviceType === service.label && styles.serviceToggleTextActive,
                ]}
              >
                {service.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Order Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Lawn Type</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowLawnPicker(true)}
          >
            <MaterialCommunityIcons name="grass" size={20} color="#2D6A4F" />
            <Text style={styles.dropdownText}>{lawnType}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <Text style={styles.label}>Area (m²)</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="ruler-square" size={20} color="#2D6A4F" />
            <TextInput
              placeholder="e.g. 50"
              style={styles.input}
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>
            {serviceType === 'Delivery' ? 'Delivery Date' : 'Installation Date'}
          </Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCalendar(true)}
          >
            <MaterialCommunityIcons name="calendar-outline" size={20} color="#2D6A4F" />
            <Text style={styles.dropdownText}>
              {deliveryDate || 'Select a date'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <Text style={styles.label}>
            {serviceType === 'Delivery' ? 'Delivery Address' : 'Installation Address'}
          </Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#2D6A4F" />
            <TextInput
              placeholder="Enter your address"
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOrder}>
            <Text style={styles.buttonText}>
              {serviceType === 'Delivery' ? 'Place Order' : 'Book Installation'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowCalendar(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Date</Text>
            <Calendar
              onDayPress={(day: any) => {
                setDeliveryDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={getMarkedDates()}
              minDate={today}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                selectedDayBackgroundColor: '#2D6A4F',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#2D6A4F',
                dayTextColor: '#1F2937',
                textDisabledColor: '#D1D5DB',
                dotColor: '#EF4444',
                arrowColor: '#2D6A4F',
                monthTextColor: '#2D6A4F',
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
              }}
            />
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Fully Booked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2D6A4F' }]} />
                <Text style={styles.legendText}>Selected</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Lawn Type Modal */}
      <Modal
        visible={showLawnPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLawnPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowLawnPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Lawn Type</Text>
            {LAWN_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.optionItem}
                onPress={() => {
                  setLawnType(type);
                  setShowLawnPicker(false);
                }}
              >
                <MaterialCommunityIcons name="grass" size={20} color="#2D6A4F" />
                <Text style={[
                  styles.optionText,
                  lawnType === type && styles.optionTextSelected,
                ]}>
                  {type}
                </Text>
                {lawnType === type && (
                  <MaterialCommunityIcons name="check" size={20} color="#2D6A4F" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}