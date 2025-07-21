import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigation/TabNavigator';
import Cifra from './src/screens/Cifra'; // ajuste o caminho se necessário

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Abas principais */}
        <Stack.Screen
          name="HomeTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* Tela de cifra acessada a partir da lista */}
        <Stack.Screen
          name="Cifra"
          component={Cifra}
          options={{ title: 'Cifra' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
