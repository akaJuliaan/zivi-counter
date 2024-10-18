import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { DefaultTheme } from '@react-navigation/native';

const SettingsScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Lade das gespeicherte Datum, wenn die Seite geladen wird
    const loadStoredDate = async () => {
      try {
        const storedDate = await AsyncStorage.getItem('ziviStart');
        if (storedDate) {
          setDate(new Date(storedDate));
        }
      } catch (error) {
        console.error('Fehler beim Laden des Datums:', error);
      }
    };

    loadStoredDate();
  }, []);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const saveDate = async () => {
    try {
      await AsyncStorage.setItem('ziviStart', date.toISOString());
      navigation.navigate("Countdown");
    } catch (error) {
      console.error('Fehler beim Speichern des Datums:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Startdatum Zivildienst</ThemedText>
      <ThemedText style={styles.date}>{date.toLocaleDateString()}</ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <Button title="Datum auswählen" onPress={() => setShowPicker(true)} color={DefaultTheme.colors.primary} />

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calendar"            
            onChange={onChange}
          />
        )}

        <Button title="Speichern" onPress={saveDate} color={DefaultTheme.colors.primary} />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {        
    gap: 10
  }
});

export default SettingsScreen;
