// src/screens/animals/SimpleAnimalListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../../context/DatabaseContext';

// Мок-данные для первоначального тестирования
const mockAnimals = [
  { id: 1, number: 'A001', type: 'Корова', gender: 'female' },
  { id: 2, number: 'A002', type: 'Бык', gender: 'male' },
  { id: 3, number: 'A003', type: 'Телёнок', gender: 'male' }
];

const SimpleAnimalListScreen = () => {
  const navigation = useNavigation();
  const { isDbReady } = useDatabase();
  const [animals, setAnimals] = useState(mockAnimals);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setAnimals(mockAnimals);
    } else {
      const filtered = mockAnimals.filter(
        animal => animal.number.toLowerCase().includes(query.toLowerCase()) ||
                 animal.type.toLowerCase().includes(query.toLowerCase())
      );
      setAnimals(filtered);
    }
  };
  
  const renderAnimalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.animalItem}
      onPress={() => alert(`Выбрано животное ${item.number}`)}
    >
      <View style={styles.animalInfo}>
        <Text style={styles.animalNumber}>{item.number}</Text>
        <Text style={styles.animalType}>{item.type}</Text>
        <Text style={styles.animalGender}>
          {item.gender === 'male' ? 'Мужской' : 'Женский'}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.dbStatus}>
        <Text>Статус БД: {isDbReady ? 'Готова' : 'Инициализация...'}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Поиск по номеру или типу"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={animals}
        keyExtractor={item => item.id.toString()}
        renderItem={renderAnimalItem}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContent}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => alert('Добавление нового животного')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  dbStatus: {
    padding: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
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
  animalItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  animalInfo: {
    flex: 1,
  },
  animalNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  animalType: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 2,
  },
  animalGender: {
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

export default SimpleAnimalListScreen;