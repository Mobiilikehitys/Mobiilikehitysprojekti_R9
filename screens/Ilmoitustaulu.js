import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

export default function Ilmoitustaulu() {
    return (
<View style={styles.container}>
<Text style={styles.title}>Ilmoitustaulu</Text>
</View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
