import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './screen/HomeScreen';
import ApartScreen from './screen/ApartScreen';
import HouseScreen from './screen/HouseScreen';
import DetailScreen from './screen/DetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'Home';
          } else if (route.name === 'Apart') {
            iconName = 'Apartment';
          } else if (route.name === 'House') {
            iconName = 'house';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'All Buildings' }} />
      <Tab.Screen name="Apart" component={ApartScreen} options={{ title: 'Apartments' }} />
      <Tab.Screen name="House" component={HouseScreen} options={{ title: 'Houses' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Building Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}