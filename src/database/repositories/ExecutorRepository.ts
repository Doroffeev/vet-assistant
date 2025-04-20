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

