import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import { useAuth } from '../context/AuthContext.js';

export default function Aloitus() {

    const { user } = useAuth();
    //esimerkki miten näitä käytetään
    console.log("user uid: ",user?.uid);
    console.log("user accounttype: ",user?.accountType);
    return (
<View style={styles.container}>
<Text style={styles.title}>Tervetuloa</Text>
</View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
