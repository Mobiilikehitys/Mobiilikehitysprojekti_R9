import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Calendar from './calendar/Calendar';
import Login from './login/Login';

export default function App() {
  return (
    <View style={styles.container}>
      <Calendar/>      
    </View>
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
