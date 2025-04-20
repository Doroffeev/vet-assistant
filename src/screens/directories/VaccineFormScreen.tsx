// src/screens/directories/VaccineFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Vaccine } from '../../types';
import { getVaccineById, addVaccine, updateVaccine, deleteVaccine } from '../../database/repositories/VaccineRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type VaccineFormScreenRouteProp = RouteProp<DirectoriesStackParamList, 'VaccineForm'>;
type VaccineFormScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'VaccineForm'>;

const VaccineFormScreen: React.FC = () => {
  const navigation = useNavigation<VaccineFormScreenNavigationProp>();
  const route = useRoute<VaccineFormScreenRouteProp>();
  const { vaccineId } = route.params || {};
  const isEditMode = !!vaccineId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // Форма вакцины
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных вакцины в режиме редактирования
  useEffect(() => {
    const loadVaccine = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const vaccine = await getVaccineById(vaccineId);
        if (!vaccine) {
          throw new Error('Вакцина не найдена');
        }
        
        setName(vaccine.name);
        setManufacturer(vaccine.manufacturer || '');
        setDosage(vaccine.dosage || '');
        setInstructions(vaccine.instructions || '');
      } catch (err) {
        setError('Не удалось загрузить данные вакцины');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadVaccine();
  }, [isEditMode, vaccineId]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Название вакцины обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение вакцины
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const vaccineData: Omit<Vaccine, 'id'> = {
        name,
        manufacturer: manufacturer || undefined,
        dosage: dosage || undefined,
        instructions: instructions || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateVaccine({ ...vaccineData, id: vaccineId });
      } else {
        await addVaccine(vaccineData);
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные вакцины'
          : 'Не удалось добавить новую вакцину'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Удаление вакцины
  const handleDelete = async () => {
    try {
      await deleteVaccine(vaccineId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить вакцину');
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
          <Text style={styles.sectionTitle}>Информация о вакцине</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Название <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Введите название вакцины"
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Производитель</Text>
            <TextInput
              style={styles.textInput}
              value={manufacturer}
              onChangeText={setManufacturer}
              placeholder="Введите производителя"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Дозировка</Text>
            <TextInput
              style={styles.textInput}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Введите дозировку"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Инструкция по применению</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Введите инструкцию по применению"
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
          {isEditMode ? 'Сохранить изменения' : 'Добавить вакцину'}
        </Button>
        
        {isEditMode && (
          <Button
            mode="contained"
            buttonColor="#D32F2F"
            onPress={() => setConfirmDeleteVisible(true)}
            style={styles.deleteButton}
            disabled={formSubmitting}
          >
            Удалить вакцину
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
        title="Удаление вакцины"
        message={`Вы уверены, что хотите удалить вакцину "${name}"? Это действие нельзя будет отменить.`}
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

export default VaccineFormScreen;