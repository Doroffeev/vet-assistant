import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import DatePickerField from '../../components/DatePickerField';
import { useDatabase } from '../../context/DatabaseContext';

const AnimalDetailCard = ({ animal, onSave, onCancel, isEditing = false }) => {
  const { isDbReady } = useDatabase();
  const [editing, setEditing] = useState(isEditing);
  const [formData, setFormData] = useState({
    number: animal?.number || '',
    responder: animal?.responder || '',
    group: animal?.group || '',
    lastDeliveryDate: animal?.lastDeliveryDate || null,
    nextDeliveryDate: animal?.nextDeliveryDate || null,
    lactationNumber: animal?.lactationNumber?.toString() || '',
    averageMilk: animal?.averageMilk?.toString() || '',
    milkByLactation: animal?.milkByLactation?.toString() || '',
    lastDeliveryDays: animal?.lastDeliveryDays?.toString() || '',
    nextDeliveryDays: animal?.nextDeliveryDays?.toString() || '',
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = () => {
    // Конвертируем строковые поля в числовые
    const updatedAnimal = {
      ...animal,
      ...formData,
      lactationNumber: formData.lactationNumber ? parseInt(formData.lactationNumber) : undefined,
      averageMilk: formData.averageMilk ? parseFloat(formData.averageMilk) : undefined,
      milkByLactation: formData.milkByLactation ? parseFloat(formData.milkByLactation) : undefined,
      lastDeliveryDays: formData.lastDeliveryDays ? parseInt(formData.lastDeliveryDays) : undefined,
      nextDeliveryDays: formData.nextDeliveryDays ? parseInt(formData.nextDeliveryDays) : undefined,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedAnimal);
    setEditing(false);
  };

  const renderReadOnlyView = () => (
    <Card.Content>
      <View style={styles.headerRow}>
        <View style={styles.headerField}>
          <Text style={styles.fieldLabel}>Номер жив-го</Text>
          <Text style={styles.fieldValue}>{animal.number}</Text>
        </View>
        <Button 
          mode="outlined" 
          onPress={() => setEditing(true)}
          disabled={!isDbReady}
        >
          Редактировать
        </Button>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Респондер</Text>
          <Text style={styles.fieldValue}>{animal.responder || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Группа</Text>
          <Text style={styles.fieldValue}>{animal.group || '-'}</Text>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Посл. отел</Text>
          <Text style={styles.fieldValue}>{animal.lastDeliveryDate || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Дни</Text>
          <Text style={styles.fieldValue}>{animal.lastDeliveryDays || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>След. отел</Text>
          <Text style={styles.fieldValue}>{animal.nextDeliveryDate || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Дни</Text>
          <Text style={styles.fieldValue}>{animal.nextDeliveryDays || '-'}</Text>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Лактация</Text>
          <Text style={styles.fieldValue}>{animal.lactationNumber || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>№ осем.</Text>
          <Text style={styles.fieldValue}>{animal.inseminationCount || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Средн.удой</Text>
          <Text style={styles.fieldValue}>{animal.averageMilk || '-'}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>По лакт.</Text>
          <Text style={styles.fieldValue}>{animal.milkByLactation || '-'}</Text>
        </View>
      </View>
    </Card.Content>
  );

  const renderEditForm = () => (
    <Card.Content>
      <View style={styles.headerRow}>
        <View style={styles.headerField}>
          <Text style={styles.fieldLabel}>Номер жив-го</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.number}
            onChangeText={(value) => handleChange('number', value)}
          />
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Респондер</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.responder}
            onChangeText={(value) => handleChange('responder', value)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Группа</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.group}
            onChangeText={(value) => handleChange('group', value)}
          />
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Посл. отел</Text>
          <DatePickerField
            value={formData.lastDeliveryDate}
            onChange={(date) => handleChange('lastDeliveryDate', date)}
            placeholder="ДД.ММ.ГГ"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Дни</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.lastDeliveryDays}
            onChangeText={(value) => handleChange('lastDeliveryDays', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>След. отел</Text>
          <DatePickerField
            value={formData.nextDeliveryDate}
            onChange={(date) => handleChange('nextDeliveryDate', date)}
            placeholder="ДД.ММ.ГГ"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Дни</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.nextDeliveryDays}
            onChangeText={(value) => handleChange('nextDeliveryDays', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Лактация</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.lactationNumber}
            onChangeText={(value) => handleChange('lactationNumber', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>№ осем.</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.inseminationCount}
            onChangeText={(value) => handleChange('inseminationCount', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Средн.удой</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.averageMilk}
            onChangeText={(value) => handleChange('averageMilk', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>По лакт.</Text>
          <TextInput 
            style={styles.textInput}
            value={formData.milkByLactation}
            onChangeText={(value) => handleChange('milkByLactation', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Сохранить
        </Button>
        <Button mode="outlined" onPress={() => {
          setFormData({
            number: animal?.number || '',
            responder: animal?.responder || '',
            group: animal?.group || '',
            lastDeliveryDate: animal?.lastDeliveryDate || null,
            nextDeliveryDate: animal?.nextDeliveryDate || null,
            lactationNumber: animal?.lactationNumber?.toString() || '',
            averageMilk: animal?.averageMilk?.toString() || '',
            milkByLactation: animal?.milkByLactation?.toString() || '',
            lastDeliveryDays: animal?.lastDeliveryDays?.toString() || '',
            nextDeliveryDays: animal?.nextDeliveryDays?.toString() || '',
          });
          setEditing(false);
          if (onCancel) onCancel();
        }} style={styles.button}>
          Отмена
        </Button>
      </View>
    </Card.Content>
  );

  return (
    <Card style={styles.card}>
      {editing ? renderEditForm() : renderReadOnlyView()}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerField: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  field: {
    flex: 1,
    marginHorizontal: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  }
});

export default AnimalDetailCard;