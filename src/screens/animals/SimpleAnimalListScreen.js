import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../../context/DatabaseContext';

// Мок-данные для первоначального тестирования
const mockAnimals = [
  { 
    id: 1, 
    number: '01217', 
    type: 'Корова', 
    gender: 'female',
    responder: '532313',
    group: '23',
    lastDeliveryDate: '31.12.24',
    nextDeliveryDate: '01.02.25',
    lastDeliveryDays: 103,
    nextDeliveryDays: 51,
    lactationNumber: 7,
    inseminationCount: 1,
    averageMilk: 27.50,
    milkByLactation: 209203
  },
  { 
    id: 2, 
    number: 'A002', 
    type: 'Бык', 
    gender: 'male',
    responder: '456789',
    group: '11'
  },
  { 
    id: 3, 
    number: 'A003', 
    type: 'Телёнок', 
    gender: 'male',
    responder: '123456',
    group: '05'
  }
];

const SimpleAnimalListScreen = () => {
  const navigation = useNavigation();
  const { isDbReady } = useDatabase();
  const [animals] = useState(mockAnimals);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAnimals = searchQuery.trim() === '' 
    ? animals 
    : animals.filter(animal => 
        animal.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (animal.responder && animal.responder.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Поиск по номеру или типу"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={filteredAnimals}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.animalItem}
            onPress={() => navigation.navigate('AnimalDetail', { animal: item })}
          >
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.animalHeaderRow}>
                  <Text style={styles.animalNumber}>№{item.number}</Text>
                  <Text style={styles.animalGroup}>Группа: {item.group || '-'}</Text>
                </View>
                
                <View style={styles.animalInfoRow}>
                  <Text style={styles.animalType}>{item.type}</Text>
                  <Text style={styles.animalResponder}>Респондер: {item.responder || '-'}</Text>
                </View>
                
                {item.gender === 'female' && item.lactationNumber && (
                  <Text style={styles.animalLactation}>
                    Лактация: {item.lactationNumber}, Ср.удой: {item.averageMilk}
                  </Text>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Животные не найдены</Text>
          </View>
        )}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AnimalAdd')}
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
    padding: 8,
  },
  animalItem: {
    backgroundColor: '#FFFFFF',
  },
  card: {
    elevation: 2,
  },
  animalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  animalNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  animalGroup: {
    fontSize: 14,
    color: '#757575',
  },
  animalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  animalType: {
    fontSize: 14,
    color: '#616161',
  },
  animalResponder: {
    fontSize: 14,
    color: '#757575',
  },
  animalLactation: {
    fontSize: 14,
    color: '#757575',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
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