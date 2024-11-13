import { createStackNavigator } from "@react-navigation/stack";
import CountdownScreen from "./Countdown";
import SettingsScreen from "./Settings";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "expo-router";

type RootStackParamList = {
  Countdown: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function RootLayout() {
  const navigation = useNavigation();

  const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
    {
      name: "Countdown",
      component: CountdownScreen,
      options: {
        title: "Neue Lage",
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate("Settings")} style={{marginRight: 15}}>
            <ThemedText>Settings</ThemedText>
          </Pressable>
        ),
      },
    },
    {
      name: "Settings",
      component: SettingsScreen,
    },
  ];

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#a03fac",
          },
        }}
      >
        {routes.map((routeConfig) => (
          <Stack.Screen key={routeConfig.name} {...routeConfig} />
        ))}
      </Stack.Navigator>
    </ThemeProvider>
  );
}
