import React, { useState, useCallback } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'http://10.1.12.214:8080/api/buildings'; 

export default function HomeScreen({ navigation }) {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllBuildings = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      console.log('Data buildings:', data); // Tambahkan log untuk debug
      setBuildings(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengambil data building');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllBuildings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllBuildings();
  };

  const getStatusText = (buildingType) => {
    return buildingType === '1' ? 'Apartement' : 'House';
  };

  const getStatusColor = (buildingType) => {
    return buildingType === '1' ? '#FF9800' : '#4CAF50';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { building: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.buildingName}</Text>
          {item.price ? (
            <Text style={styles.production}>{item.price}</Text>
          ) : (
            <Text style={styles.production}>Harga tidak tersedia</Text>
          )}
        </View>
        
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada data building</Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Detail', { building: null })}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  production: { fontSize: 14, color: '#666', marginTop: 4 },
  genres: { fontSize: 14, color: '#007AFF', marginTop: 4 },
  date: { fontSize: 12, color: '#999', marginTop: 4 },
  rating: { fontSize: 12, color: '#FF9800', marginTop: 2 },
  rightContainer: { alignItems: 'flex-end' },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
});