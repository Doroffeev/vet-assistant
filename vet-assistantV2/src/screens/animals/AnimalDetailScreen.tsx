// src/screens/animals/AnimalDetailScreen.tsx - Экран подробной информации о животном
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Divider, Button, FAB, Portal, List, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Animal, Operation } from '../../types';
import { getAnimalById, deleteAnimal } from '../../database/repositories/AnimalRepository';
import { getOperationsByAnimalId } from '../../database/repositories/OperationRepository';
import { AnimalStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import EmptyListMessage from '../../components/EmptyListMessage';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type AnimalDetailScreenRouteProp = RouteProp<AnimalStackParamList, 'AnimalDetail'>;
type AnimalDetailScreenNavigationProp = NativeStackNavigationProp<AnimalStackParamList, 'AnimalDetail'>;

const AnimalDetailScreen: React.FC = () => {
  const navigation = useNavigation<AnimalDetailScreenNavigationProp>();
  const route = useRoute<AnimalDetailScreenRouteProp>();
  const { animalId } = route.params;
  
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  useEffect(() => {
    const loadAnimalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const animalData = await getAnimalById(animalId);
        if (!animalData) {
          throw new Error('Животное не найдено');
        }
        
        setAnimal(animalData);
        
        const operationsData = await getOperationsByAnimalId(animalId);
        setOperations(operationsData);
      } catch (err) {
        setError('Не удалось загрузить данные животного');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnimalData();
  }, [animalId]);
  
  const handleEdit = () => {
    navigation.navigate('AnimalForm', { animalId });
  };
  
  const handleDelete = async () => {
    try {
      await deleteAnimal(animalId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить животное');
    }
  };
  
  const handleAddOperation = () => {
    setFabOpen(false);
    navigation.navigate('OperationForm', { animalId });
  };
  
  const renderOperationItem = (operation: Operation) => {
    const date = operation.date 
      ? format(parseISO(operation.date), 'dd MMMM yyyy', { locale: ru })
      : 'Дата не указана';
    
    const getIconName = () => {
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
      <TouchableOpacity
        key={operation.id}
        onPress={() => navigation.navigate('OperationDetail', { operationId: operation.id! })}
      >
        <List.Item
          title={operation.type}
          description={date}
          left={() => <List.Icon icon={() => <MaterialIcons name={getIconName()} size={24} color="#616161" />} />}
          right={() => <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />}
        />
        <Divider />
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return <LoadingScreen message="Загрузка данных животного..." />;
  }
  
  if (error || !animal) {
    return <ErrorScreen message={error || 'Животное не найдено'} onRetry={() => navigation.goBack()} />;
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    return format(parseISO(dateString), 'dd.MM.yyyy', { locale: ru });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.animalNumber}>{animal.number}</Text>
                <Chip mode="outlined" style={styles.typeChip}>
                  {animal.type}
                </Chip>
              </View>
              <TouchableOpacity onPress={handleEdit}>
                <MaterialIcons name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Респондер:</Text>
                <Text style={styles.infoValue}>{animal.responder || 'Не указан'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Группа:</Text>
                <Text style={styles.infoValue}>{animal.group || 'Не указана'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Пол:</Text>
                <Text style={styles.infoValue}>{animal.gender === 'male' ? 'Мужской' : 'Женский'}</Text>
              </View>
              
              {animal.birthDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Дата рождения:</Text>
                  <Text style={styles.infoValue}>{formatDate(animal.birthDate)}</Text>
                </View>
              )}
            </View>
            
            {(animal.gender === 'female' && animal.lastDeliveryDate) && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Репродуктивная информация</Text>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Последний отёл:</Text>
                    <Text style={styles.infoValue}>{formatDate(animal.lastDeliveryDate)}</Text>
                  </View>
                  
                  {animal.nextDeliveryDate && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Ожидаемый отёл:</Text>
                      <Text style={styles.infoValue}>{formatDate(animal.nextDeliveryDate)}</Text>
                    </View>
                  )}
                  
                  {animal.lastInseminationDate && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Последнее осеменение:</Text>
                      <Text style={styles.infoValue}>{formatDate(animal.lastInseminationDate)}</Text>
                    </View>
                  )}
                  
                  {animal.inseminationCount !== undefined && animal.inseminationCount > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Кол-во осеменений:</Text>
                      <Text style={styles.infoValue}>{animal.inseminationCount}</Text>
                    </View>
                  )}
                </View>
              </>
            )}
            
            {(animal.lactationNumber !== undefined || animal.averageMilk !== undefined) && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Лактация</Text>
                  
                  {animal.lactationNumber !== undefined && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Номер лактации:</Text>
                      <Text style={styles.infoValue}>{animal.lactationNumber}</Text>
                    </View>
                  )}
                  
                  {animal.averageMilk !== undefined && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Средний удой:</Text>
                      <Text style={styles.infoValue}>{animal.averageMilk} кг</Text>
                    </View>
                  )}
                  
                  {animal.milkByLactation !== undefined && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>По лактации:</Text>
                      <Text style={styles.infoValue}>{animal.milkByLactation} кг</Text>
                    </View>
                  )}
                </View>
              </>
            )}
            
            {animal.notes && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Примечания</Text>
                  <Text style={styles.notes}>{animal.notes}</Text>
                </View>
              </>
            )}
            
            <Divider style={styles.divider} />
            
            <Button 
              mode="contained" 
              buttonColor="#D32F2F"
              style={styles.deleteButton}
              onPress={() => setConfirmDeleteVisible(true)}
            >
              Удалить животное
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.operationsHeader}>
              <Text style={styles.operationsTitle}>История операций</Text>
              <TouchableOpacity onPress={handleAddOperation}>
                <Text style={styles.addOperationText}>Добавить</Text>
              </TouchableOpacity>
            </View>
            
            {operations.length === 0 ? (
              <EmptyListMessage 
                message="Нет записей об операциях" 
                icon="healing"
              />
            ) : (
              <View style={styles.operationsList}>
                {operations.map(renderOperationItem)}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      <Portal>
        <FAB.Group
          open={fabOpen}
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'medical-services',
              label: 'Добавить операцию',
              onPress: handleAddOperation,
            },
            {
              icon: 'edit',
              label: 'Редактировать животное',
              onPress: handleEdit,
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
        />
      </Portal>
      
      <ConfirmationDialog
        visible={confirmDeleteVisible}
        title="Удаление животного"
        message={`Вы уверены, что хотите удалить животное №${animal.number}? Это действие нельзя будет отменить.`}
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
  animalNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#424242',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 150,
    fontSize: 16,
    color: '#757575',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  notes: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 22,
  },
  deleteButton: {
    marginTop: 8,
  },
  operationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  operationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  addOperationText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  operationsList: {
    marginTop: 8,
  },
});

export default AnimalDetailScreen;