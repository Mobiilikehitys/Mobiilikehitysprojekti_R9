import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

export default function Talotiedot() {
    return (
<View style={styles.container}>
<Text style={styles.title}>Talon tiedot</Text>
</View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
