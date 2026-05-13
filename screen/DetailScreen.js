import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, TextInput,
  TouchableOpacity, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BASE_URL = 'http://10.1.12.214:8080/api/buildings';

export default function DetailScreen({ route, navigation }) {
  const { building } = route.params || { building: null };
  const isEditing = !!building;

  const [buildingName, setBuildingName] = useState(building?.buildingName || '');
  const [buildingType, setBuildingType] = useState(building?.buildingType || '');
  const [location, setLocation] = useState(building?.location || '');
  const [buildingArea, setBuildingArea] = useState(building?.buildingArea?.toString() || '');
  const [price, setBuildingPrice] = useState(building?.price || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validasi
    if (!buildingName.trim()) {
      Alert.alert('Error', 'Building Name harus diisi');
      return;
    }
    if (!buildingType.trim()) {
      Alert.alert('Error', 'Building Type harus diisi');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Location harus diisi');
      return;
    }
    if (!buildingArea) {
      Alert.alert('Error', 'Building Area harus diisi');
      return;
    }
    if (!price) {
      Alert.alert('Error', 'Building Price harus diisi');
      return;
    }

    setLoading(true);

    const payload = {
      buildingName,
      buildingType,
      location,
      buildingArea: parseFloat(buildingArea),
      price
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 201 || response.ok) {
        Alert.alert('Sukses', 'Building berhasil ditambahkan');
        navigation.goBack();
      } else {
        Alert.alert('Gagal', result.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal menyimpan building');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Building',
      `Apakah Anda yakin ingin menghapus "${building?.idBuilding}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
                console.log('Menghapus building dengan ID:', building?.idBuilding);
              const response = await fetch(`${BASE_URL}/${building?.idBuilding}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              console.log('Response status:', response.status);

              const result = await response.json();

              if (response.status === 200) {
                Alert.alert('Sukses', 'Building berhasil dihapus');
                navigation.goBack();
              } else {
                Alert.alert('Gagal', result.message || 'Terjadi kesalahan');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Gagal menghapus building');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Building Name *</Text>
        <TextInput
          style={styles.input}
          value={buildingName}
          onChangeText={setBuildingName}
          placeholder="Masukkan nama building"
        />

        <Text style={styles.label}>Building Type *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, buildingType === '1' && styles.radioSelected]}
            onPress={() => setBuildingType('1')}
          >
            <Text style={[styles.radioText, buildingType === '1' && styles.radioTextSelected]}>
              Apartement
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, buildingType === '2' && styles.radioSelected]}
            onPress={() => setBuildingType('2')}
          >
            <Text style={[styles.radioText, buildingType  === '2' && styles.radioTextSelected]}>
              House
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Masukkan lokasi building "
        />
       
        <Text style={styles.label}>Building Area *</Text>
        <TextInput
          style={styles.input}
          value={buildingArea}
          onChangeText={setBuildingArea}
          placeholder="Masukkan luas building"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Building Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setBuildingPrice}
          placeholder="Masukkan harga building"
          keyboardType="numeric"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Simpan Building</Text>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <MaterialIcons name="delete" size={20} color="white" />
                <Text style={styles.deleteButtonText}>Hapus Building</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  note: { fontSize: 12, color: '#999', marginTop: 4, fontStyle: 'italic' },
  radioGroup: { flexDirection: 'row', marginTop: 8 },
  radioButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 12,
  },
  radioSelected: { backgroundColor: '#007AFF' },
  radioText: { color: '#007AFF', fontWeight: 'bold' },
  radioTextSelected: { color: 'white' },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  loader: { marginTop: 24 },
});