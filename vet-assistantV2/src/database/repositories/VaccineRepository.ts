// src/database/repositories/VaccineRepository.ts
import { executeQuery } from '../DatabaseService';
import { Vaccine } from '../../types';

export const addVaccine = async (vaccine: Omit<Vaccine, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO vaccines (
      name, manufacturer, dosage, instructions, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      vaccine.name,
      vaccine.manufacturer || null,
      vaccine.dosage || null,
      vaccine.instructions || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateVaccine = async (vaccine: Vaccine): Promise<void> => {
  if (!vaccine.id) throw new Error('Vaccine ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE vaccines SET
      name = ?,
      manufacturer = ?,
      dosage = ?,
      instructions = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      vaccine.name,
      vaccine.manufacturer || null,
      vaccine.dosage || null,
      vaccine.instructions || null,
      now,
      vaccine.id
    ]
  );
};

export const deleteVaccine = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM vaccines WHERE id = ?', [id]);
};

export const getVaccineById = async (id: number): Promise<Vaccine | null> => {
  const result = await executeQuery(
    `SELECT 
      id, name, manufacturer, dosage, instructions,
      created_at as createdAt, updated_at as updatedAt
    FROM vaccines WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Vaccine;
};

export const getAllVaccines = async (): Promise<Vaccine[]> => {
  const result = await executeQuery(
    `SELECT 
      id, name, manufacturer, dosage, instructions,
      created_at as createdAt, updated_at as updatedAt
    FROM vaccines
    ORDER BY name ASC`
  );
  
  const vaccines: Vaccine[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    vaccines.push(result.rows.item(i) as Vaccine);
  }
  
  return vaccines;
};