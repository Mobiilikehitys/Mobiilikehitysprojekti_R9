import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

export default function Tiedot() {
    return (
<View style={styles.container}>
<Text style={styles.title}>Omat tiedot</Text>
</View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
