import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
// TODO: Import other screens when created
// import { HomeScreen } from '../screens/HomeScreen';
// import { MoodEntryScreen } from '../screens/MoodEntryScreen';
// import { JournalScreen } from '../screens/JournalScreen';
// import { SettingsScreen } from '../screens/SettingsScreen';

// Types
import { AuthStackParamList, MainStackParamList } from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

// Auth Stack Navigator (Login, Signup)
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Main Stack Navigator (Protected routes)
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      {/* TODO: Add screens when created */}
      {/* <MainStack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'בית' }}
      />
      <MainStack.Screen 
        name="MoodEntry" 
        component={MoodEntryScreen}
        options={{ title: 'הוסף מצב רוח' }}
      />
      <MainStack.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{ title: 'יומן' }}
      />
      <MainStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'הגדרות' }}
      />
      <MainStack.Screen 
        name="EmergencyContacts" 
        component={EmergencyContactsScreen}
        options={{ title: 'אנשי קשר לשעת חירום' }}
      />
      <MainStack.Screen 
        name="TherapistInfo" 
        component={TherapistInfoScreen}
        options={{ title: 'מידע מטפל' }}
      />
      <MainStack.Screen 
        name="TherapistTasks" 
        component={TherapistTasksScreen}
        options={{ title: 'משימות מטפל' }}
      />
      <MainStack.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{ title: 'פגישות' }}
      /> */}
      
      {/* Temporary placeholder screen */}
      <MainStack.Screen 
        name="Home" 
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        )}
        options={{ title: 'בית' }}
      />
    </MainStack.Navigator>
  );
};

// Root Navigator - decides between Auth and Main based on auth state
export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});



