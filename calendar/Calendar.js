import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Button, StatusBar, KeyboardAvoidingView, FlatList } from 'react-native';
import Canvas, {Path2D} from 'react-native-canvas';
import timeToMinutes from './timeToMinutes';
import ResourcePicker from './ResourcePicker';
import TimeLabels from './TimeLabels';
import CalendarModal from './CalenderModal';
import {thisDay, thisDayByMinutes} from './thisDay';
import useData from './useData';
import dataToJSON from './dataToJSON';
import DeleteModal from './DeleteModal';
import { RESERVATIONS } from '../firebase/Config';
import { canvasHeight, canvasWidth, startMargin, topMargin, header, headerFont } from './CanvasSizes';
import WithOutCanvases from './WithOutCanvases';






export default function Calendar ({user}){

    
    const testResources = [
        "Pyykkikone 1", "Pyykkikone 2"
    ]
    const [resource, setResource] = useState(testResources[0])
    const [loadingState, setLoadingState] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [delModalVisible, setDelModalVisible] = useState(false)
    
    

    const data = useData(RESERVATIONS)
    let dataJSON
    if(data){
        dataJSON = dataToJSON({data})
        
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
        const reservations = resources.find(reservation => reservation.Resource == resource)
        if(reservations){
            
        
        for(let a of reservations.Reservations){
            
            let person = a['Person']
            let startTime = a['Starting time']
            let endTime = a['Ending time']
            let startMinutes = timeToMinutes(startTime)
            let endMinutes = timeToMinutes(endTime)
            let startHeight = canvasHeight*startMinutes/(24*60)
            let sizeHeight = canvasHeight*(endMinutes - startMinutes)/(24*60)


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
          if(canvas){drawReservations(canvas, day.dayReservation)}
          }
      
        return (
          <View style={styles.canvasItem}>
            
            <Canvas ref={handleCanvas} />
          </View>
        );
      };

    const RenderItem = ({item}) => {
        return(
        <View style={styles.renderItem}>
        <View style={styles.spacer1}>
            <Text>{item.dayHeader}</Text>
        </View>
        <CanvasItem day={item}/>

        </View>
        )
    }
   
    const CanvasesFlatList = () => {
        return(
            <View style={styles.cfl}>
            <FlatList
            horizontal={true}
            data={daysToShow}
            renderItem={({ item }) => (
                <RenderItem item={item}/>
            )}
            keyExtractor={(item) => item.dayHeader}
            ItemSeparatorComponent={<View style={styles.separator}
            contentContainerStyle={styles.CanvasesFlatList}
            />}
            />
                    <View style={styles.renderItemBottom}/></View>
        )
    }

    const Canvases = () => {
        return(
            <ScrollView style={styles.canvases}
             horizontal={true}>
                {daysToShow.map((data, index) =>(
                    <View key={index} style={styles.column}>
                    <View style={styles.day}>
                    <View style={styles.columnCenterView}>
                    <Text style={styles.dayHeaderText}>{data.dayHeader}</Text>
                    </View></View>
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
                <Text>{"Käyttäjä: "}{user}</Text>
                <View style={styles.resourcePicker}>
            <ResourcePicker resources={testResources} resource= {resource} setResource={setResource}/>
            </View>
        <View style={styles.container}>
            {/*<WithOutCanvases resource={resource} dataJSON={dataJSON} daysToShow={daysToShow}/>*/}
            <TimeLabels/>
            <Canvases/>
            </View>
            <View style={styles.modals}>
            <CalendarModal person={user} resources={testResources} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
            <DeleteModal person={user} resources={testResources} delModalVisible={delModalVisible} setDelModalVisible={setDelModalVisible}/>
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
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    columnCenterView: {
        flexDirection: "column",
        justifyContent: "center"
    },
    centerView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    renderItemBottom: {
        backgroundColor: "grey",
        height: 10
    },
    cfl: {
        height: canvasHeight+70,
        marginTop: 60,
        width: "90%"
    },
    testiText: {
        fontSize: 20
    },
    separator: {
        backgroundColor: "grey",
        width: 10
    },
    modals :{
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonRow: {
        marginTop: canvasHeight+70,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flatlistContainer: {
        position: 'absolute',
       width: 1000,
       height: 1000,
       top: 0,
       left: 0

    },
    dayHeaderView: {
        
    },
    dayHeaderText: {
        fontSize: headerFont,
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
        height: 40,
        backgroundColor: "grey",
        flexDirection: "row",
        justifyContent: 'center'
    },
    CanvasesFlatList: {
        marginTop: 60,
        height: 1000,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    },
    renderItem: {
        height: 1000,
    },

    canvasItem: {
        height: 1000,
    },
    canvasesEnd: {
        width: 20,

    },
    resourcePicker: {
        marginTop: 0
    },
    day: {
        flexDirection: "row",
        justifyContent: "center",
        height: startMargin,
    },
    mainColumn: {
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        width: 300,
        height: 1000
        
    },
    column: {
        flex:1,
        flexDirection: "column",
        marginLeft: 10,
    },
    canvases: {
      flex: 1,
      flexDirection: "row",
      marginTop: topMargin,
      backgroundColor: "grey",
      height: canvasHeight + 50,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20
        

    },
    canvas: {
        width: canvasWidth,
        height: canvasHeight,
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