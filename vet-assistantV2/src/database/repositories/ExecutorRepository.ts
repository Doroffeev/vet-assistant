// src/database/repositories/ExecutorRepository.ts
import { executeQuery } from '../DatabaseService';
import { Executor } from '../../types';

export const addExecutor = async (executor: Omit<Executor, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO executors (
      name, position, contact, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      executor.name,
      executor.position || null,
      executor.contact || null,
      executor.notes || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateExecutor = async (executor: Executor): Promise<void> => {
  if (!executor.id) throw new Error('Executor ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE executors SET
      name = ?,
      position = ?,
      contact = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      executor.name,
      executor.position || null,
      executor.contact || null,
      executor.notes || null,
      now,
      executor.id
    ]
  );
};

export const deleteExecutor = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM executors WHERE id = ?', [id]);
};

export const getExecutorById = async (id: number): Promise<Executor | null> => {
  const result = await executeQuery(
    `SELECT 
      id, name, position, contact, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM executors WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Executor;
};

export const getAllExecutors = async (): Promise<Executor[]> => {
  const result = await executeQuery(
    `SELECT 
      id, name, position, contact, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM executors
    ORDER BY name ASC`
  );
  
  const executors: Executor[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    executors.push(result.rows.item(i) as Executor);
  }
  
  return executors;
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