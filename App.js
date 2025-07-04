import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Calendar from './calendar/Calendar';
import Ilmoitustaulu from './screens/Ilmoitustaulu';
import Kirpputori from './screens/Kirpputori';
import Tiedotteet from './screens/Tiedotteet';
import Tiedot from './screens/Tiedot';
import Talotiedot from './screens/Talotiedot';
import Varauskalenteri from './screens/Varauskalenteri';
import Login from './login/Login.js';
import Register from './register/Register.js';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';
import Aloitus from './screens/Aloitus.js';
import AppBar from './Navigation/Appbar.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Board from './Bulletin board/board.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import KirjauduUlos from './screens/Kirjaudu ulos.js';
import { AuthProvider } from './context/AuthContext.js';
import ResurssienHallinta from './screens/ResurssienHallinta.js';
import FirebaseNotificationListener from './notifications/FirebaseNotificationListener.js';

export default function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const route = navigationRef.getCurrentRoute();
      setCurrentRoute(route?.name);
    });

    return () => unsubscribe();
  }, [navigationRef]);

  return (
    <AuthProvider>

      <SafeAreaProvider>
        <PaperProvider>
          <FirebaseNotificationListener />
          <NavigationContainer ref={navigationRef}>
            {currentRoute !== 'Login' && <AppBar />}
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Aloitus" component={Aloitus} />
              <Stack.Screen name="Varauskalenteri" component={Varauskalenteri} />
              <Stack.Screen name="Ilmoitustaulu" component={Ilmoitustaulu} />
              <Stack.Screen name="Tiedotteet" component={Tiedotteet} />
              <Stack.Screen name="Talotiedot" component={Talotiedot} />
              <Stack.Screen name="Kirpputori" component={Kirpputori} />
              <Stack.Screen name="Tiedot" component={Tiedot} />
              <Stack.Screen name="Kirjaudu ulos" component={KirjauduUlos} />
              <Stack.Screen name="Resurssien hallinta" component={ResurssienHallinta} />

            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
