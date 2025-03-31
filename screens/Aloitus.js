import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

export default function Aloitus() {
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
