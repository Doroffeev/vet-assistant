// src/screens/directories/MedicineListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Medicine } from '../../types';
import { getAllMedicines } from '../../database/repositories/MedicineRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';

type MedicineListScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'MedicineList'>;

const MedicineListScreen: React.FC = () => {
  const navigation = useNavigation<MedicineListScreenNavigationProp>();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const medicinesData = await getAllMedicines();
      setMedicines(medicinesData);
      setFilteredMedicines(medicinesData);
    } catch (err) {
      setError('Не удалось загрузить список лекарств');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadMedicines();
    }, [loadMedicines])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(
        medicine => 
          medicine.name.toLowerCase().includes(query.toLowerCase()) ||
          (medicine.activeIngredient && 
            medicine.activeIngredient.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredMedicines(filtered);
    }
  };

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => navigation.navigate('MedicineForm', { medicineId: item.id })}
    >
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        {item.activeIngredient && (
          <Text style={styles.medicineActiveIngredient}>
            Активное вещество: {item.activeIngredient}
          </Text>
        )}
        {item.manufacturer && (
          <Text style={styles.medicineManufacturer}>
            Производитель: {item.manufacturer}
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen message="Загрузка списка лекарств..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={loadMedicines} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Поиск по названию или активному веществу"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      {filteredMedicines.length === 0 ? (
        <EmptyListMessage 
          message={
            searchQuery
              ? "Нет лекарств, соответствующих поиску"
              : "Список лекарств пуст. Нажмите '+', чтобы добавить лекарство."
          }
          icon="pill"
        />
      ) : (
        <FlatList
          data={filteredMedicines}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderMedicineItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('MedicineForm')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    flexGrow: 1,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  medicineActiveIngredient: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  medicineManufacturer: {
    fontSize: 14,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MedicineListScreen;