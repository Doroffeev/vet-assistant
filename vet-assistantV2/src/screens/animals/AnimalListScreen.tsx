// src/screens/animals/AnimalListScreen.tsx - Экран списка животных
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text, FAB, Chip, Divider, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Animal } from '../../types';
import { getAllAnimals, searchAnimals, getAnimalsByGroup } from '../../database/repositories/AnimalRepository';
import { AnimalStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';

type AnimalListScreenNavigationProp = NativeStackNavigationProp<AnimalStackParamList, 'AnimalList'>;

const AnimalListScreen: React.FC = () => {
  const navigation = useNavigation<AnimalListScreenNavigationProp>();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  
  const loadAnimals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let animalsList: Animal[];
      
      if (searchQuery.trim() !== '') {
        animalsList = await searchAnimals(searchQuery);
      } else if (activeGroup) {
        animalsList = await getAnimalsByGroup(activeGroup);
      } else {
        animalsList = await getAllAnimals();
      }
      
      setAnimals(animalsList);
      
      // Получаем уникальные группы для фильтрации
      const uniqueGroups = Array.from(new Set(
        animalsList
          .map(animal => animal.group)
          .filter(group => group && group.trim() !== '') as string[]
      ));
      
      setGroups(uniqueGroups);
    } catch (err) {
      setError('Не удалось загрузить список животных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeGroup]);
  
  // Загружаем животных при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadAnimals();
    }, [loadAnimals])
  );
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveGroup(null); // Сбрасываем фильтр по группе при поиске
  };
  
  const handleGroupFilter = (group: string) => {
    if (activeGroup === group) {
      setActiveGroup(null); // Сбрасываем фильтр при повторном нажатии
    } else {
      setActiveGroup(group);
      setSearchQuery(''); // Сбрасываем поиск при фильтрации по группе
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setActiveGroup(null);
  };
  
  const renderAnimalItem = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      style={styles.animalItem}
      onPress={() => navigation.navigate('AnimalDetail', { animalId: item.id! })}
    >
      <View style={styles.animalInfo}>
        <Text style={styles.animalNumber}>{item.number}</Text>
        {item.responder && (
          <Text style={styles.animalResponder}>Респондер: {item.responder}</Text>
        )}
        <View style={styles.animalDetails}>
          <Text style={styles.animalType}>{item.type}</Text>
          {item.group && (
            <Chip style={styles.groupChip} mode="outlined" textStyle={styles.chipText}>
              {item.group}
            </Chip>
          )}
        </View>
        {item.lactationNumber && (
          <Text style={styles.lactation}>Лактация: {item.lactationNumber}</Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );
  
  const renderGroupsFilter = () => (
    <View style={styles.groupsContainer}>
      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Chip
            mode={activeGroup === item ? 'flat' : 'outlined'}
            selected={activeGroup === item}
            style={styles.groupFilterChip}
            onPress={() => handleGroupFilter(item)}
          >
            {item}
          </Chip>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.groupsFilterContent}
      />
    </View>
  );
  
  if (loading) {
    return <LoadingScreen message="Загрузка списка животных..." />;
  }
  
  if (error) {
    return <ErrorScreen message={error} onRetry={loadAnimals} />;
  }
  
  const hasFilters = searchQuery !== '' || activeGroup !== null;
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по номеру или респондеру"
            value={searchQuery}
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
      
      {groups.length > 0 && renderGroupsFilter()}
      
      {hasFilters && (
        <View style={styles.filtersActiveContainer}>
          <Text style={styles.filtersActiveText}>
            {activeGroup ? `Группа: ${activeGroup}` : ''}
            {searchQuery ? `Поиск: ${searchQuery}` : ''}
          </Text>
          <Button
            mode="text"
            onPress={clearFilters}
            compact
            icon="close"
          >
            Сбросить
          </Button>
        </View>
      )}
      
      {animals.length === 0 ? (
        <EmptyListMessage 
          message={hasFilters 
            ? "Нет животных, соответствующих фильтрам" 
            : "Список животных пуст. Нажмите '+', чтобы добавить первое животное."
          }
          icon={hasFilters ? "filter-list-off" : "pets"}
        />
      ) : (
        <FlatList
          data={animals}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderAnimalItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AnimalForm')}
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  groupsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  groupsFilterContent: {
    paddingHorizontal: 16,
  },
  groupFilterChip: {
    marginRight: 8,
  },
  filtersActiveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
  },
  filtersActiveText: {
    fontSize: 14,
    color: '#1976D2',
  },
  listContent: {
    flexGrow: 1,
  },
  animalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  animalInfo: {
    flex: 1,
  },
  animalNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  animalResponder: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  animalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  animalType: {
    fontSize: 14,
    color: '#424242',
    marginRight: 8,
  },
  groupChip: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
  },
  lactation: {
    fontSize: 14,
    color: '#616161',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AnimalListScreen;