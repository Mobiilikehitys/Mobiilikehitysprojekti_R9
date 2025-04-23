import {View, Text, StyleSheet } from "react-native"
import {getNextDays} from "./nextDays"
import Animated, {useSharedValue,useAnimatedScrollHandler} from "react-native-reanimated"
import { canvasHeight, headerHeight, timeLabelHeight, canvasWidth, timeScreenSize, throttle } from "./CanvasSizes"

const TimeLabels = ({scrollHandler3, yRef1}) => {
    const list = []
    for(let i = 0; i < 24; i++){
    const time = i.toString()+":00"
    list.push(time)
    }

    return(
        <View style={styles.timeLabelsMain}>
        <Animated.ScrollView
        contentContainerStyle={styles.timeMain}
        scrollEventThrottle={throttle}
        onScroll={scrollHandler3}
        ref={yRef1}
        decelerationRate={'fast'}
        >
        <View style={styles.timeMap}>
        {list.map((time, index) => (
        <View key={index} style={styles.timeLabels}>
        <Text style={styles.text}>{time}</Text></View>
         ))}</View>
        </Animated.ScrollView></View>
    )
}

const DayHeaders = ({xRef, scrollHandler}) => {
    const days = getNextDays()
    return(
        <Animated.ScrollView 
        style={styles.dayHeaders} 
        horizontal
        ref={xRef}
        onScroll={scrollHandler}
        scrollEventThrottle={throttle}
        contentContainerStyle={styles.dayHeadersCCS}
        decelerationRate={'fast'}
        >
        {days.map((day,index) => (
            <View key={index} style={styles.daysMap}>
            <Text style={styles.dayText}>{day.dayHeader}</Text></View>
        
        ))}
        </Animated.ScrollView>
    )
}



const styles = StyleSheet.create({
    timeMap: {
        position: "absolute",
        top: headerHeight-10,
        height: canvasHeight*23/24+15,
        justifyContent: "space-between",
    },
    timeLabelsMain: {
        width: 40,
        height: timeScreenSize+headerHeight
    },
    timeMainCCS: {
        height: 100
    },
    dayText: {

    },
    dayHeadersCCS: {
        flexDirection: "row",
        justifyContent: "space-between",


    },
    daysMap: {
        flexDirection: "row",
        justifyContent: "center",
        marginRight: 30,
        width: canvasWidth,
    },
    timeMain: {
        backgroundColor:"grey",
        width: 40,
        height: canvasHeight+45
        
        

    },
    timeLabels: {

    },
    text:{

    },
    dayHeaders: {
        backgroundColor: "grey",
        height: headerHeight,
        width:  300,

    },


})

export {TimeLabels, DayHeaders}