// src/database/repositories/DiseaseRepository.ts
import { executeQuery } from '../DatabaseService';
import { Disease } from '../../types';

export const addDisease = async (disease: Omit<Disease, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO diseases (
      name, description, symptoms, treatment, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      disease.name,
      disease.description || null,
      disease.symptoms || null,
      disease.treatment || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateDisease = async (disease: Disease): Promise<void> => {
  if (!disease.id) throw new Error('Disease ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE diseases SET
      name = ?,
      description = ?,
      symptoms = ?,
      treatment = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      disease.name,
      disease.description || null,
      disease.symptoms || null,
      disease.treatment || null,
      now,
      disease.id
    ]
  );
};

export const deleteDisease = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM diseases WHERE id = ?', [id]);
};

export const getDiseaseById = async (id: number): Promise<Disease | null> => {
  const result = await executeQuery(
    `SELECT 
      id, name, description, symptoms, treatment,
      created_at as createdAt, updated_at as updatedAt
    FROM diseases WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Disease;
};

export const getAllDiseases = async (): Promise<Disease[]> => {
  const result = await executeQuery(
    `SELECT 
      id, name, description, symptoms, treatment,
      created_at as createdAt, updated_at as updatedAt
    FROM diseases
    ORDER BY name ASC`
  );
  
  const diseases: Disease[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    diseases.push(result.rows.item(i) as Disease);
  }
  
  return diseases;
};

