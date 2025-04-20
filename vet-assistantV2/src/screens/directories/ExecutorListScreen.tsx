// src/screens/directories/ExecutorListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Executor } from '../../types';
import { getAllExecutors } from '../../database/repositories/ExecutorRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';

type ExecutorListScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'ExecutorList'>;

const ExecutorListScreen: React.FC = () => {
  const navigation = useNavigation<ExecutorListScreenNavigationProp>();
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [filteredExecutors, setFilteredExecutors] = useState<Executor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadExecutors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const executorsData = await getAllExecutors();
      setExecutors(executorsData);
      setFilteredExecutors(executorsData);
    } catch (err) {
      setError('Не удалось загрузить список исполнителей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadExecutors();
    }, [loadExecutors])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredExecutors(executors);
    } else {
      const filtered = executors.filter(
        executor => executor.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExecutors(filtered);
    }
  };

  const renderExecutorItem = ({ item }: { item: Executor }) => (
    <TouchableOpacity
      style={styles.executorItem}
      onPress={() => navigation.navigate('ExecutorForm', { executorId: item.id })}
    >
      <View style={styles.executorInfo}>
        <Text style={styles.executorName}>{item.name}</Text>
        {item.position && (
          <Text style={styles.executorPosition}>{item.position}</Text>
        )}
        {item.contact && (
          <Text style={styles.executorContact}>{item.contact}</Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen message="Загрузка списка исполнителей..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={loadExecutors} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Поиск по имени"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      {filteredExecutors.length === 0 ? (
        <EmptyListMessage 
          message={
            searchQuery
              ? "Нет исполнителей, соответствующих поиску"
              : "Список исполнителей пуст. Нажмите '+', чтобы добавить исполнителя."
          }
          icon="account-off"
        />
      ) : (
        <FlatList
          data={filteredExecutors}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderExecutorItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('ExecutorForm')}
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
  executorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  executorInfo: {
    flex: 1,
  },
  executorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  executorPosition: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  executorContact: {
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

export default ExecutorListScreen;