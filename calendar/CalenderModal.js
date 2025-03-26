import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet, Text, Pressable, View, Button, Modal, TextInput, TouchableOpacity} from 'react-native';
import ResourcePicker from './ResourcePicker';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function CalendarModal ({resources, modalVisible, setModalVisible}) {
    const [resource, setResource] = useState("Resurssi")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")

    const [clockStart, setClockStart] = useState(new Date())
    const [clockEnd, setClockEnd] = useState(new Date())
    const [showClockStart, setShowClockStart] = useState(false)
    const [showClockEnd, setShowClockEnd] = useState(false)

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

    
    return(
            
            <Modal
            transparent={true}
            style={styles.modal}
            animationType='slide'
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            onDismiss={() => setModalVisible(false)}>
                <TouchableOpacity 
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
            style={styles.outModal}>
                
            <View style={styles.modalView}>
             <View style={styles.headerView}> 
            <Text style={styles.header}>Uusi varaus</Text>
            </View>  
            <ResourcePicker resource={resource} resources={resources} setResource={setResource}/>
            <View style={styles.TimeView}>
            <Pressable onPress={() => {setShowStart(true)
                                        setShowEnd(false)}}>
                <Text style={styles.text}>{"Aloituspäivä: "+startDate.getDate().toString() + "."+ (startDate.getMonth()+1).toString() +"." + startDate.getFullYear().toString()}</Text>
            </Pressable></View>
            {showStart &&
            <DateTimePicker
            testID='DatePicker1'
            value={startDate}
            mode='date'
            is24hour={true}
            display='default'
            onChange={onChangeStart}
            />
            
            }

            {showClockStart && 
            <DateTimePicker
            testID='DatePicker3'
            value={clockStart}
            mode='time'
            is24hour={true}
            display='spinner'
            onChange={onChangeClockStart}
            />}

            <View style={styles.TimeView}>
            <Pressable onPress={() => setShowClockStart(true)}>
                <Text style={styles.text}>{"Aloitusaika: "}{clockStart.getHours().toString()+":"+clockStart.getMinutes().toString()}</Text>
            </Pressable>
            </View>
            
            <View style={styles.TimeView}>
            <Pressable onPress={() => {setShowEnd(true)}
            }>
                <Text style={styles.text}>{"Lopetuspäivä: "+endDate.getDate().toString() + "."+ (endDate.getMonth()+1).toString() +"." + endDate.getFullYear().toString()}</Text>
            </Pressable></View>
            
            {showEnd &&
                <DateTimePicker
            testID='DatePicker2'
            value={endDate}
            mode='date'
            is24hour={true}
            display='default'
            onChange={onChangeEnd}
            />}
            {showClockEnd && 
            <DateTimePicker
            testID='DatePicker4'
            value={clockEnd}
            mode='time'
            is24hour={true}
            display='spinner'
            onChange={onChangeClockEnd}
            />}
            <View style={styles.TimeView}>
            <Pressable onPress={() => setShowClockEnd(true)}>
                <Text style={styles.text}>{"Lopetusaika: "}{clockEnd.getHours().toString()+":"+clockEnd.getMinutes().toString()}</Text>
            </Pressable>
            </View>
            <Button title="Varaa"></Button>
            </View>
            
            </TouchableOpacity>            
            </Modal>
            
            

    )
}

const styles = StyleSheet.create({

    TimeView: {
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
        flex: 1
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