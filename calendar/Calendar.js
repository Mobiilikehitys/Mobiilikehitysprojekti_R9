import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Button, StatusBar, KeyboardAvoidingView, FlatList } from 'react-native';
import Canvas, {Path2D} from 'react-native-canvas';
import timeToMinutes from './timeToMinutes';
import ResourcePicker from './ResourcePicker';
import CalendarModal from './CalenderModal';
import {thisDay, thisDayByMinutes} from './thisDay';
import useData from './useData';
import dataToJSON from './dataToJSON';
import DeleteModal from './DeleteModal';
import { RESERVATIONS } from '../firebase/Config';
import { canvasHeight, canvasWidth, startMargin, topMargin, header, headerFont } from './CanvasSizes';
import WithOutCanvases from './WithOutCanvases';
import { TimeLabels, DayHeaders } from './Headers';
import {getNextDays} from './nextDays';
import Clock from './Kello';
import Animated, { useAnimatedScrollHandler, useSharedValue, useDerivedValue, scrollTo, useAnimatedRef, runOnJS } from 'react-native-reanimated';
import { MANAGEDRESOURCES } from '../firebase/Config';
import {resourceList} from './handleResources';




export default function Calendar ({user}){

    
    const [fullClock, setFullClock] = useState(null)
    const [clockState, setClockState] = useState(null)
    const [stoppedText, setStoppedText] = useState("")


    const resourceData = useData(MANAGEDRESOURCES)
    const [resource, setResource] = useState(null)
    const [resources, setResources] = useState(null)

    const daysToShow = getNextDays()

    const offsetX = useSharedValue(0)
    const offsetY = useSharedValue(0)

    const xRef1 = useAnimatedRef()
    const xRef2 = useAnimatedRef()
    const yRef1 = useAnimatedRef()
    const yRef2 = useAnimatedRef()

    const sharedLock = useSharedValue({1:false, 2:false, 3:false, 4:false})

    const activeScroll = useSharedValue(null)


      const scrollHandler1 = useAnimatedScrollHandler((event) => {
            if(sharedLock.value[1] == false){
                sharedLock.value={1:false, 2:true, 3:true, 4:true}
                activeScroll.value = 1
                offsetX.value = event.contentOffset.x;
                sharedLock.value={1:false, 2:false, 3:false, 4:false}

            }
                
            

      });

      const scrollHandler2 = useAnimatedScrollHandler((event) => {
            if(sharedLock.value[2] == false){
                sharedLock.value={1:true,2:false, 3:true, 4:true}
                activeScroll.value = 2
                offsetX.value = event.contentOffset.x;
                sharedLock.value={1:false, 2:false, 3:false, 4:false}
            }
            
        

  });

  const scrollHandler3 = useAnimatedScrollHandler((event) => {
    if(sharedLock.value[3] == false){
        sharedLock.value={1:true, 2:true, 3:false, 4:true}
        activeScroll.value = 3
        offsetY.value = event.contentOffset.y;
        sharedLock.value={1:false, 2:false, 3:false, 4:false}
        }

});

    const scrollHandler4 = useAnimatedScrollHandler((event)=> {
        if(sharedLock.value[4] == false){
            sharedLock.value={1:true, 2:true, 3:true, 4:false}
            activeScroll.value = 4
            offsetY.value = event.contentOffset.y;
            sharedLock.value={1:false, 2:false, 3:false, 4:false}
        }
        
    })



      useDerivedValue(() => {
        if(activeScroll.value == 1){
            scrollTo(xRef2, offsetX.value,0, false);
            activeScroll.value = null
        }else if(activeScroll.value == 2){
            scrollTo(xRef1, offsetX.value,0, false);
            activeScroll.value = null
        }
        else if(activeScroll.value == 3){
            scrollTo(yRef2, 0, offsetY.value, false)
            activeScroll.value = null
        }else if(activeScroll.value == 4){
            scrollTo(yRef1, 0, offsetY.value, false)
            activeScroll.value = null
        }

      },[offsetX, offsetY])

    
    const [loadingState, setLoadingState] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [delModalVisible, setDelModalVisible] = useState(false)
    
    

    const data = useData(RESERVATIONS)
    let dataJSON
    if(data){
        dataJSON = dataToJSON({data})
        
        
    }

    useEffect(() => {
        console.log("useEffect1")
        const resources2 = resourceList(resourceData)
        if(resource == null && resources2 && resources2.length > 0){
            setResources(resources2)
            setResource(resources2[0])
        }
    },[resourceData])

    useEffect(() => {
        console.log("useeffect2")
        if(modalVisible || delModalVisible){
            console.log("Modaali näkyvissä")
            setClockState(false)
            setStoppedText("Clock stopped")
        }else{
            console.log("Ei modaalia")
            setClockState(true)
            setStoppedText("")
        }
    },[modalVisible, delModalVisible])
    

    
    /*
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
    }*/
    


    return(

                
                <KeyboardAvoidingView
                behavior={'height'}
                style={styles.mainColumn}>
                <View style={styles.clockRow}>
                <Text>{"Käyttäjä: "}{user}</Text>
                <Clock setFullClock={setFullClock} clockState={clockState}/>
                </View>
                <Text>{stoppedText}</Text>
                <View style={styles.resourcePicker}>
            {resource && resources && <ResourcePicker resources={resources} resource={resource} setResource={setResource}/>}
            </View>
        <View style={styles.calRow}>
        <TimeLabels yRef1={yRef1} scrollHandler3={scrollHandler3}/>
        <View styles={styles.calColumn}>
        <DayHeaders xRef={xRef1} scrollHandler={scrollHandler1}/>
        {resource && <WithOutCanvases resourceData={resourceData} user={user} fullClock={fullClock} yRef2={yRef2} xRef={xRef2} scrollHandler4={scrollHandler4} scrollHandlerX={scrollHandler2} daysToShow={daysToShow} resource={resource} dataJSON={dataJSON}/>}
        </View>
        </View>
            {/*<TimeLabels/>
            <Canvases/>*/}
            <View style={styles.modals}>
            {resources && <CalendarModal fullClock={fullClock} person={user} resources={resources} modalVisible={modalVisible} setModalVisible={setModalVisible}/>}
            {resources && <DeleteModal person={user} resources={resources} delModalVisible={delModalVisible} setDelModalVisible={setDelModalVisible}/>}
            </View>
            <View style={styles.buttonRow}>
            <View style={styles.buttonView}>
            <Button style={styles.button} title="Varaa aika"
            color= '#ff6b6b'
            onPress={() => {
                setModalVisible(true)}
            }/>
            
            </View>
            <View style={styles.buttonView}>
            <Button style={styles.button} title="Poista aika" color='#ff6b6b' onPress={() => 
                {setDelModalVisible(true)}}/></View></View>
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    clockRow: {
        flexDirection:"row",
        justifyContent: "space-between"
    },
    calColumn: {

    },
    calRow: {
        flexDirection:"row"
    },
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
        marginTop: 20,
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