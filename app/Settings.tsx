import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Colors from "./constants/Colors";

const SettingsScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Lade das gespeicherte Datum, wenn die Seite geladen wird
    const loadStoredDate = async () => {
      try {
        const storedStartDate = await AsyncStorage.getItem("lageStart");
        const storedEndDate = await AsyncStorage.getItem("lageEnd");
        if (storedStartDate && storedEndDate) {
          setStartDate(new Date(storedStartDate));
          setEndDate(new Date(storedEndDate));
        }
      } catch (error) {
        console.error("Fehler beim Laden des Datums:", error);
      }
    };

    loadStoredDate();
  }, []);

  const onStartChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onEndChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowStartPicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const saveDate = async () => {
    try {
      await AsyncStorage.setItem("lageStart", startDate.toDateString());
      await AsyncStorage.setItem("lageEnd", endDate.toDateString());
      navigation.navigate("Countdown");
    } catch (error) {
      console.error("Fehler beim Speichern des Datums:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>      
      <ThemedText style={styles.date}>Start: {startDate.toLocaleDateString()}</ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <Button title="Start auswählen" onPress={() => setShowStartPicker(true)} color={Colors.colors.primary} />
        {showStartPicker && <DateTimePicker value={startDate} mode="date" display="calendar" onChange={onStartChange} />}
      </ThemedView>

      <ThemedText style={styles.date}>Ende: {endDate.toLocaleDateString()}</ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <Button title="Ende auswählen" onPress={() => setShowEndPicker(true)} color={Colors.colors.primary} />

        {showEndPicker && <DateTimePicker value={endDate} mode="date" display="calendar" onChange={onEndChange} />}
      </ThemedView>

      <Button title="Speichern" onPress={saveDate} color={Colors.colors.primary} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  date: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 25,
  },
});

export default SettingsScreen;
