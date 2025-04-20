// src/types/index.ts - Типы данных
export interface Animal {
  id?: number;
  number: string;         // Номер животного
  responder?: string;     // Номер респондера
  group?: string;         // Группа
  lastDeliveryDate?: string; // Дата последнего отёла (Посл. отел)
  nextDeliveryDate?: string; // Ожидаемая дата следующего отёла (След. отел)
  lactationNumber?: number; // Номер лактации
  averageMilk?: number;   // Средний удой
  milkByLactation?: number; // Молоко по лактации
  lastDeliveryDays?: number; // Дни (после отела)
  nextDeliveryDays?: number; // Дни (до след. отела)
  gender: 'male' | 'female'; // Пол
  type: string;           // Тип животного
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}

export interface Operation {
  id?: number;
  animalId: number;       // ID животного
  type: string;           // Тип операции (из OPERATION_TYPES)
  date: string;           // Дата операции
  diagnosis?: string;     // Диагноз (для лечения)
  medicine?: string;      // Лекарство
  dose?: string;          // Доза
  bull?: string;          // Бык (для осеменения)
  vaccine?: string;       // Вакцина (для вакцинации)
  executorId?: number;    // ID исполнителя
  result?: string;        // Результат
  notes?: string;         // Примечания
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}

export interface Executor {
  id?: number;
  name: string;           // ФИО исполнителя
  position?: string;      // Должность
  contact?: string;       // Контактная информация
  notes?: string;         // Примечания
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}

export interface Disease {
  id?: number;
  name: string;           // Название заболевания
  description?: string;   // Описание
  symptoms?: string;      // Симптомы
  treatment?: string;     // Лечение
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}

export interface Bull {
  id?: number;
  name: string;           // Имя быка
  number?: string;        // Номер
  breed?: string;         // Порода
  notes?: string;         // Примечания
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}

export interface Vaccine {
  id?: number;
  name: string;           // Название вакцины
  manufacturer?: string;  // Производитель
  dosage?: string;        // Дозировка
  instructions?: string;  // Инструкция по применению
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}

export interface Medicine {
  id?: number;
  name: string;           // Название препарата
  activeIngredient?: string; // Активное вещество
  manufacturer?: string;  // Производитель
  dosage?: string;        // Дозировка
  instructions?: string;  // Инструкция по применению
  createdAt: string;      // Дата создания записи
  updatedAt: string;      // Дата обновления записи
}