import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  percentage: number;
}

const calculateTimeLeft = (ziviStart: string): TimeLeft => {
  const now = new Date();

  const targetDate = new Date(ziviStart);
  targetDate.setMonth(targetDate.getMonth() + 9);  
    
  const millisLeft = targetDate.getTime() - now.getTime() - 24 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60_000;
  const workMillis = targetDate.getTime() - new Date(ziviStart).getTime() - 24 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60_000;

  const daysLeft = Math.floor(millisLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((millisLeft / (1000 * 60 * 60)) % 24);
  const minutesLeft = Math.floor((millisLeft / (1000 * 60)) % 60);
  const secondsLeft = Math.floor((millisLeft / 1000) % 60);
  const workDays = Math.floor(workMillis / (1000 * 60 * 60 * 24));

  let timeLeft: TimeLeft = {
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
    percentage: 100 / workDays * (workDays - daysLeft)
  };
  
  return timeLeft;
};

const CountdownPage = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percentage: 0
  });
  const [ziviStart, setZiviStart] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const loadEndDate = async () => {
        try {
          const storedZiviStart = await AsyncStorage.getItem("ziviStart");
          if (storedZiviStart) {
            setZiviStart(storedZiviStart);
          }
        } catch (error) {
          console.error("Fehler beim Laden des Datums:", error);
        }
      };

      loadEndDate();
    }, [])
  );

  useEffect(() => {
    if (ziviStart) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(ziviStart));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [ziviStart]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.days}>
        <ThemedText style={styles.daysText}>{timeLeft.days}</ThemedText>
        <ThemedText style={styles.daysSubTitle}>Tage verbleibend</ThemedText>
        <ThemedText>{timeLeft.hours} Stunden {timeLeft.minutes} Minuten {timeLeft.seconds} Sekunden</ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedText style={styles.countdown}>
          Du hast bereits {timeLeft.percentage.toFixed(0)}% geschafft!
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  days: {
    marginBottom: 15,
  },
  daysText: {
    fontSize: 50,
    lineHeight: 50,
    textAlign: "center",
  },
  daysSubTitle: {
    fontSize: 21,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 10
  },
  countdown: {
    marginBottom: 10,
  },
  percentage: {
    alignSelf: "center",
    marginTop: 100     
  },
});

export default CountdownPage;
