import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import FleaMarket from '../flea market/Market';
import { auth } from '../firebase/Config';

export default function Kirpputori() {
    const user = auth.currentUser;
    console.log("useremail:", user.email)

    return (
        <View>
        {user ? <FleaMarket user={user.email}/> : <Text>Sign in to see the flea market</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
