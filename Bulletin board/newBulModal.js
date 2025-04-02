import { useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet, Button } from "react-native";
import newBulletin from "./newBulletin";

export default function BulletinModal({user, modalVisible, setModalVisible}){
    const [bulletin, setBulletin] = useState("")
    const [header, setHeader] = useState("")

    return(<Modal
    transparent={true}
    visible={modalVisible}>
        <View style={styles.centerView}>
        <View style={styles.modalView}>
            <View style={styles.centerView}>
            <Text style={styles.header}>Uusi ilmoitus</Text></View>
            <View style={styles.inputView}>
            <TextInput placeholder="Otsikko"
            onChangeText={(text) => setHeader(text)}
            value={header}
            ></TextInput>
            <TextInput
            multiline={true}
            numberOfLines={10}
            onChangeText={(text) => setBulletin(text)}
            value={bulletin}
            placeholder="Kirjoita tähän..."/></View>
            <View style={styles.buttons}>
            <View style={styles.button}>
            <Button title="Ilmoita" onPress={() => {newBulletin(user, header, bulletin)}}/></View>
            <View style={styles.button}>
            <Button title="Sulje" onPress={()=> {setModalVisible(false)}}/></View></View>
        </View></View>
    </Modal>)
}

const styles = StyleSheet.create({
    button: {
        width: 100,
        
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 50
    },
    centerView: {
        flexDirection: "row",
        justifyContent: 'center'
    },
    inputView: {
        height: 300
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalView: {
        backgroundColor: "white",
        position: 'relative',
        height: 450,
        width: 300,
        top: 100,
        margin: 20,
        borderRadius: 20,
        padding: 35,
    }
})