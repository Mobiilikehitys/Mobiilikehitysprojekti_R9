import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import Board from '../Bulletin board/board';
import {auth, onAuthStateChanged} from '../firebase/Config'

export default function Ilmoitustaulu() {

    const user = auth.currentUser;

    return (
        <View>
        {user ? <Board user={user.email}/> : <Text>Sign in to see the board</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
