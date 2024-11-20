import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/Task';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  // Função para salvar tarefas no AsyncStorage
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
      console.log('Tarefas salvas:', tasks); // Log para verificar as tarefas salvas
    } catch (error) {
      console.error('Erro ao salvar as tarefas:', error);
    }
  };

  // Função para carregar tarefas do AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTaskItems(parsedTasks);
        console.log('Tarefas carregadas:', parsedTasks); // Log para verificar as tarefas carregadas
      } else {
        console.log('Nenhuma tarefa encontrada no AsyncStorage');
      }
    } catch (error) {
      console.error('Erro ao carregar as tarefas:', error);
    }
  };

  // Carregar tarefas ao abrir o app
  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = () => {
    if (task) {
      Keyboard.dismiss();
      const updatedTasks = [...taskItems, task];
      setTaskItems(updatedTasks);
      saveTasks(updatedTasks); // Salva no AsyncStorage
      setTask('');
    }
  };

  const completeTask = (index) => {
    const updatedTasks = [...taskItems];
    updatedTasks.splice(index, 1);
    setTaskItems(updatedTasks);
    saveTasks(updatedTasks); // Atualiza no AsyncStorage
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder="Escreva uma tarefa"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
