import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Buscar from '../screens/Buscar';
import Harpa from '../screens/Harpa';
import Listas from '../screens/Listas';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Harpa Offline"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Outros Hinos') iconName = 'musical-notes';
          else if (route.name === 'Harpa Offline') iconName = 'book';
          else if (route.name === 'Minhas Listas') iconName = 'albums';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Outros Hinos" component={Buscar} />
      <Tab.Screen name="Harpa Offline" component={Harpa} />
      <Tab.Screen name="Minhas Listas" component={Listas} />
    </Tab.Navigator>
  );
}
