import { View, StyleSheet, Text, FlatList, Pressable, ScrollView,  } from "react-native";
import { canvasHeight, canvasWidth, headerHeight, throttle, timeScreenSize } from "./CanvasSizes";
import timeToMinutes from "./timeToMinutes";
import React, {useEffect, useState} from "react";
import { weekDayNumber, getNextDays } from "./nextDays";
import Animated, {useSharedValue, useAnimatedScrollHandler} from "react-native-reanimated";
import ReservationModal from "./ReserModal";
import { resourceList, dayJSON, hourJSON } from "./handleResources";
import { BlockedTimesModal } from "./timeBlocks";






export default function WithOutCanvases ({resourceData, user, fullClock,yRef2, scrollHandler4, scrollHandlerX, xRef, resource, dataJSON, daysToShow}){
    
       
        const [reserModalVisible, setReserModalVisible] = useState(false)
        const [reservationData, setReservationData] = useState(null)
        const [blockedTimes, setBlockedTimes] = useState(false)

        const OneDay = ({item}) => {
            let dayNow
            if(fullClock){
                dayNow = fullClock.getDate().toString()+"."+ (fullClock.getMonth()+1).toString()+"."+fullClock.getFullYear().toString()
            }else{
                dayNow= "Loading..."
            }
            const reservationData = dataJSON.find(reservation => reservation.Day == item.dayReservation)
            let reservations = []
            let reservationArray = []
            if(reservationData){
                const resources = reservationData['Resources']
                reservations = resources.find(reservation => reservation.Resource == resource)
                if(reservations){
                    reservationArray = reservations['Reservations']
                }

                
            }


            return(
                
                <View style={styles.dayCanvas}>
                <HelpLines />
                <BlockedTimes item={item}/>
                {dayNow == item.dayReservation  && <RedLineAndShadow/>}
                    <View style={styles.reservations}>
                    {Array.isArray(reservationArray) && reservationArray.map((data, index) => (
                        <View style={styles.OneDay} key={index}>
                        {/*<Reservation start={data['Starting time']} end={data['Ending time']} person={data['Person']} id={data['id']}/>*/}
                        <Reservation data={data}/>
                        
                        </View>
                    ))}
                    </View>
                    
                    </View>
                    

            )
        }

        const BlockedTimes = ({item}) => {
            const allowedDays = dayJSON(resourceData)[resource]
            const allowedClocktimes = hourJSON(resourceData)[resource]
            const itemDate = item["dayHeader"]
            const weekday = itemDate.substring(0,2)
            const dayNumber = weekDayNumber(weekday)
            let blockDay = false
            let timeBool
            if(allowedDays[dayNumber.toString()] == false){
                blockDay = true
                return(<Pressable onPress={() => {setBlockedTimes(true)}} style={{position: "absolute", top: 0, left:0, height: canvasHeight, width: canvasWidth, backgroundColor: "grey", zIndex:10, elevation: 10}}></Pressable>)
            }else{
                const alku = allowedClocktimes['Alku']
                const loppu = allowedClocktimes['Loppu']
                const alkuMinuutteina = timeToMinutes(alku)
                const loppuMinuutteina = timeToMinutes(loppu)
                if(alkuMinuutteina < loppuMinuutteina){
                    timeBool = false
                }else{
                    timeBool = true
                }
            

                if(timeBool == true){
                    const startHeight = alkuMinuutteina*canvasHeight/(24*60)
                    const sizeHeight = (loppuMinuutteina-alkuMinuutteina)*canvasHeight/(24*60)
                    return(<Pressable onPress={() => {setBlockedTimes(true)}} style={{position: "absolute", top: startHeight, left:0, height: sizeHeight, width:canvasWidth, backgroundColor: "grey", zIndex:10, elevation: 10}}/>)
                }else{
                    const startHeight1 = 0
                    const sizeHeight1 = alkuMinuutteina*canvasHeight/(24*60)
                    const startHeight2 = loppuMinuutteina*canvasHeight/(24*60)
                    const sizeHeight2 = (1-loppuMinuutteina/(24*60))*canvasHeight
                    return(<><Pressable onPress={() => {setBlockedTimes(true)}} style={{position: "absolute", top: startHeight1, left:0, height: sizeHeight1, width:canvasWidth, backgroundColor:"grey", zIndex:10, elevation: 10}}/>
                        <Pressable onPress={() => {setBlockedTimes(true)}} style={{position: "absolute", top: startHeight2, left:0, height: sizeHeight2, width:canvasWidth, backgroundColor:"grey", zIndex:10, elevation: 10}}/></>
                    )
                }}




        }

        

        const Reservation = ({data}) => {
            const startMinutes = timeToMinutes(data['Starting time'])
            const endMinutes = timeToMinutes(data['Ending time'])
            const startHeight = (canvasHeight)*startMinutes/(24*60)
            const sizeHeight = (canvasHeight)*(endMinutes - startMinutes)/(24*60)

            
            return(<View>
            {data &&
            user != data['Person'] ?
            <Pressable onPress={() =>  {
                setReservationData(data)
                 setReserModalVisible(true)}}
                 style={{position: "absolute",top: startHeight, left: 0, height: sizeHeight, width: canvasWidth, backgroundColor: "yellow", zIndex:1000, elevation:1000}}>
                <View><Text style={styles.reserText}>{data['Starting time'] + "-" + data['Ending time']}</Text></View>
            </Pressable>:
            <Pressable onPress={() =>  {
                setReservationData(data)
                 setReserModalVisible(true)}}
                 style={{position: "absolute",top: startHeight, left: 0, height: sizeHeight, width: canvasWidth, backgroundColor: "blue", zIndex:1000, elevation:1000}}>
                <View>
                    <Text style={styles.reserText}>Oma varaus</Text>
                    <Text style={styles.reserText}>{data['Starting time'] + "-" + data['Ending time']}</Text></View>
            </Pressable>
            }</View>)
        
        }

        const HelpLines = () => {
            const heights = []
            for(let i= 1; i <= 24; i++){
                heights.push(i*canvasHeight/24)
            }
            return(<View style={styles.HelpLines}>
            {heights.map((data, index) => (
                <View key={index} style={{position: 'absolute',top:data-1, left: 0, height:1, width:canvasWidth, backgroundColor: "black"}}/>
            ))
            }</View>)
        }

        const Separator = () => {
            return(
            <View style={styles.Separator}/>)
        }

        const RedLineAndShadow = () => {
            const currentMinutes = fullClock.getHours()*60+fullClock.getMinutes()
            const height1 = currentMinutes*canvasHeight/(24*60)
            return(<View style={styles.RedLineAndShadow}>
                <View style={{position: "absolute", height:1, width: canvasWidth, left: 0, top:height1, backgroundColor:"red"}}/>
                <View style={{position: "absolute", height:height1, width: canvasWidth, left: 0, top:0, backgroundColor:"rgba(90,90,90, 0.5)"}}/>
            </View>)

        }


        

        return(
            <View style={styles.mainColumn}>

            {/*<FlatList
            data={daysToShow}
            renderItem={({ item }) => <OneDay item={item} />}
            horizontal={true}
            nestedScrollEnabled={true}
            ItemSeparatorComponent={() => <Separator/>}
            contentContainerStyle={styles.flatlistCCS}
            style={styles.flatlistStyle}
            ListHeaderComponent={<TimeLabels/>}
            />*/}
            <Animated.ScrollView style={styles.ScrollView1}
            scrollEventThrottle={throttle}
            nestedScrollEnabled
            ref={yRef2}
            onScroll={scrollHandler4}
            decelerationRate={"fast"}>
            <Animated.ScrollView 
            horizontal
            nestedScrollEnabled
            ref={xRef}
            onScroll={scrollHandlerX}
            scrollEventThrottle={throttle}
            decelerationRate={'fast'}
            >
            {daysToShow.map((data,index) => (
            <View style={styles.mapView} key={index}>
            <OneDay item={data}/>
            </View>
        ))}</Animated.ScrollView></Animated.ScrollView>
        <ReservationModal user={user} setReserModalVisible={setReserModalVisible} reserModalVisible={reserModalVisible} reservationData={reservationData}/>
        <BlockedTimesModal resource={resource} blockedTimes={blockedTimes} setBlockedTimes={setBlockedTimes}/>
        </View>)
        {/*return(
        
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
    OneDay: {
       
    },
    RedLineAndShadow: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0
    },
    mainColumn: {
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animated1: {
        height: 300
    },
    animated2: {
        height: 300
    },
    mainrow: {
        flexDirection: "row",

    },
    timeMain: {
        height: canvasHeight,
        backgroundColor: "grey"
    },
    OneDayEnd: {
        
    },
    reservations: {
        position: "absolute",
        top: 0
    },
    HelpLines: {
        flex: 1,
        width: canvasWidth,
    },
    text: {
        
    },
    
    flatlistStyle: {
        height: canvasHeight+200,
        width: 300

    },
    centerView: {
        flexDirection: "row",
        justifyContent: 'center',
    },
    flatlistCCS: {
        height: 1200

    },
    main: {
        flexDirection: "row",
        justifyContent: 'center',
        width: 100
    },
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
        justifyContent: 'center',
        backgroundColor: 'grey',
        
    },
    mapView: {
        flexDirection: "row",
        top: 0,
        left: 0,
        width: canvasWidth+30,
        height: canvasHeight+30,
        backgroundColor: "grey"
    },
    timeLabels:{
        backgroundColor: "grey",
        width: 50,
        paddingTop: 10,
        paddingLeft: 5,
        justifyContent: 'space-between',
        height: canvasHeight
    },
    
    dayCanvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: "white",
        height: canvasHeight,
        width: 90
    },
    ScrollView1:{
       width: 300,
       height: timeScreenSize
    },
    ScrollView2:{
       height: 400
    },
})