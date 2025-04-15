import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import ResourcesManagement from '../resourcesManagement/resourcesManagement.js';
import {auth, onAuthStateChanged} from '../firebase/Config'

export default function ResurssienHallinta() {

    const user = auth.currentUser;

    return (
        <View>
        {user ? <ResourcesManagement user={user.email}/> : <Text>Sign in to see the board</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
