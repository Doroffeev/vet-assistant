// src/database/repositories/AnimalRepository.ts - Репозиторий для работы с животными
import { executeQuery } from '../DatabaseService';
import { Animal } from '../../types';

export const addAnimal = async (animal: Omit<Animal, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO animals (
      number, responder, group_name, birth_date, gender, type,
      last_delivery_date, next_delivery_date, last_insemination_date,
      lactation_number, insemination_count, average_milk,
      milk_by_lactation, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      animal.number,
      animal.responder || null,
      animal.group || null,
      animal.birthDate || null,
      animal.gender,
      animal.type,
      animal.lastDeliveryDate || null,
      animal.nextDeliveryDate || null,
      animal.lastInseminationDate || null,
      animal.lactationNumber || null,
      animal.inseminationCount || null,
      animal.averageMilk || null,
      animal.milkByLactation || null,
      animal.notes || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateAnimal = async (animal: Animal): Promise<void> => {
  if (!animal.id) throw new Error('Animal ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE animals SET
      number = ?,
      responder = ?,
      group_name = ?,
      birth_date = ?,
      gender = ?,
      type = ?,
      last_delivery_date = ?,
      next_delivery_date = ?,
      last_insemination_date = ?,
      lactation_number = ?,
      insemination_count = ?,
      average_milk = ?,
      milk_by_lactation = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      animal.number,
      animal.responder || null,
      animal.group || null,
      animal.birthDate || null,
      animal.gender,
      animal.type,
      animal.lastDeliveryDate || null,
      animal.nextDeliveryDate || null,
      animal.lastInseminationDate || null,
      animal.lactationNumber || null,
      animal.inseminationCount || null,
      animal.averageMilk || null,
      animal.milkByLactation || null,
      animal.notes || null,
      now,
      animal.id
    ]
  );
};

export const deleteAnimal = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM animals WHERE id = ?', [id]);
};

export const getAnimalById = async (id: number): Promise<Animal | null> => {
  const result = await executeQuery(
    `SELECT 
      id, number, responder, group_name as group, birth_date as birthDate, 
      gender, type, last_delivery_date as lastDeliveryDate, 
      next_delivery_date as nextDeliveryDate, 
      last_insemination_date as lastInseminationDate,
      lactation_number as lactationNumber, insemination_count as inseminationCount, 
      average_milk as averageMilk, milk_by_lactation as milkByLactation, 
      notes, created_at as createdAt, updated_at as updatedAt
    FROM animals WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Animal;
};

export const getAllAnimals = async (): Promise<Animal[]> => {
  const result = await executeQuery(
    `SELECT 
      id, number, responder, group_name as group, birth_date as birthDate, 
      gender, type, last_delivery_date as lastDeliveryDate, 
      next_delivery_date as nextDeliveryDate, 
      last_insemination_date as lastInseminationDate,
      lactation_number as lactationNumber, insemination_count as inseminationCount, 
      average_milk as averageMilk, milk_by_lactation as milkByLactation, 
      notes, created_at as createdAt, updated_at as updatedAt
    FROM animals
    ORDER BY number ASC`
  );
  
  const animals: Animal[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    animals.push(result.rows.item(i) as Animal);
  }
  
  return animals;
};

export const getAnimalsByGroup = async (group: string): Promise<Animal[]> => {
  const result = await executeQuery(
    `SELECT 
      id, number, responder, group_name as group, birth_date as birthDate, 
      gender, type, last_delivery_date as lastDeliveryDate, 
      next_delivery_date as nextDeliveryDate, 
      last_insemination_date as lastInseminationDate,
      lactation_number as lactationNumber, insemination_count as inseminationCount, 
      average_milk as averageMilk, milk_by_lactation as milkByLactation, 
      notes, created_at as createdAt, updated_at as updatedAt
    FROM animals
    WHERE group_name = ?
    ORDER BY number ASC`,
    [group]
  );
  
  const animals: Animal[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    animals.push(result.rows.item(i) as Animal);
  }
  
  return animals;
};

export const searchAnimals = async (searchTerm: string): Promise<Animal[]> => {
  const result = await executeQuery(
    `SELECT 
      id, number, responder, group_name as group, birth_date as birthDate, 
      gender, type, last_delivery_date as lastDeliveryDate, 
      next_delivery_date as nextDeliveryDate, 
      last_insemination_date as lastInseminationDate,
      lactation_number as lactationNumber, insemination_count as inseminationCount, 
      average_milk as averageMilk, milk_by_lactation as milkByLactation, 
      notes, created_at as createdAt, updated_at as updatedAt
    FROM animals
    WHERE number LIKE ? OR responder LIKE ?
    ORDER BY number ASC`,
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );
  
  const animals: Animal[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    animals.push(result.rows.item(i) as Animal);
  }
  
  return animals;
};

function mapDbRowToAnimal(row: any): Animal {
  return {
    id: row.id,
    number: row.number,
    responder: row.responder,
    group: row.group_name, // Маппинг из snake_case в camelCase
    birthDate: row.birth_date,
    gender: row.gender,
    type: row.type,
    lastDeliveryDate: row.last_delivery_date,
    nextDeliveryDate: row.next_delivery_date,
    lastInseminationDate: row.last_insemination_date,
    lactationNumber: row.lactation_number,
    inseminationCount: row.insemination_count,
    averageMilk: row.average_milk,
    milkByLactation: row.milk_by_lactation,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}