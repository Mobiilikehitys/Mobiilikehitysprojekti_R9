import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Canvas from 'react-native-canvas';
import timeToMinutes from './timeToMinutes';
import ResourcePicker from './ResourcePicker';


const canvasHeight = 400
const canvasWidth = 90
export default function Calendar (){
    const [resource, setResource] = useState(testResources[0])

    const testResources = [
        "Pyykkikone 1", "Pyykkikone 2"
    ]
    const testReservations = [
        {
            "Day":"26.3.2025",
            "Resources": [
                {   "Resource": "Pyykkikone 1",
                    "Reservations":[
                        {   
                            "Person":"AP",
                            "Starting time": "12.00",
                            "Ending time": "15.00"
                            
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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        ctx.strokeStyle = "black"
        const reservationData = testReservations.find(reservation => reservation.Day === day)
        if(reservationData){
        const resources = reservationData['Resources']
        for(b of resources){
            const b =
        }
        for(a of reservations){
            
            const person = a['Person']
            const startTime = a['Starting time']
            const endTime = a['Ending Time']
            const startMinutes = timeToMinutes(startTime)
            const endMinutes = timeToMinutes(endTime)
            const startHeight = canvasHeight*startMinutes/(24*60)
            const sizeHeight = canvasHeight*(endMinutes - startMinutes)/(24*60)
            ctx.fillStyle = "green"
            ctx.fillRect(0,startHeight, canvasWidth, sizeHeight)
            ctx.strokeRect(0,startHeight, canvasWidth, sizeHeight)
            ctx.fillStyle = "black"
            ctx.fillText(person, 10, startHeight+10)

        }
    }
        
    }

    const Canvases = () => {
        return(
            <ScrollView style={styles.canvases} horizontal={true}>
                {daysToShow.map((data, index) =>(
                    <View key={index} style={styles.column}>
                    <Text>{data.dayHeader}</Text>
                    <Canvas style={styles.canvas}
                    ref={(canvas) => {
                        if(canvas){
                            drawReservations(canvas, data.dayReservation)
                        }
                        
                    }}/>
                    </View>
                ))}
            </ScrollView>
        )
    }
    
    

    return(

        <SafeAreaView style={styles.container}>
            <ResourcePicker resources={testResources} setResource={setResource}/>
            <Canvases/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    column: {
        flexDirection: "column",
        marginLeft: 40
    },
    canvases: {
      flexDirection: "row",
      marginTop: 60,
      backgroundColor: "grey",
    },
    canvas: {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: "white",
    }
    
  });