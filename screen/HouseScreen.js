import React, { useState, useCallback } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'http://10.1.12.214:8080/api/buildings';

export default function HouseScreen({ navigation }) {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHouses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/house`);
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengambil data building');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHouses();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { building: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.buildingName}</Text>
          <Text style={styles.production}>{item.buildingType}</Text>
          <Text style={styles.genres}>{item.location}</Text>
          <Text style={styles.rating}>Area: {item.buildingArea}</Text>
          <Text style={styles.rating}>Price: {item.price}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={buildings}
        keyExtractor={(item) => item.idBuilding.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada house yang tersedia</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  production: { fontSize: 14, color: '#666', marginTop: 4 },
  genres: { fontSize: 14, color: '#FF9800', marginTop: 4 },
  date: { fontSize: 12, color: '#999', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
});