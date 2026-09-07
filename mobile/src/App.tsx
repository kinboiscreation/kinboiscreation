import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './screens/Dashboard';
import ActivitiesScreen from './screens/Activities';
import AnnouncementsScreen from './screens/Announcements';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e1b4b',
              borderBottomColor: '#475569',
              borderBottomWidth: 1,
            },
            headerTintColor: '#f59e0b',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#ffffff',
            },
            tabBarStyle: {
              backgroundColor: '#1e1b4b',
              borderTopColor: '#475569',
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: '#f59e0b',
            tabBarInactiveTintColor: '#94a3b8',
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: 'Tableau de Bord',
              tabBarLabel: 'Accueil',
            }}
          />
          <Tab.Screen
            name="Activities"
            component={ActivitiesScreen}
            options={{
              title: 'Activités',
              tabBarLabel: 'Activités',
            }}
          />
          <Tab.Screen
            name="Announcements"
            component={AnnouncementsScreen}
            options={{
              title: 'Annonces',
              tabBarLabel: 'Annonces',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
    </>
  );
}
