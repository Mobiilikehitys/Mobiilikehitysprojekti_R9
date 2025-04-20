import { View, StyleSheet, Text, FlatList, Pressable, ScrollView,  } from "react-native";
import { canvasHeight, canvasWidth, headerHeight, throttle, timeScreenSize } from "./CanvasSizes";
import timeToMinutes from "./timeToMinutes";
import React from "react";
import getNextDays from "./nextDays";
import Animated, {useSharedValue, useAnimatedScrollHandler} from "react-native-reanimated";






export default function WithOutCanvases ({fullClock,yRef2, scrollHandler4, scrollHandlerX, xRef, resource, dataJSON, daysToShow}){
    
        

    
         /*const native1 = Gesture.Native()
         const native2 = Gesture.Native()
         const scrollOffsetY = useSharedValue(0);
         const scrollOffsetX = useSharedValue(0)
         const handleContentScrollY = useAnimatedScrollHandler(({ contentOffset }) => {
            scrollOffsetY.value = contentOffset.y;
        }, []);  
        
        const handleContentScrollX = useAnimatedScrollHandler(({ contentOffset }) => {
            scrollOffsetX.value = contentOffset.x;
        }, []);*/


        const OneDay = ({item}) => {

            let dayNow
            if(fullClock.current){
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
                {dayNow == item.dayReservation  && <RedLineAndShadow/>}
                    <View style={styles.reservations}>
                    {Array.isArray(reservationArray) && reservationArray.map((data, index) => (
                        <View style={styles.OneDay} key={index}>
                        <Reservation start={data['Starting time']} end={data['Ending time']} person={data['Person']}/>
                        </View>
                    ))}
                    </View>
                    
                    </View>
                    

            )
        }

        

        const Reservation = ({start, end, person}) => {
            const startMinutes = timeToMinutes(start)
            const endMinutes = timeToMinutes(end)
            const startHeight = (canvasHeight)*startMinutes/(24*60)
            const sizeHeight = (canvasHeight)*(endMinutes - startMinutes)/(24*60)
            
            return(
            <Pressable>
            <View style={{position: "absolute",top: startHeight, left: 0, height: sizeHeight, width: canvasWidth, backgroundColor: "blue"}}>
                <Text style={styles.reserText}>{start + "-" + end}</Text>
            </View></Pressable>)
        
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
            const currentMinutes = fullClock.current.getHours()*60+fullClock.current.getMinutes()
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
            onScroll={scrollHandler4}>
            <Animated.ScrollView 
            horizontal
            nestedScrollEnabled
            ref={xRef}
            onScroll={scrollHandlerX}
            scrollEventThrottle={throttle}
            >
            {daysToShow.map((data,index) => (
            <View style={styles.mapView} key={index}>
            <OneDay item={data}/>
            </View>
        ))}</Animated.ScrollView></Animated.ScrollView>
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