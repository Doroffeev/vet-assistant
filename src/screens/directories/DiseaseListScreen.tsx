// src/screens/directories/DiseaseListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Divider, Searchbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Disease } from '../../types';
import { getAllDiseases } from '../../database/repositories/DiseaseRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';

type DiseaseListScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'DiseaseList'>;

const DiseaseListScreen: React.FC = () => {
  const navigation = useNavigation<DiseaseListScreenNavigationProp>();
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadDiseases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const diseasesData = await getAllDiseases();
      setDiseases(diseasesData);
      setFilteredDiseases(diseasesData);
    } catch (err) {
      setError('Не удалось загрузить список заболеваний');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadDiseases();
    }, [loadDiseases])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredDiseases(diseases);
    } else {
      const filtered = diseases.filter(
        disease => disease.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDiseases(filtered);
    }
  };

  const renderDiseaseItem = ({ item }: { item: Disease }) => (
    <TouchableOpacity
      style={styles.diseaseItem}
      onPress={() => navigation.navigate('DiseaseForm', { diseaseId: item.id })}
    >
      <View style={styles.diseaseInfo}>
        <Text style={styles.diseaseName}>{item.name}</Text>
        {item.symptoms && (
          <Text style={styles.diseaseSymptoms} numberOfLines={2}>
            Симптомы: {item.symptoms}
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen message="Загрузка списка заболеваний..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={loadDiseases} />;
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
      
      {filteredDiseases.length === 0 ? (
        <EmptyListMessage 
          message={
            searchQuery
              ? "Нет заболеваний, соответствующих поиску"
              : "Список заболеваний пуст. Нажмите '+', чтобы добавить заболевание."
          }
          icon="virus-off"
        />
      ) : (
        <FlatList
          data={filteredDiseases}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderDiseaseItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('DiseaseForm')}
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
  diseaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  diseaseSymptoms: {
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

export default DiseaseListScreen;