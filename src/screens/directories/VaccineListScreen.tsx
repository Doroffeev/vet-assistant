// src/screens/directories/VaccineListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Vaccine } from '../../types';
import { getAllVaccines } from '../../database/repositories/VaccineRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';

type VaccineListScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'VaccineList'>;

const VaccineListScreen: React.FC = () => {
  const navigation = useNavigation<VaccineListScreenNavigationProp>();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [filteredVaccines, setFilteredVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadVaccines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const vaccinesData = await getAllVaccines();
      setVaccines(vaccinesData);
      setFilteredVaccines(vaccinesData);
    } catch (err) {
      setError('Не удалось загрузить список вакцин');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadVaccines();
    }, [loadVaccines])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredVaccines(vaccines);
    } else {
      const filtered = vaccines.filter(
        vaccine => vaccine.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredVaccines(filtered);
    }
  };

  const renderVaccineItem = ({ item }: { item: Vaccine }) => (
    <TouchableOpacity
      style={styles.vaccineItem}
      onPress={() => navigation.navigate('VaccineForm', { vaccineId: item.id })}
    >
      <View style={styles.vaccineInfo}>
        <Text style={styles.vaccineName}>{item.name}</Text>
        {item.manufacturer && (
          <Text style={styles.vaccineManufacturer}>Производитель: {item.manufacturer}</Text>
        )}
        {item.dosage && (
          <Text style={styles.vaccineDosage}>Дозировка: {item.dosage}</Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen message="Загрузка списка вакцин..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={loadVaccines} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Поиск по названию"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      {filteredVaccines.length === 0 ? (
        <EmptyListMessage 
          message={
            searchQuery
              ? "Нет вакцин, соответствующих поиску"
              : "Список вакцин пуст. Нажмите '+', чтобы добавить вакцину."
          }
          icon="needle"
        />
      ) : (
        <FlatList
          data={filteredVaccines}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderVaccineItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('VaccineForm')}
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
  vaccineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  vaccineManufacturer: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  vaccineDosage: {
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

export default VaccineListScreen;