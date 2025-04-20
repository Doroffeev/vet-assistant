// src/database/DataExport.ts - Функции для экспорта данных
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import XLSX from 'xlsx';
import { Animal, Operation } from '../types';
import { getAllAnimals, getAnimalById } from './repositories/AnimalRepository';
import { 
  getOperationsByDateRange, 
  getOperationsByTypeAndDateRange 
} from './repositories/OperationRepository';

// остальной код файла остается без изменений

// Экспорт списка животных в Excel
export const exportAnimalsToExcel = async (): Promise<void> => {
  try {
    const animals = await getAllAnimals();
    
    // Подготовка данных для Excel
    const worksheet = XLSX.utils.json_to_sheet(animals.map(animal => ({
      'Номер': animal.number,
      'Респондер': animal.responder || '',
      'Группа': animal.group || '',
      'Пол': animal.gender === 'male' ? 'Муж.' : 'Жен.',
      'Тип': animal.type,
      'Дата рождения': animal.birthDate || '',
      'Дата последнего отёла': animal.lastDeliveryDate || '',
      'Дата следующего отёла': animal.nextDeliveryDate || '',
      'Дата последнего осеменения': animal.lastInseminationDate || '',
      'Лактация': animal.lactationNumber || '',
      'Кол-во осеменений': animal.inseminationCount || '',
      'Средний удой': animal.averageMilk || '',
      'Молоко по лактации': animal.milkByLactation || '',
      'Примечания': animal.notes || ''
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Животные');
    
    const today = format(new Date(), 'yyyy-MM-dd', { locale: ru });
    const fileName = `animals_${today}.xlsx`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    // Сохранение файла Excel
    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Открытие диалога "Поделиться"
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Экспорт списка животных'
      });
    }
  } catch (error) {
    console.error('Failed to export animals:', error);
    throw error;
  }
};

// Экспорт операций за период в Excel
export const exportOperationsToExcel = async (
  startDate: string,
  endDate: string,
  operationType?: string
): Promise<void> => {
  try {
    // Получаем операции за указанный период
    const operations = operationType
      ? await getOperationsByTypeAndDateRange(operationType, startDate, endDate)
      : await getOperationsByDateRange(startDate, endDate);
    
    // Функция для получения данных о животном
    const getAnimalData = async (animalId: number): Promise<Animal | null> => {
      const animal = await getAnimalById(animalId);
      return animal;
    };
    
    // Для каждой операции добавляем информацию о животном
    const operationsWithAnimals = await Promise.all(
      operations.map(async (operation) => {
        const animal = await getAnimalData(operation.animalId);
        return {
          ...operation,
          animalNumber: animal?.number || 'Неизвестно',
          animalGroup: animal?.group || '',
        };
      })
    );
    
    // Подготовка данных для Excel
    const worksheet = XLSX.utils.json_to_sheet(operationsWithAnimals.map(operation => ({
      'Дата': operation.date,
      'Тип операции': operation.type,
      'Номер животного': operation.animalNumber,
      'Группа': operation.animalGroup,
      'Диагноз': operation.diagnosis || '',
      'Лекарство': operation.medicine || '',
      'Доза': operation.dose || '',
      'Бык': operation.bull || '',
      'Вакцина': operation.vaccine || '',
      'Результат': operation.result || '',
      'Примечания': operation.notes || ''
    })));
    
    const workbook = XLSX.utils.book_new();
    const sheetName = operationType 
      ? `${operationType}` 
      : 'Операции';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd', { locale: ru });
    const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd', { locale: ru });
    const fileName = `operations_${formattedStartDate}_${formattedEndDate}.xlsx`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    // Сохранение файла Excel
    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Открытие диалога "Поделиться"
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Экспорт операций'
      });
    }
  } catch (error) {
    console.error('Failed to export operations:', error);
    throw error;
  }
};