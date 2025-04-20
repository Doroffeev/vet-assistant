// src/database/SimpleDatabaseService.js
import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'vet_assistant.db';

export const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Initializing SQLite database');
      const db = SQLite.openDatabase(DB_NAME);
      
      // Создаем таблицы
      createTables(db);
      
      // Проверяем, что база данных инициализирована
      db.transaction(
        tx => {
          tx.executeSql('SELECT 1 FROM sqlite_master LIMIT 1');
        },
        error => {
          console.error('Error checking database:', error);
          reject(error);
        },
        () => {
          console.log('Database initialized successfully');
          resolve(db);
        }
      );
    } catch (error) {
      console.error('Error initializing database:', error);
      reject(error);
    }
  });
};

// Функция для создания основных таблиц
export const createTables = (db) => {
  db.transaction(tx => {
    // Таблица животных
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number TEXT NOT NULL,
        responder TEXT,
        group_name TEXT,
        birth_date TEXT,
        gender TEXT NOT NULL,
        type TEXT NOT NULL,
        last_delivery_date TEXT,
        next_delivery_date TEXT,
        last_insemination_date TEXT,
        lactation_number INTEGER,
        insemination_count INTEGER,
        average_milk REAL,
        milk_by_lactation REAL,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    
    // Таблица операций
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        diagnosis TEXT,
        medicine TEXT,
        dose TEXT,
        bull TEXT,
        vaccine TEXT,
        executor_id INTEGER,
        result TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (animal_id) REFERENCES animals (id) ON DELETE CASCADE
      )
    `);
    
    // Таблица исполнителей
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS executors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT,
        contact TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    
    // Таблица заболеваний
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS diseases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        symptoms TEXT,
        treatment TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    
    // Таблица быков
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS bulls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        number TEXT,
        breed TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    
    // Таблица вакцин
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS vaccines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        manufacturer TEXT,
        dosage TEXT,
        instructions TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    
    // Таблица лекарств
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        active_ingredient TEXT,
        manufacturer TEXT,
        dosage TEXT,
        instructions TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  });
};

// Вспомогательные функции для работы с БД 
export const getDatabase = () => {
  return SQLite.openDatabase(DB_NAME);
};

export const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        sql, 
        params,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.error('SQL Error:', sql, error);
          reject(error);
          return false;
        }
      );
    });
  });
};