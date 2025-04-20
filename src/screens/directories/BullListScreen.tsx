// src/screens/directories/BullListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Bull } from '../../types';
import { getAllBulls } from '../../database/repositories/BullRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';

type BullListScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'BullList'>;

const BullListScreen: React.FC = () => {
  const navigation = useNavigation<BullListScreenNavigationProp>();
  const [bulls, setBulls] = useState<Bull[]>([]);
  const [filteredBulls, setFilteredBulls] = useState<Bull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadBulls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bullsData = await getAllBulls();
      setBulls(bullsData);
      setFilteredBulls(bullsData);
    } catch (err) {
      setError('Не удалось загрузить список быков');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadBulls();
    }, [loadBulls])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredBulls(bulls);
    } else {
      const filtered = bulls.filter(
        bull => bull.name.toLowerCase().includes(query.toLowerCase()) ||
        (bull.number && bull.number.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredBulls(filtered);
    }
  };

  const renderBullItem = ({ item }: { item: Bull }) => (
    <TouchableOpacity
      style={styles.bullItem}
      onPress={() => navigation.navigate('BullForm', { bullId: item.id })}
    >
      <View style={styles.bullInfo}>
        <Text style={styles.bullName}>{item.name}</Text>
        {item.number && (
          <Text style={styles.bullNumber}>№{item.number}</Text>
        )}
        {item.breed && (
          <Text style={styles.bullBreed}>{item.breed}</Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen message="Загрузка списка быков..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={loadBulls} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Поиск по имени или номеру"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      {filteredBulls.length === 0 ? (
        <EmptyListMessage 
          message={
            searchQuery
              ? "Нет быков, соответствующих поиску"
              : "Список быков пуст. Нажмите '+', чтобы добавить быка."
          }
          icon="cow"
        />
      ) : (
        <FlatList
          data={filteredBulls}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderBullItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('BullForm')}
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
  bullItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  bullInfo: {
    flex: 1,
  },
  bullName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  bullNumber: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  bullBreed: {
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

export default BullListScreen;