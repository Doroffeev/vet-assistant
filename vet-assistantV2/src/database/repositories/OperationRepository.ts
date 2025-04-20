// src/database/repositories/OperationRepository.ts - Репозиторий для работы с операциями
import { executeQuery } from '../DatabaseService';
import { Operation } from '../../types';

export const addOperation = async (operation: Omit<Operation, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO operations (
      animal_id, type, date, diagnosis, medicine, dose,
      bull, vaccine, executor_id, result, notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      operation.animalId,
      operation.type,
      operation.date,
      operation.diagnosis || null,
      operation.medicine || null,
      operation.dose || null,
      operation.bull || null,
      operation.vaccine || null,
      operation.executorId || null,
      operation.result || null,
      operation.notes || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateOperation = async (operation: Operation): Promise<void> => {
  if (!operation.id) throw new Error('Operation ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE operations SET
      animal_id = ?,
      type = ?,
      date = ?,
      diagnosis = ?,
      medicine = ?,
      dose = ?,
      bull = ?,
      vaccine = ?,
      executor_id = ?,
      result = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      operation.animalId,
      operation.type,
      operation.date,
      operation.diagnosis || null,
      operation.medicine || null,
      operation.dose || null,
      operation.bull || null,
      operation.vaccine || null,
      operation.executorId || null,
      operation.result || null,
      operation.notes || null,
      now,
      operation.id
    ]
  );
};

export const deleteOperation = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM operations WHERE id = ?', [id]);
};

export const getOperationById = async (id: number): Promise<Operation | null> => {
  const result = await executeQuery(
    `SELECT 
      id, animal_id as animalId, type, date, diagnosis, medicine, dose,
      bull, vaccine, executor_id as executorId, result, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM operations WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Operation;
};

export const getOperationsByAnimalId = async (animalId: number): Promise<Operation[]> => {
  const result = await executeQuery(
    `SELECT 
      id, animal_id as animalId, type, date, diagnosis, medicine, dose,
      bull, vaccine, executor_id as executorId, result, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM operations
    WHERE animal_id = ?
    ORDER BY date DESC`,
    [animalId]
  );
  
  const operations: Operation[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    operations.push(result.rows.item(i) as Operation);
  }
  
  return operations;
};

export const getOperationsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Operation[]> => {
  const result = await executeQuery(
    `SELECT 
      id, animal_id as animalId, type, date, diagnosis, medicine, dose,
      bull, vaccine, executor_id as executorId, result, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM operations
    WHERE date BETWEEN ? AND ?
    ORDER BY date DESC`,
    [startDate, endDate]
  );
  
  const operations: Operation[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    operations.push(result.rows.item(i) as Operation);
  }
  
  return operations;
};

export const getOperationsByTypeAndDateRange = async (
  type: string,
  startDate: string,
  endDate: string
): Promise<Operation[]> => {
  const result = await executeQuery(
    `SELECT 
      id, animal_id as animalId, type, date, diagnosis, medicine, dose,
      bull, vaccine, executor_id as executorId, result, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM operations
    WHERE type = ? AND date BETWEEN ? AND ?
    ORDER BY date DESC`,
    [type, startDate, endDate]
  );
  
  const operations: Operation[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    operations.push(result.rows.item(i) as Operation);
  }
  
  return operations;
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