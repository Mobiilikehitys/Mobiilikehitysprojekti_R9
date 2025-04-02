import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { canvasHeight, canvasWidth, headerFont, startMargin, topMargin } from './CanvasSizes';

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
        marginTop: topMargin,
        width: 50,
        height: canvasHeight+50,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,

    },
    timeLabels: {
        flexDirection: "column",
        paddingLeft: 10,
        marginTop: startMargin-10,
        backgroundColor: "grey",
        borderTopLeftRadius: 20,
    },
    text: {
        marginBottom: canvasHeight/21
    }
})