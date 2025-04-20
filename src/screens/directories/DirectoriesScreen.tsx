// src/screens/directories/DirectoriesScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, List, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DirectoriesStackParamList } from '../../navigation/MainNavigator';

type DirectoriesScreenNavigationProp = NativeStackNavigationProp<DirectoriesStackParamList, 'Directories'>;

const DirectoriesScreen: React.FC = () => {
  const navigation = useNavigation<DirectoriesScreenNavigationProp>();

  const directories = [
    {
      id: 'executors',
      title: 'Исполнители',
      description: 'Ветеринары и другие сотрудники',
      icon: 'account-group',
      navigate: () => navigation.navigate('ExecutorList'),
    },
    {
      id: 'diseases',
      title: 'Заболевания',
      description: 'Справочник заболеваний',
      icon: 'virus',
      navigate: () => navigation.navigate('DiseaseList'),
    },
    {
      id: 'bulls',
      title: 'Быки',
      description: 'Справочник быков для осеменения',
      icon: 'cow',
      navigate: () => navigation.navigate('BullList'),
    },
    {
      id: 'vaccines',
      title: 'Вакцины',
      description: 'Справочник вакцин',
      icon: 'needle',
      navigate: () => navigation.navigate('VaccineList'),
    },
    {
      id: 'medicines',
      title: 'Лекарства',
      description: 'Справочник лекарственных препаратов',
      icon: 'pill',
      navigate: () => navigation.navigate('MedicineList'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Справочники</Text>
          <Text style={styles.description}>
            Управление справочниками для ветеринарных операций
          </Text>
          
          <View style={styles.directoriesContainer}>
            {directories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.directoryItem}
                onPress={item.navigate}
              >
                <List.Item
                  title={item.title}
                  description={item.description}
                  left={() => <Avatar.Icon size={40} icon={item.icon} style={styles.icon} />}
                  right={() => <List.Icon icon="chevron-right" />}
                  style={styles.listItem}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#424242',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  directoriesContainer: {
    marginTop: 8,
  },
  directoryItem: {
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: '#2196F3',
  },
  listItem: {
    padding: 0,
  },
});

export default DirectoriesScreen;