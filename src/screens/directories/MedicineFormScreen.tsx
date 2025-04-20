// src/screens/directories/MedicineFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Medicine } from '../../types';
import { getMedicineById, addMedicine, updateMedicine, deleteMedicine } from '../../database/repositories/MedicineRepository';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type MedicineFormScreenRouteProp = RouteProp<DirectoriesStackParamList, 'MedicineForm'>;
type MedicineFormScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'MedicineForm'>;

const MedicineFormScreen: React.FC = () => {
  const navigation = useNavigation<MedicineFormScreenNavigationProp>();
  const route = useRoute<MedicineFormScreenRouteProp>();
  const { medicineId } = route.params || {};
  const isEditMode = !!medicineId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // Форма лекарства
  const [name, setName] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных лекарства в режиме редактирования
  useEffect(() => {
    const loadMedicine = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const medicine = await getMedicineById(medicineId);
        if (!medicine) {
          throw new Error('Лекарство не найдено');
        }
        
        setName(medicine.name);
        setActiveIngredient(medicine.activeIngredient || '');
        setManufacturer(medicine.manufacturer || '');
        setDosage(medicine.dosage || '');
        setInstructions(medicine.instructions || '');
      } catch (err) {
        setError('Не удалось загрузить данные лекарства');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadMedicine();
  }, [isEditMode, medicineId]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Название лекарства обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение лекарства
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const medicineData: Omit<Medicine, 'id'> = {
        name,
        activeIngredient: activeIngredient || undefined,
        manufacturer: manufacturer || undefined,
        dosage: dosage || undefined,
        instructions: instructions || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateMedicine({ ...medicineData, id: medicineId });
      } else {
        await addMedicine(medicineData);
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные лекарства'
          : 'Не удалось добавить новое лекарство'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Удаление лекарства
  const handleDelete = async () => {
    try {
      await deleteMedicine(medicineId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить лекарство');
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
          <Text style={styles.sectionTitle}>Информация о лекарстве</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Название <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Введите название лекарства"
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Активное вещество</Text>
            <TextInput
              style={styles.textInput}
              value={activeIngredient}
              onChangeText={setActiveIngredient}
              placeholder="Введите активное вещество"
            />
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
          {isEditMode ? 'Сохранить изменения' : 'Добавить лекарство'}
        </Button>
        
        {isEditMode && (
          <Button
            mode="contained"
            buttonColor="#D32F2F"
            onPress={() => setConfirmDeleteVisible(true)}
            style={styles.deleteButton}
            disabled={formSubmitting}
          >
            Удалить лекарство
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
        title="Удаление лекарства"
        message={`Вы уверены, что хотите удалить лекарство "${name}"? Это действие нельзя будет отменить.`}
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

export default MedicineFormScreen;