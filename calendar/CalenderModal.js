import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, Pressable, View, Button, Modal} from 'react-native'
import ResourcePicker from './ResourcePicker'
import DateTimePicker from '@react-native-community/datetimepicker'
import reservation from './reservation'
import useData from './useData'
import dataToJSON from './dataToJSON'


export default function CalendarModal ({person, resources, modalVisible, setModalVisible}) {

    const initClockStart = new Date()
    initClockStart.setMinutes(initClockStart.getMinutes() +2)
    const initClockEnd = new Date()
    initClockEnd.setHours(initClockEnd.getHours()+1)

    const [resource, setResource] = useState(resources[0])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    const [clockStart, setClockStart] = useState(initClockStart)
    const [clockEnd, setClockEnd] = useState(initClockEnd)
    const [showClockStart, setShowClockStart] = useState(false)
    const [showClockEnd, setShowClockEnd] = useState(false)

    


    const [reserSuccess, setReserSuccess] = useState(null)
  
    const data = useData()
    let dataJSON = []
    try{
    
    
    if(data.length != 0){
        dataJSON = dataToJSON({data})
    }
    }catch(error){
        console.error("CalendarModal-dataJSON:",error)
    }

    console.log("CalendarModal-data:",data)
    console.log("CalendarModal-dataJSON:",dataJSON)

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startDate
        setStartDate(currentDate)
        setShowStart(false)
    }

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endDate
        setEndDate(currentDate)
        setShowEnd(false)
    }

    const onChangeClockStart = (event, selectedTime) => {
        const currentTime = selectedTime || clockStart
        setClockStart(currentTime)
        setShowClockStart(false)
    }

    const onChangeClockEnd = (event, selectedTime) => {
        const currentTime = selectedTime || clockEnd
        setClockEnd(currentTime)
        setShowClockEnd(false)
    }

    const closeModal = () => {
        setModalVisible(false)
        setReserSuccess(null)
    }

    
    
    return(
            <View style={styles.main}>
            <Modal
            transparent={true}
            visible={modalVisible}>
            
            <View style={styles.centerModal} >
            <View style={styles.modalView}>
            
             <View style={styles.headerView}> 
            <Text style={styles.header}>{"Uusi varaus"}</Text>
            </View>
            
            <ResourcePicker resource={resource} resources={resources} setResource={setResource}/>
            
            <View style={styles.timeView}>  
            <Pressable onPress={() => {setShowStart(true)
                                        setShowEnd(false)}}>
                <Text style={styles.text}>{startDate && startDate instanceof Date
                ? "Aloituspäivä: " + startDate.getDate().toString() + "." + (startDate.getMonth() + 1).toString() + "." + startDate.getFullYear().toString()
                : "Aloituspäivä ei saatavilla"}</Text>
            </Pressable></View>
            
            
            {showStart ?
            <DateTimePicker
            testID={'DatePicker1'}
            value={startDate}
            mode={'date'}
            is24hour={true}
            display={'default'}
            onChange={onChangeStart}
            />:null
            
            }
            

            {showClockStart ?
            <DateTimePicker
            testID={'DatePicker3'}
            value={clockStart}
            mode={'time'}
            is24hour={true}
            display={'spinner'}
            onChange={onChangeClockStart}
            />:null}

            <View style={styles.timeView}>
            <Pressable onPress={() => setShowClockStart(true)}>
                <Text style={styles.text}>{"Aloitusaika: "+ clockStart.getHours().toString()+":"+clockStart.getMinutes().toString().padStart(2,"0")}</Text>
            </Pressable>
            </View>
            
            <View style={styles.timeView}>
            <Pressable onPress={() => {setShowEnd(true)}
            }>
                <Text style={styles.text}>{"Lopetuspäivä: "+endDate.getDate().toString() + "."+ (endDate.getMonth()+1).toString() +"." + endDate.getFullYear().toString()}</Text>
            </Pressable></View>
            
            {showEnd ?
                <DateTimePicker
            testID={'DatePicker2'}
            value={endDate}
            mode={'date'}
            is24hour={true}
            display={'default'}
            onChange={onChangeEnd}
            />:null}

            {showClockEnd ?
            <DateTimePicker
            testID={'DatePicker4'}
            value={clockEnd}
            mode={'time'}
            is24hour={true}
            display={'spinner'}
            onChange={onChangeClockEnd}
            />: null}
            
            
            <View style={styles.timeView}>
            <Pressable onPress={() => setShowClockEnd(true)}>
                <Text style={styles.text}>{"Lopetusaika: "+clockEnd.getHours().toString()+":"+clockEnd.getMinutes().toString().padStart(2,"0")}</Text>
            </Pressable>
            </View>
            <View>
            <Text>{reserSuccess}</Text>  
            </View>
            
            <View style={styles.buttons}>
            <View style={styles.button}>
            <Button title="Varaa"
            onPress={() => {reservation({dataJSON, reserSuccess, setReserSuccess ,resource, person, startDate, clockStart, endDate, clockEnd})}}/>
            </View>
            <View style={styles.button}>

            <Button title="Sulje"
            onPress={() => closeModal()}/>  
            </View>
            
            </View>
            </View>
            
            </View> 
            </Modal>
            </View>
            

    )
}

const styles = StyleSheet.create({

    centerModal: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    button: {
        width: 100
    },
    main: {
        
    },
    timeView: {
        marginBottom: 30,
        marginTop: 20
    },
    pickerTextView: {
        marginTop: 15,
    },
    text: {
        fontSize: 20,
    },
    closeView: {
        marginLeft: 10,
        marginTop: 10
    },
    closeText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    picker: {
        marginTop: 20
    },
    outModal: {
        flex: 1,
        flexDirection:"row",
        justifyContent: "center"
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    headerView: {
        flexDirection: "row",
        justifyContent: 'center'
    },
    modalView: {
        backgroundColor: "white",
        position: 'relative',
        height: 600,
        width: 300,
        top: 100,
        margin: 20,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 5,
    },
    modalViewExpanded: {
        backgroundColor: "white",
        position: 'relative',
        height: 500,
        width: 300,
        top: 150,
        left: 10,
        margin: 20,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 50,
    }
})