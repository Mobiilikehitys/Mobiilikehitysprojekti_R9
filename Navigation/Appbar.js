import { useNavigation } from '@react-navigation/native';
import { Appbar, Menu } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext.js';
export default function AppBar() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header style={styles.appBar}>
      <Appbar.Content title="Taloyhtiö App" titleStyle={styles.title} />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="white" onPress={openMenu} />}
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Aloitus');
          }}
          title="Aloitus"
          leadingIcon="home"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Varauskalenteri');
          }}
          title="Varauskalenteri"
          leadingIcon="calendar"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Ilmoitustaulu');
          }}
          title="Ilmoitustaulu"
          leadingIcon="clipboard-text"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Tiedotteet');
          }}
          title="Tiedotteet"
          leadingIcon="bell"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Talotiedot');
          }}
          title="Tietoa taloyhtiöstä"
          leadingIcon="office-building"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Kirpputori');
          }}
          title="Kirpputori"
          leadingIcon="shopping"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Tiedot');
          }}
          title={user?.accountType === 'company' ? 'Asukkaiden tiedot' : 'Omat tiedot'}
          leadingIcon="account"
        />
      </Menu>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#ff6b6b', 
    elevation: 4, 
  },
  title: {
    color: 'white', 
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContent: {
    backgroundColor: '#ffffff', 
  },
});
