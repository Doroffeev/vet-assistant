// src/screens/directories/BullFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bull } from '../../types';
import { getBullById, addBull, updateBull, deleteBull } from '../../database/repositories/BullRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type BullFormScreenRouteProp = RouteProp<DirectoriesStackParamList, 'BullForm'>;
type BullFormScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'BullForm'>;

const BullFormScreen: React.FC = () => {
  const navigation = useNavigation<BullFormScreenNavigationProp>();
  const route = useRoute<BullFormScreenRouteProp>();
  const { bullId } = route.params || {};
  const isEditMode = !!bullId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // Форма быка
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [breed, setBreed] = useState('');
  const [notes, setNotes] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных быка в режиме редактирования
  useEffect(() => {
    const loadBull = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const bull = await getBullById(bullId);
        if (!bull) {
          throw new Error('Бык не найден');
        }
        
        setName(bull.name);
        setNumber(bull.number || '');
        setBreed(bull.breed || '');
        setNotes(bull.notes || '');
      } catch (err) {
        setError('Не удалось загрузить данные быка');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBull();
  }, [isEditMode, bullId]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Имя быка обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение быка
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const bullData: Omit<Bull, 'id'> = {
        name,
        number: number || undefined,
        breed: breed || undefined,
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateBull({ ...bullData, id: bullId });
      } else {
        await addBull(bullData);
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные быка'
          : 'Не удалось добавить нового быка'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Удаление быка
  const handleDelete = async () => {
    try {
      await deleteBull(bullId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить быка');
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Загрузка данных..." />;
  }
  
  if (error) {
    return <ErrorScreen message={error} onRetry={() => navigation.goBack()} />;
  }
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Информация о быке</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Имя <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Введите имя быка"
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Номер</Text>
            <TextInput
              style={styles.textInput}
              value={number}
              onChangeText={setNumber}
              placeholder="Введите номер быка"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Порода</Text>
            <TextInput
              style={styles.textInput}
              value={breed}
              onChangeText={setBreed}
              placeholder="Введите породу"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Примечания</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Введите примечания"
              multiline
              numberOfLines={4}
            />
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={formSubmitting}
          disabled={formSubmitting}
          style={styles.saveButton}
        >
          {isEditMode ? 'Сохранить изменения' : 'Добавить быка'}
        </Button>
        
        {isEditMode && (
          <Button
            mode="contained"
            buttonColor="#D32F2F"
            onPress={() => setConfirmDeleteVisible(true)}
            style={styles.deleteButton}
            disabled={formSubmitting}
          >
            Удалить быка
          </Button>
        )}
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={formSubmitting}
        >
          Отмена
        </Button>
      </View>
      
      <ConfirmationDialog
        visible={confirmDeleteVisible}
        title="Удаление быка"
        message={`Вы уверены, что хотите удалить быка "${name}"? Это действие нельзя будет отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteVisible(false)}
        destructive
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#424242',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#424242',
  },
  required: {
    color: '#D32F2F',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 8,
  },
  deleteButton: {
    marginBottom: 8,
  },
  cancelButton: {
    borderColor: '#BDBDBD',
  },
});

export default BullFormScreen;