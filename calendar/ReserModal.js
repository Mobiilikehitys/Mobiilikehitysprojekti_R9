import React,{useState} from "react"
import { Modal, Button, Text, StyleSheet, View } from "react-native"
import { overlay } from "react-native-paper"
import useData from "./useData"
import { RESERVATIONS } from "../firebase/Config"
import deleteItem from "../firebase/Delete"

export default function ReservationModal({user, reserModalVisible, setReserModalVisible, reservationData}){
    const data2 = useData(RESERVATIONS)
    const handleJSON = {}
    for(d of data2){
        handleJSON[d.id]={}
        handleJSON[d.id]["startDay"] = d['aloituspaiva']
        handleJSON[d.id]["startTime"] = d['aloitusaika']
        handleJSON[d.id]["endDay"] = d['lopetuspaiva']
        handleJSON[d.id]["endTime"] = d['lopetusaika']
        if(d['aloituspaiva'] == d['lopetuspaiva']){
            handleJSON[d.id]["sameDay"] = true
        }else{
            handleJSON[d.id]["sameDay"] = false
        }
    }
    
    const deleteReservation = (id) => {
        try{
            deleteItem(RESERVATIONS, id)
            delete handleJSON.id
            console.log("Delete done")
            console.log("handleJSON:", handleJSON[id])
            console.log("reservationData:", reservationData)
            setReserModalVisible(false)
        }catch(error){
            console.error("ReserModal deleteReservation error: ", error)
        }
    }

    return(
        <Modal
        visible={reserModalVisible}
        style={styles.modal}
        transparent={true}
        animationType="fade">
        <View style={styles.overlay}>
        <View style={styles.content}>
        <Text style={styles.header}>Varaus</Text>
        <View style={styles.texts}>
        {reservationData && handleJSON[reservationData['id']] && <><Text style={styles.text}>{"Varaaja: "}{reservationData['Person']}</Text>
        <Text style={styles.text}>{"Aloitus: "}{!handleJSON[reservationData['id']]["sameDay"] &&  handleJSON[reservationData['id']]["startDay"]}{" "}{handleJSON[reservationData['id']]["startTime"]}</Text>
        <Text style={styles.text}>{"Lopetus: "}{!handleJSON[reservationData['id']]["sameDay"] &&  handleJSON[reservationData['id']]["endDay"]}{" "}{handleJSON[reservationData['id']]["endTime"]}</Text></>}
        </View>
        {reservationData && reservationData['Person'] === user && <Button title = "Poista varaus" color='#ff6b6b' onPress={() => deleteReservation(reservationData['id'])}/>}
        <Button title = "Sulje"
        color='#ff6b6b'
        onPress={() => setReserModalVisible(false)}/>
        </View>
        </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 15
    },
    text:{
        fontSize: 18
    },
    texts: {
        
    },
    modal: {
        backgroundColor: 'rgba (90,90,90,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay:{
        flexDirection: "row",
        
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        
        backgroundColor: 'white',
        justifyContent: "center",
        marginTop: 300,
        width: 290,
        height:300,
        borderRadius: 10,
        borderStyle: "solid",
        borderColor: "black",
        alignItems: 'center'

    }
})