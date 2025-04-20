// src/database/DatabaseService.ts - Полная версия
import { DB_NAME } from '../constants/appConstants';

// Имитация типа WebSQLDatabase
interface MockDatabase {
  transaction: (
    txFunction: (tx: any) => void, 
    errorCallback?: (error: any) => boolean | void, 
    successCallback?: () => void
  ) => void;
}

// Мок объект транзакции
const mockTx = {
  executeSql: (
    sql: string, 
    params: any[], 
    successCallback?: (tx: any, resultSet: any) => void,
    errorCallback?: (tx: any, error: any) => boolean
  ) => {
    console.log('Mock executeSql:', sql);
    if (successCallback) {
      successCallback(mockTx, { rows: { length: 0, item: () => ({}) } });
    }
  }
};

// Мок объект базы данных
let db: MockDatabase = {
  transaction: (txFunction, errorCallback, successCallback) => {
    console.log('Mock transaction called');
    setTimeout(() => {
      try {
        txFunction(mockTx);
        if (successCallback) {
          console.log('Calling success callback after 1 second');
          successCallback();
        }
      } catch (error) {
        console.error('Error in transaction:', error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    }, 1000); // Симуляция асинхронности
  }
};

// Инициализация БД
export const initDatabase = async (): Promise<MockDatabase> => {
  console.log('Mock initDatabase called');
  
  return new Promise((resolve) => {
    console.log('Starting mock database initialization');
    
    // Имитируем задержку открытия БД
    setTimeout(() => {
      console.log('Mock database initialized successfully');
      resolve(db);
    }, 2000);
  });
};

// Получение экземпляра базы данных
export const getDatabase = (): MockDatabase => {
  return db;
};

// Выполнение SQL-запроса
export const executeQuery = (
  sql: string, 
  params: any[] = []
): Promise<any> => {
  console.log('Mock executeQuery:', sql, params);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        rows: { 
          length: 0, 
          item: () => ({}) 
        },
        insertId: 1 // Добавлено для поддержки операций добавления
      });
    }, 500);
  });
};

// Заглушка для функции createTables
export const createTables = (database: MockDatabase): void => {
  console.log('Mock createTables called');
};