import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Calendar from './calendar/Calendar';
import Ilmoitustaulu from './screens/Ilmoitustaulu';
import Kirpputori from './screens/Kirpputori';
import Tiedotteet from './screens/Tiedotteet';
import Tiedot from './screens/Tiedot';
import Talotiedot from './screens/Talotiedot';
import Varauskalenteri from './screens/Varauskalenteri';
import Login from './login/Login.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Aloitus from './screens/Aloitus.js';
import AppBar from './Navigation/Appbar.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
export default function App() {
const Stack = createNativeStackNavigator()

  return (
    
    <SafeAreaProvider>
      <PaperProvider>
    <NavigationContainer>
      
          <AppBar/>
          <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Aloitus' component={Aloitus} />
        <Stack.Screen name='Varauskalenteri' component={Varauskalenteri} />
        <Stack.Screen name='Ilmoitustaulu' component={Ilmoitustaulu} />
        <Stack.Screen name='Tiedotteet' component={Tiedotteet} />
        <Stack.Screen name='Talotiedot' component={Talotiedot} />
        <Stack.Screen name='Kirpputori' component={Kirpputori} />
        <Stack.Screen name='Tiedot' component={Tiedot} />
          </Stack.Navigator>
      
    </NavigationContainer>
    </PaperProvider>
    </SafeAreaProvider>
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
