import React, { useEffect, useState } from 'react';
import { Appbar, Menu, Badge } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '@react-navigation/native';
import { firestore, collection, query, onSnapshot } from '../firebase/Config.js';
import useAnnouncementTracker from '../Navigation/useAnnouncementTracker.js';
import { getDocs } from 'firebase/firestore';
export default function AppBar() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Aloitus');
  const [hasNewAnnouncement, clearHasNew] = useAnnouncementTracker(user);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

 const handleMenuPress = async (menu) => {
  setActiveMenu(menu);
  if (menu === 'Tiedotteet') {
    await clearHasNew(); 
  }
  closeMenu();
  navigation.navigate(menu);
};
  return (
    <Appbar.Header style={styles.appBar}>
      <Appbar.Content title="Taloyhtiö App" titleStyle={styles.title} />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <View style={styles.notificationContainer}>
            {hasNewAnnouncement && <Badge style={styles.badge} size={10} />}
            <Appbar.Action
              icon="menu"
              color="white"
              onPress={openMenu}
              style={styles.menuButton}
            />
          </View>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={() => handleMenuPress('Aloitus')}
          title="Aloitus"
          leadingIcon="home"
          style={activeMenu === 'Aloitus' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Varauskalenteri')}
          title="Varauskalenteri"
          leadingIcon="calendar"
          style={activeMenu === 'Varauskalenteri' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Ilmoitustaulu')}
          title="Ilmoitustaulu"
          leadingIcon="clipboard-text"
          style={activeMenu === 'Ilmoitustaulu' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Tiedotteet')}
          title="Tiedotteet"
          leadingIcon="bell"
          trailingIcon={hasNewAnnouncement ? () => <View style={styles.redDot} /> : null}
          style={activeMenu === 'Tiedotteet' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Talotiedot')}
          title="Tietoa taloyhtiöstä"
          leadingIcon="office-building"
          style={activeMenu === 'Talotiedot' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Kirpputori')}
          title="Kirpputori"
          leadingIcon="shopping"
          style={activeMenu === 'Kirpputori' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Tiedot')}
          title={user?.accountType === 'company' ? 'Asukkaiden tiedot' : 'Omat tiedot'}
          leadingIcon="account"
          style={activeMenu === 'Tiedot' ? styles.activeMenuItem : null}
        />
        <Menu.Item
          onPress={() => handleMenuPress('Kirjaudu ulos')}
          title="Kirjaudu ulos"
          leadingIcon="logout"
          style={activeMenu === 'Kirjaudu ulos' ? styles.activeMenuItem : null}
        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Resurssien hallinta')
                        }}
                        title="Resurssien hallinta"
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
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
  },
  menuButton: {
    marginRight: 10,
  },
  activeMenuItem: {
    backgroundColor: '#ffcccc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    marginVertical: 2,
  },
  redDot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginLeft: 10,
  },
});