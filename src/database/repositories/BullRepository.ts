// src/database/repositories/BullRepository.ts
import { executeQuery } from '../DatabaseService';
import { Bull } from '../../types';

export const addBull = async (bull: Omit<Bull, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO bulls (
      name, number, breed, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      bull.name,
      bull.number || null,
      bull.breed || null,
      bull.notes || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateBull = async (bull: Bull): Promise<void> => {
  if (!bull.id) throw new Error('Bull ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE bulls SET
      name = ?,
      number = ?,
      breed = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      bull.name,
      bull.number || null,
      bull.breed || null,
      bull.notes || null,
      now,
      bull.id
    ]
  );
};

export const deleteBull = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM bulls WHERE id = ?', [id]);
};

export const getBullById = async (id: number): Promise<Bull | null> => {
  const result = await executeQuery(
    `SELECT 
      id, name, number, breed, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM bulls WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Bull;
};

export const getAllBulls = async (): Promise<Bull[]> => {
  const result = await executeQuery(
    `SELECT 
      id, name, number, breed, notes,
      created_at as createdAt, updated_at as updatedAt
    FROM bulls
    ORDER BY name ASC`
  );
  
  const bulls: Bull[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    bulls.push(result.rows.item(i) as Bull);
  }
  
  return bulls;
};

