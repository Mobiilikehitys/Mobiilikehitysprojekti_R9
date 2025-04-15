import { View, StyleSheet, Text, FlatList, Pressable, ScrollView,  } from "react-native";
import { canvasHeight, canvasWidth } from "./CanvasSizes";
import timeToMinutes from "./timeToMinutes";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function WithOutCanvases ({resource, dataJSON, daysToShow}){
    const gesturePan = Gesture.Pan();
        const OneDay = ({item}) => {
            console.log("OneDay:",item)
            const reservationData = dataJSON.find(reservation => reservation.Day == item.dayReservation)
            let reservations = []
            let reservationArray = []
            if(reservationData){
                console.log("ReservationData-OneDay:",reservationData)
                const resources = reservationData['Resources']
                reservations = resources.find(reservation => reservation.Resource == resource)
                console.log("ReservationData-reservations:",reservations)
                reservationArray = reservations['Reservations']
            }
            return(
                <View>
                <View style={styles.dayHeader}>
                    <Text>{item.dayHeader}</Text>
                </View>
                <View style={styles.dayCanvas}>
                    {Array.isArray(reservationArray) && reservationArray.map((data, index) => (
                        <Reservation key={index} start={data['Starting time']} end={data['Ending time']} person={data['Person']}/>
                    ))}
                </View>
                </View>

            )
        }

        const Reservation = ({start, end, person}) => {
            console.log("Reservation starts")
            const startMinutes = timeToMinutes(start)
            const endMinutes = timeToMinutes(end)
            const startHeight = canvasHeight*startMinutes/(24*60)
            const sizeHeight = canvasHeight*(endMinutes - startMinutes)/(24*60)
            
            return(
            <Pressable>
            <View style={{position: "absolute",top: startHeight, left: 0, height: sizeHeight, width: canvasWidth, backgroundColor: "blue" }}>
                <Text style={styles.reserText}>{start + "-" + end}</Text>
            </View></Pressable>)
        
        }

        const Separator = () => {
            return(
            <View style={styles.Separator}/>)
        }


        const TimeLabels = () => {
            const list = []
            for(let i = 0; i < 24; i+=2){
            const time = i.toString()+":00"
            list.push(time)
            }
            return(
                <View style={styles.timeLabels}>
                {list.map((time, index) => (
                <Text key={index} style={styles.text}>{time}</Text>
                 ))}
                </View>
            )
        }

        {/*return(
        <GestureDetector gesture={gesturePan}>
            
        </GestureDetector>
        <ScrollView style={styles.ScrollView1}
        overScrollMode="always"
        nestedScrollEnabled={true}>
        
        <View style={styles.flatlistView}>
        <FlatList
            data={daysToShow}
            renderItem={({ item }) => <OneDay item={item} />}
            horizontal={true}
            nestedScrollEnabled={true}
            ItemSeparatorComponent={() => <Separator/>}
            />
            </View>
        <ScrollView horizontal={true}
        style={styles.ScrollView2}
        nestedScrollEnabled={true}>
        {daysToShow.map((data,index) => (
            <View style={styles.mapView} key={index}>
            <OneDay item={data}/>
            </View>
        ))}
        </ScrollView>
        </ScrollView>*)*/}

}

const styles = StyleSheet.create({
    flatlistView: {
        height: 100
    },
    reserText: {
        fontSize: 9
    },
    Separator: {
        height: canvasHeight,
        width: 10,
        backgroundColor: "grey"

    },
    dayHeader:{
        flexDirection:"row",
        justifyContent: 'center'
    },
    mapView: {
        position: 'relative',
        top: 0,
        left: 0,
        width: canvasWidth+20,
        height: canvasHeight+400,
        backgroundColor: "grey"
    },
    main: {
        flexDirection: "row",
        width: 700,
        height: 1000,
    },
    timeLabels:{
        width: 100,
        height: 1000
    },
    spacer: {
        backgroundColor: "blue",
        height: canvasHeight,
        width: 10
    },
    dayCanvas: {
        left: 0,
        backgroundColor: "white",
        height: canvasHeight+200,
        width: 90
    },
    ScrollView1:{
        flexDirection : "row",
        height: 250,
    },
    ScrollView2:{
        flex: 1,
        flexDirection: "row",
        height: canvasHeight,
    },
})