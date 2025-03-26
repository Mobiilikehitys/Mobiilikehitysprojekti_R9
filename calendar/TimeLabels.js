import React from "react"
import { View, StyleSheet, Text } from "react-native"

const canvasHeight = 400
const canvasWidth = 90

export default function TimeLabels(){
    const list = []
    for(let i = 0; i < 24; i+=2){
        const time = i.toString()+":00"
        list.push(time)
    }

    return(
        <View style={styles.leftColumn}>
        <View style={styles.timeLabels}>
            {list.map((time, index) => (
                <Text key={index} style={styles.text}>{time}</Text>
            ))}
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    leftColumn: {
        backgroundColor: "gray",
        marginTop: 60,
        width: 50,
        height: 450,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,

    },
    timeLabels: {
        flexDirection: "column",
        paddingLeft: 10,
        paddingTop: 15,
        backgroundColor: "grey",
        justifyContent: "space-between",
        borderTopLeftRadius: 20,
    },
    text: {
        marginTop: 400/28

    }
})