import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

export default function Varauskalenteri() {
    return (
<View style={styles.container}>
<Text style={styles.title}>Varauskalenteri</Text>
</View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});
