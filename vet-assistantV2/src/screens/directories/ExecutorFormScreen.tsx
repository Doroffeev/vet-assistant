// src/screens/directories/ExecutorFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Executor } from '../../types';
import { getExecutorById, addExecutor, updateExecutor, deleteExecutor } from '../../database/repositories/ExecutorRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type ExecutorFormScreenRouteProp = RouteProp<DirectoriesStackParamList, 'ExecutorForm'>;
type ExecutorFormScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'ExecutorForm'>;

const ExecutorFormScreen: React.FC = () => {
  const navigation = useNavigation<ExecutorFormScreenNavigationProp>();
  const route = useRoute<ExecutorFormScreenRouteProp>();
  const { executorId } = route.params || {};
  const isEditMode = !!executorId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // Форма исполнителя
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных исполнителя в режиме редактирования
  useEffect(() => {
    const loadExecutor = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const executor = await getExecutorById(executorId);
        if (!executor) {
          throw new Error('Исполнитель не найден');
        }
        
        setName(executor.name);
        setPosition(executor.position || '');
        setContact(executor.contact || '');
        setNotes(executor.notes || '');
      } catch (err) {
        setError('Не удалось загрузить данные исполнителя');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadExecutor();
  }, [isEditMode, executorId]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Имя исполнителя обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение исполнителя
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const executorData: Omit<Executor, 'id'> = {
        name,
        position: position || undefined,
        contact: contact || undefined,
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateExecutor({ ...executorData, id: executorId });
      } else {
        await addExecutor(executorData);
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные исполнителя'
          : 'Не удалось добавить нового исполнителя'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Удаление исполнителя
  const handleDelete = async () => {
    try {
      await deleteExecutor(executorId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить исполнителя');
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
          <Text style={styles.sectionTitle}>Информация об исполнителе</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              ФИО <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Введите ФИО исполнителя"
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Должность</Text>
            <TextInput
              style={styles.textInput}
              value={position}
              onChangeText={setPosition}
              placeholder="Введите должность"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Контактная информация</Text>
            <TextInput
              style={styles.textInput}
              value={contact}
              onChangeText={setContact}
              placeholder="Введите телефон или e-mail"
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
          {isEditMode ? 'Сохранить изменения' : 'Добавить исполнителя'}
        </Button>
        
        {isEditMode && (
          <Button
            mode="contained"
            buttonColor="#D32F2F"
            onPress={() => setConfirmDeleteVisible(true)}
            style={styles.deleteButton}
            disabled={formSubmitting}
          >
            Удалить исполнителя
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
        title="Удаление исполнителя"
        message={`Вы уверены, что хотите удалить исполнителя "${name}"? Это действие нельзя будет отменить.`}
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

export default ExecutorFormScreen;