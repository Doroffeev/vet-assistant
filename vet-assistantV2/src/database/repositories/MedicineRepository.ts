// src/database/repositories/MedicineRepository.ts
import { executeQuery } from '../DatabaseService';
import { Medicine } from '../../types';

export const addMedicine = async (medicine: Omit<Medicine, 'id'>): Promise<number> => {
  const now = new Date().toISOString();
  const result = await executeQuery(
    `INSERT INTO medicines (
      name, active_ingredient, manufacturer, dosage, instructions, 
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      medicine.name,
      medicine.activeIngredient || null,
      medicine.manufacturer || null,
      medicine.dosage || null,
      medicine.instructions || null,
      now,
      now
    ]
  );
  
  return result.insertId;
};

export const updateMedicine = async (medicine: Medicine): Promise<void> => {
  if (!medicine.id) throw new Error('Medicine ID is required for update');
  
  const now = new Date().toISOString();
  await executeQuery(
    `UPDATE medicines SET
      name = ?,
      active_ingredient = ?,
      manufacturer = ?,
      dosage = ?,
      instructions = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      medicine.name,
      medicine.activeIngredient || null,
      medicine.manufacturer || null,
      medicine.dosage || null,
      medicine.instructions || null,
      now,
      medicine.id
    ]
  );
};

export const deleteMedicine = async (id: number): Promise<void> => {
  await executeQuery('DELETE FROM medicines WHERE id = ?', [id]);
};

export const getMedicineById = async (id: number): Promise<Medicine | null> => {
  const result = await executeQuery(
    `SELECT 
      id, name, active_ingredient as activeIngredient, 
      manufacturer, dosage, instructions,
      created_at as createdAt, updated_at as updatedAt
    FROM medicines WHERE id = ?`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows.item(0) as Medicine;
};

export const getAllMedicines = async (): Promise<Medicine[]> => {
  const result = await executeQuery(
    `SELECT 
      id, name, active_ingredient as activeIngredient, 
      manufacturer, dosage, instructions,
      created_at as createdAt, updated_at as updatedAt
    FROM medicines
    ORDER BY name ASC`
  );
  
  const medicines: Medicine[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    medicines.push(result.rows.item(i) as Medicine);
  }
  
  return medicines;
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