import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

export default function Kirpputori() {
    return (
<View style={styles.container}>
<Text style={styles.title}>Kirpputori</Text>
</View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
