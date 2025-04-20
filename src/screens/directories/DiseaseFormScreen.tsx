// src/screens/directories/DiseaseFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Disease } from '../../types';
import { getDiseaseById, addDisease, updateDisease, deleteDisease } from '../../database/repositories/DiseaseRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type DiseaseFormScreenRouteProp = RouteProp<DirectoriesStackParamList, 'DiseaseForm'>;
type DiseaseFormScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'DiseaseForm'>;

const DiseaseFormScreen: React.FC = () => {
  const navigation = useNavigation<DiseaseFormScreenNavigationProp>();
  const route = useRoute<DiseaseFormScreenRouteProp>();
  const { diseaseId } = route.params || {};
  const isEditMode = !!diseaseId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // Форма заболевания
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных заболевания в режиме редактирования
  useEffect(() => {
    const loadDisease = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const disease = await getDiseaseById(diseaseId);
        if (!disease) {
          throw new Error('Заболевание не найдено');
        }
        
        setName(disease.name);
        setDescription(disease.description || '');
        setSymptoms(disease.symptoms || '');
        setTreatment(disease.treatment || '');
      } catch (err) {
        setError('Не удалось загрузить данные заболевания');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDisease();
  }, [isEditMode, diseaseId]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Название заболевания обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение заболевания
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const diseaseData: Omit<Disease, 'id'> = {
        name,
        description: description || undefined,
        symptoms: symptoms || undefined,
        treatment: treatment || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateDisease({ ...diseaseData, id: diseaseId });
      } else {
        await addDisease(diseaseData);
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные заболевания'
          : 'Не удалось добавить новое заболевание'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Удаление заболевания
  const handleDelete = async () => {
    try {
      await deleteDisease(diseaseId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить заболевание');
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
          <Text style={styles.sectionTitle}>Информация о заболевании</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Название <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Введите название заболевания"
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Введите описание заболевания"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Симптомы</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Введите симптомы заболевания"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Лечение</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={treatment}
              onChangeText={setTreatment}
              placeholder="Введите рекомендации по лечению"
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
          {isEditMode ? 'Сохранить изменения' : 'Добавить заболевание'}
        </Button>
        
        {isEditMode && (
          <Button
            mode="contained"
            buttonColor="#D32F2F"
            onPress={() => setConfirmDeleteVisible(true)}
            style={styles.deleteButton}
            disabled={formSubmitting}
          >
            Удалить заболевание
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
        title="Удаление заболевания"
        message={`Вы уверены, что хотите удалить заболевание "${name}"? Это действие нельзя будет отменить.`}
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

export default DiseaseFormScreen;