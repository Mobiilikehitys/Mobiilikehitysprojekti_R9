import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Button, StatusBar, KeyboardAvoidingView} from 'react-native';
import Canvas from 'react-native-canvas';
import timeToMinutes from './timeToMinutes';
import ResourcePicker from './ResourcePicker';
import TimeLabels from './TimeLabels';
import CalendarModal from './CalenderModal';
import {thisDay, thisDayByMinutes} from './thisDay';
import AppBar from "../Navigation/Appbar"




export default function Calendar (){
    
    const canvasHeight = 400
    const canvasWidth = 90
    const testResources = [
        "Pyykkikone 1", "Pyykkikone 2"
    ]
    const [resource, setResource] = useState("Resurssi")
    const [loadingState, setLoadingState] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const testReservations = [
        {
            "Day":"26.3.2025",
            "Resources": [
                {   "Resource": "Pyykkikone 1",
                    "Reservations":[
                        {   
                            "Person":"AP",
                            "Starting time": "12.00",
                            "Ending time": "22.00"
                            
                        }
                    ]
                    

                }
            ]
        },
        {
            "Day":"28.3.2025",
            "Resources": [
                {   "Resource": "Pyykkikone 2",
                    "Reservations":[
                        {   
                            "Person":"AP",
                            "Starting time": "11.00",
                            "Ending time": "14.00"
                            
                        }
                    ]
                    

                }
            ]
        },
        
    ]
    
    const getNextDays = () => {
        const dayList = []
        const today= new Date()
        for(let i = 0; i < 30; i++){
            const day = new Date(today)
            day.setDate(today.getDate() + i)
            let weekDay
            switch (day.getDay()){
                case 0:
                    weekDay = "Su"
                    break
                case 1:
                    weekDay = "Ma"
                    break
                case 2:
                    weekDay = "Ti"
                    break
                case 3:
                    weekDay = "Ke"
                    break
                case 4:
                    weekDay = "To"
                    break
                case 5:
                    weekDay = "Pe"
                    break
                case 6:
                    weekDay = "La"
            }
            const dayString = weekDay + " " + day.getDate().toString()+"."+(day.getMonth() +1).toString()+"."
            const reservationDay = day.getDate().toString()+"."+(day.getMonth() +1).toString()+"."+day.getFullYear()
            dayList.push(
                {"dayHeader":dayString, "dayReservation":reservationDay})
        }
        return dayList
    }

    const daysToShow = getNextDays()

    

    const drawReservations = (canvas, day) => {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        canvas.width=canvasWidth
        canvas.height=canvasHeight
        
        
        const reservationData = testReservations.find(reservation => reservation.Day === day)

        ctx.strokeStyle = "gray";
        for(let i = 0; i < 24; i+=2){
            ctx.beginPath()
            ctx.moveTo(0,i*canvasHeight/24)
            ctx.lineTo(canvasWidth,i*canvasHeight/24)
            ctx.lineWidth = 1;
            ctx.stroke()
        }

        if(reservationData){
        const resources = reservationData['Resources']
        const reservations = resources.find(reservation => reservation.Resource == resource)
        if(reservations){
            console.log(reservations)
            console.log(reservations.Reservations)
        
        for(let a of reservations.Reservations){
            
            let person = a['Person']
            let startTime = a['Starting time']
            let endTime = a['Ending time']
            let startMinutes = timeToMinutes(startTime)
            let endMinutes = timeToMinutes(endTime)
            console.log("StartMinutes:",startMinutes)
            console.log("EndMinutes:", endMinutes)
            let startHeight = canvasHeight*startMinutes/(24*60)
            let sizeHeight = canvasHeight*(endMinutes - startMinutes)/(24*60)

            console.log("start:",startHeight)
            console.log("end:",sizeHeight)

            ctx.fillStyle = "green"
            ctx.fillRect(0,startHeight, canvas.width, sizeHeight)
            ctx.fillStyle = "black"
            ctx.fillText(person, 10, startHeight+10)
            ctx.fillText(startTime+"-"+endTime,10,startHeight+20)

        }
    }}
        setLoadingState(false)
        if (day == thisDay()){
            ctx.strokeStyle = "red";
            const timeMinutes = thisDayByMinutes()
            console.log(timeMinutes)
            ctx.beginPath()
            ctx.moveTo(0,canvasHeight*timeMinutes/(24*60))
            ctx.lineTo(canvasWidth, canvasHeight*timeMinutes/(24*60))
            ctx.lineWidth = 1;
            ctx.stroke()

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
            ctx.fillRect(0,0,canvasWidth, canvasHeight*timeMinutes/(24*60))

        }
        
    }

    const Canvases = () => {
        return(
            <ScrollView style={styles.canvases}
             horizontal={true}>
                {daysToShow.map((data, index) =>(
                    <View key={index} style={styles.column}>
                    <View style={styles.day}>
                    <Text>{data.dayHeader}</Text>
                    </View>
                    <Canvas style={styles.canvas}
                    ref={(canvas) => {
                        if(canvas){
                            drawReservations(canvas, data.dayReservation)
                        }
                        
                    }}/>
                    
                    </View>
                ))}
                <View style={styles.canvasesEnd}/>
            </ScrollView>
        )
    }
    


    return(
                
                <KeyboardAvoidingView
                behavior={'height'}
                style={styles.mainColumn}>
                <StatusBar style="auto"/>
                <View style={styles.resourcePicker}>
            <ResourcePicker resources={testResources} resource= {resource} setResource={setResource}/>
            </View>
        <View style={styles.container}>   
            <TimeLabels/>
            <Canvases/>
            </View>
            <View style={styles.buttonView}>
            <Button style={styles.button} title="Varaa aika"
            color= "green"
            onPress={() => setModalVisible(true)
            }/>
            {loadingState && <Text>Loading...</Text>}
            </View>
            <CalendarModal resources={testResources} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    canvasesEnd: {
        width: 20,

    },
    resourcePicker: {
    },
    day: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    mainColumn: {
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    container: {
        flex: 1,
        flexDirection: "row",
        width: 300,
        
    },
    column: {
        flex:1,
        flexDirection: "column",
        marginLeft: 10,
    },
    canvases: {
      flex: 1,
      flexDirection: "row",
      marginTop: 60,
      backgroundColor: "grey",
      height: 450,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20
        

    },
    canvas: {
        width: 90,
        height: 400,
        backgroundColor: "white",
    },
    buttonView: {
        position: "absolute",
        bottom: 100,


    },
   
    
  });