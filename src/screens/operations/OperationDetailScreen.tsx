// src/screens/operations/OperationDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Divider, Button, List, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Operation, Animal } from '../../types';
import { getOperationById, deleteOperation } from '../../database/repositories/OperationRepository';
import { getAnimalById } from '../../database/repositories/AnimalRepository';
import { getExecutorById } from '../../database/repositories/ExecutorRepository';
import { AnimalStackParamList, CalendarStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type AnimalDetailScreenRouteProp = RouteProp<AnimalStackParamList | CalendarStackParamList, 'OperationDetail'>;
type OperationDetailScreenNavigationProp = NativeStackNavigationProp<AnimalStackParamList | CalendarStackParamList, 'OperationDetail'>;

const OperationDetailScreen: React.FC = () => {
  const navigation = useNavigation<OperationDetailScreenNavigationProp>();
  const route = useRoute<AnimalDetailScreenRouteProp>();
  const { operationId } = route.params;
  
  const [operation, setOperation] = useState<Operation | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [executorName, setExecutorName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  useEffect(() => {
    const loadOperationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем данные операции
        const operationData = await getOperationById(operationId);
        if (!operationData) {
          throw new Error('Операция не найдена');
        }
        
        setOperation(operationData);
        
        // Загружаем данные животного
        const animalData = await getAnimalById(operationData.animalId);
        if (animalData) {
          setAnimal(animalData);
        }
        
        // Загружаем данные исполнителя, если есть
        if (operationData.executorId) {
          const executor = await getExecutorById(operationData.executorId);
          if (executor) {
            setExecutorName(executor.name);
          }
        }
      } catch (err) {
        setError('Не удалось загрузить данные операции');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadOperationData();
  }, [operationId]);
  
  const handleEdit = () => {
    navigation.navigate('OperationForm', { operationId });
  };
  
  const handleDelete = async () => {
    try {
      await deleteOperation(operationId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить операцию');
    }
  };
  
  const navigateToAnimal = () => {
    if (animal && animal.id) {
      navigation.navigate('AnimalDetail', { animalId: animal.id });
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Загрузка данных операции..." />;
  }
  
  if (error || !operation) {
    return <ErrorScreen message={error || 'Операция не найдена'} onRetry={() => navigation.goBack()} />;
  }
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: ru });
  };
  
  // Иконка для типа операции
  const getOperationIcon = () => {
    switch (operation.type) {
      case 'Лечение': return 'medical-services';
      case 'Осеменение': return 'water-drop';
      case 'Вакцинация': return 'vaccines';
      case 'Осмотр': return 'search';
      case 'Проверка стельности': return 'monitor-heart';
      case 'Отёл': return 'child-care';
      case 'Хирургическая операция': return 'biotech';
      default: return 'event-note';
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.operationType}>{operation.type}</Text>
                <Text style={styles.operationDate}>{formatDate(operation.date)}</Text>
              </View>
              <TouchableOpacity onPress={handleEdit}>
                <MaterialIcons name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Животное"
              description={animal ? `${animal.number} (${animal.type})` : 'Не найдено'}
              left={() => <List.Icon icon="pets" />}
              right={() => animal && <MaterialIcons name="arrow-forward" size={24} color="#BDBDBD" />}
              onPress={animal ? navigateToAnimal : undefined}
              style={animal ? styles.clickableItem : undefined}
            />
            
            <Divider />
            
            {operation.type === 'Лечение' && (
              <>
                {operation.diagnosis && (
                  <>
                    <List.Item
                      title="Диагноз"
                      description={operation.diagnosis}
                      left={() => <List.Icon icon="stethoscope" />}
                    />
                    <Divider />
                  </>
                )}
                
                {operation.medicine && (
                  <>
                    <List.Item
                      title="Лекарство"
                      description={operation.medicine}
                      left={() => <List.Icon icon="pill" />}
                    />
                    <Divider />
                  </>
                )}
                
                {operation.dose && (
                  <>
                    <List.Item
                      title="Доза"
                      description={operation.dose}
                      left={() => <List.Icon icon="eyedropper" />}
                    />
                    <Divider />
                  </>
                )}
              </>
            )}
            
            {operation.type === 'Осеменение' && operation.bull && (
              <>
                <List.Item
                  title="Бык"
                  description={operation.bull}
                  left={() => <List.Icon icon={() => <MaterialIcons name="pets" size={24} color="#616161" />} />}
                />
                <Divider />
              </>
            )}
            
            {operation.type === 'Вакцинация' && operation.vaccine && (
              <>
                <List.Item
                  title="Вакцина"
                  description={operation.vaccine}
                  left={() => <List.Icon icon="needle" />}
                />
                <Divider />
              </>
            )}
            
            {executorName && (
              <>
                <List.Item
                  title="Исполнитель"
                  description={executorName}
                  left={() => <List.Icon icon="account" />}
                />
                <Divider />
              </>
            )}
            
            {operation.result && (
              <>
                <List.Item
                  title="Результат"
                  description={operation.result}
                  left={() => <List.Icon icon="check-circle" />}
                />
                <Divider />
              </>
            )}
            
            {operation.notes && (
              <>
                <View style={styles.notesContainer}>
                  <Text style={styles.notesTitle}>Примечания:</Text>
                  <Text style={styles.notesText}>{operation.notes}</Text>
                </View>
                <Divider style={styles.divider} />
              </>
            )}
            
            <Button 
              mode="contained" 
              buttonColor="#D32F2F"
              style={styles.deleteButton}
              onPress={() => setConfirmDeleteVisible(true)}
            >
              Удалить операцию
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <ConfirmationDialog
        visible={confirmDeleteVisible}
        title="Удаление операции"
        message={`Вы уверены, что хотите удалить операцию "${operation.type}" от ${formatDate(operation.date)}? Это действие нельзя будет отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteVisible(false)}
        destructive
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  operationType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  operationDate: {
    fontSize: 16,
    color: '#757575',
  },
  divider: {
    marginVertical: 16,
  },
  clickableItem: {
    backgroundColor: '#F5F5F5',
  },
  notesContainer: {
    padding: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#424242',
  },
  notesText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 22,
  },
  deleteButton: {
    marginTop: 8,
  },
});

export default OperationDetailScreen;