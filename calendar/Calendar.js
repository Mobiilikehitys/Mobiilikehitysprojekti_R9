import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Button, StatusBar, KeyboardAvoidingView} from 'react-native';
import Canvas, {Path2D} from 'react-native-canvas';
import timeToMinutes from './timeToMinutes';
import ResourcePicker from './ResourcePicker';
import TimeLabels from './TimeLabels';
import CalendarModal from './CalenderModal';
import {thisDay, thisDayByMinutes} from './thisDay';
import useData from './useData';
import dataToJSON from './dataToJSON';
import { FlatList } from 'react-native';
import DeleteModal from './DeleteModal';








export default function Calendar ({user}){

    const canvasHeight = 400
    const canvasWidth = 90
    const testResources = [
        "Pyykkikone 1", "Pyykkikone 2"
    ]
    const [resource, setResource] = useState(testResources[0])
    const [loadingState, setLoadingState] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [delModalVisible, setDelModalVisible] = useState(false)
    
    

    const data = useData()
    console.log("data",data)
    let dataJSON
    if(data){
        dataJSON = dataToJSON({data})
        console.log("dataJSON: ", dataJSON)
        
    }
    
    
    const testReservations = [
        {
            "Day":"29.3.2025",
            "Resources": [
                {   "Resource": "Pyykkikone 1",
                    "Reservations":[
                        {   
                            "Person":"AP",
                            "Starting time": "12:00",
                            "Ending time": "22:00"
                            
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
    console.log("TestReservations:", testReservations)
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

    

    const drawReservations = async (canvas, day) => {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        canvas.width=canvasWidth
        canvas.height=canvasHeight
        
        
        
        const reservationData = dataJSON.find(reservation => reservation.Day === day)
        
        
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        for(let i = 0; i < 24; i+=2){
            let p = new Path2D(canvas);
            p.moveTo(0,i*canvasHeight/24)
            p.lineTo(canvasWidth,i*canvasHeight/24)
            ctx.stroke(p)
        }

        if(reservationData){
        const resources = reservationData['Resources']
        console.log("Main resources: ", reservationData)
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

            if(person == user){
                ctx.fillStyle = "blue"
            }else{
                ctx.fillStyle = "yellow"
            }
            
            let p = new Path2D(canvas)
            p.rect(0, startHeight, canvasWidth, sizeHeight)
            ctx.fill(p)
            ctx.fillStyle = "black"
            if(person == user){
            ctx.fillText(person, 10, startHeight+10)
            if(endTime == "24:00"){
                endTime= "23:59"
            }
            ctx.fillText(startTime+"-"+endTime,10,startHeight+20)
        }else{
            ctx.fillText(startTime+"-"+endTime,10,startHeight+10)
        }

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

    const CanvasItem = ({ day }) => {
        const handleCanvas = (canvas) => {
          drawReservations(canvas, day.dayReservation)
        }
      
        return (
          <View style={styles.canvasItem}>
            <View style={styles.spacer1}>
            <View style={styles.dayHeaderView}>
            <Text style={styles.dayHeaderText}>{day.dayHeader}</Text>
            </View></View>
            <Canvas ref={handleCanvas} />
            <View style={styles.spacer2}/>
          </View>
        );
      };

    const RenderItem = (item) => {

        return(
        <View style={styles.RenderItem}>
        <CanvasItem day={item}/>
        </View>
        )
    }

    const CanvasesFlatList = () => {
        return(
            <View style={styles.CanvasesFlatList}>
            <FlatList
            horizontal={true}
            data={daysToShow}
            renderItem={({item, index}) => RenderItem(item) }
            keyExtractor={(item) => item.dayHeader}
            contentContainerStyle={styles.flatlistContainer}
            /></View>
        )
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
                    ref={async (canvas) => {
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
                <Text>{"Käyttäjä: "}{user}</Text>
                <View style={styles.resourcePicker}>
            <ResourcePicker resources={testResources} resource= {resource} setResource={setResource}/>
            </View>
        <View style={styles.container}>   
            <TimeLabels/>
            <Canvases/>
            </View>
            <View style={styles.buttonRow}>
            <View style={styles.buttonView}>
            <Button style={styles.button} title="Varaa aika"
            color= "green"
            onPress={() => setModalVisible(true)
            }/>
            
            </View>
            <View style={styles.buttonView}>
            <Button style={styles.button} title="Poista aika" color="green" onPress={() => setDelModalVisible(true)}/></View></View>
            <View style={styles.modals}>
            <CalendarModal person={user} resources={testResources} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
            <DeleteModal person={user} resources={testResources} delModalVisible={delModalVisible} setDelModalVisible={setDelModalVisible}/>
            </View>
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    modals :{
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 570
    },
    flatlistContainer: {

    },
    dayHeaderView: {
        
    },
    dayHeaderText: {
        fontSize: 15,
        marginLeft: 15
    },
    spacer4: {
        width:110,
        backgroundColor: "grey"

    },
    spacer3: {
        width:110,
        backgroundColor: "grey"
    },
    spacer2: {
        height: 10,
        backgroundColor: "grey"
    },
    spacer1: {
        marginTop: 60,
        height: 40,
        backgroundColor: "grey",
        justifyContent: 'center'
    },
    CanvasesFlatList: {
    },
    renderItem: {
        transform: [{ rotate: '90deg' }],
        backgroundColor: "grey"
        
    },

    canvasItem: {
    },
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
        width: 140


    },
    
   button: {
        width: 70,
        height: 100
   }
    
  });