import {  useNavigation, useRoute } from '@react-navigation/native';
import { Appbar, Menu } from 'react-native-paper';
import React, { useState} from 'react';


export default function AppBar(){
    const navigation = useNavigation();
    
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    return(
        <Appbar.Header>
            <Appbar.Content title={"Taloyhtiö app"}/>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<Appbar.Action icon="menu" onPress={openMenu}/>}
                >
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Aloitus')
                        }}
                        title="Aloitus"
                        
                        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Varauskalenteri')
                        }}
                        title="Varauskalenteri"
                        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Ilmoitustaulu')
                        }}
                        title="Ilmoitustaulu"
                        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Tiedotteet')
                        }}
                        title="Tiedotteet"
                        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Talotiedot')
                        }}
                        title="Tietoa taloyhtiöstä"
                        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Kirpputori')
                        }}
                        title="Kirpputori"
                        />
                    <Menu.Item
                        onPress={() => {
                            closeMenu()
                            navigation.navigate('Tiedot')
                        }}
                        title="Omat tiedot"
                        />
                </Menu>
        </Appbar.Header>
    )
}