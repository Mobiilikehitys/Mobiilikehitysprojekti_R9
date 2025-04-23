import { Modal, StyleSheet, View, Text, Button } from "react-native"
import react, {useEffect, useState} from "react"
import useData from "./useData"
import { MANAGEDRESOURCES } from "../firebase/Config"
import { dayJSON, hourJSON } from "./handleResources"

const BlockedTimesModal = ({resource, blockedTimes, setBlockedTimes}) => {
    const blockData = useData(MANAGEDRESOURCES)

    const [allowedDays, setAllowedDays] = useState(null)
    const [allowedHours, setAllowedHours] = useState(null)
    const [dayList, setDayList] = useState(null)
    

    useEffect(() => {
        if(blockData){
        setAllowedDays(dayJSON(blockData)[resource])
        setAllowedHours(hourJSON(blockData)[resource])
        console.log("allowedDays",dayJSON(blockData)[resource])
        console.log("allowedHours",hourJSON(blockData)[resource] )
        }
    },[blockData, resource])
    
    useEffect(() => {
        if(allowedDays){
        const allowedDaysList = []
        if(allowedDays["1"]==true){allowedDaysList.push("Maanantai")}
        if(allowedDays["2"]==true){allowedDaysList.push("Tiistai")}
        if(allowedDays["3"]==true){allowedDaysList.push("Keskiviikko")}
        if(allowedDays["4"]==true){allowedDaysList.push("Torstai")}
        if(allowedDays["5"]==true){allowedDaysList.push("Perjantai")}
        if(allowedDays["6"]==true){allowedDaysList.push("Lauantai")}
        if(allowedDays["0"]==true){allowedDaysList.push("Sunnuntai")}
        setDayList(allowedDaysList)
        }
    },[allowedDays])


    

    

    return(<Modal transparent={true}
                visible={blockedTimes}>
                    <View style={styles.centerView}>
                    <View style={styles.main}>
                    <Text style={styles.header}>Kielletty varausaika</Text>
                    <View style={styles.viewDays}>
                        <Text style={styles.header2}>{"Sallitut varauspäivät: "}</Text>
                        {dayList && dayList.map((item,index) => (
                            <Text key={index}>{item}</Text>
                        ))}
                    </View>
                    <View style={styles.viewHours}>
                        <Text style={styles.header2}>{"Sallitut varausajat: "}</Text>
                        {allowedHours && <Text>{allowedHours['Alku']}{" - "}{allowedHours['Loppu']}</Text>}
                    </View>
                    <View style={styles.button}>
                    <Button title="Sulje"
                    onPress={() => setBlockedTimes(false)}/>
                    </View>
                    </View></View>
                </Modal>)
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 25,
        paddingBottom: 25,
        fontWeight: "bold",
        fontSize: 20,
    },
    header2: {
        fontWeight: "bold",
        fontSize: 16
    },
    centerView: {
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        height: 45,
        width: 90,
    },
    main: {
        backgroundColor: "white",
        width: 300,
        height: 400,
        borderRadius: 10,
        alignItems: "center"
    },
    modal: {
        
    },
    viewDays: {

    },
    viewHours: {
        marginTop: 25,
        marginBottom: 25
    },
})

export {BlockedTimesModal}