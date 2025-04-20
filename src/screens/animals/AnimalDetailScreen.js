import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AnimalDetailCard from './AnimalDetailCard';
import { useDatabase } from '../../context/DatabaseContext';

const AnimalDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { animal: initialAnimal } = route.params;
  const { isDbReady } = useDatabase();
  
  const [animal, setAnimal] = useState(initialAnimal);
  
  const handleSave = (updatedAnimal) => {
    // В реальной реализации здесь будет обновление в БД
    setAnimal(updatedAnimal);
    alert('Данные животного обновлены!');
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <AnimalDetailCard 
          animal={animal} 
          onSave={handleSave}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Назад к списку
          </Button>
          
          <Button 
            mode="contained" 
            buttonColor="#D32F2F"
            onPress={() => {
              // В реальной реализации здесь будет удаление из БД
              alert('Животное удалено!');
              navigation.goBack();
            }}
            style={styles.deleteButton}
          >
            Удалить животное
          </Button>
        </View>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AnimalAdd')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AnimalDetailScreen;