import { useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet, Button } from "react-native";
import newItem from "./newItem";

export default function NewItemModal({user, modalVisible, setModalVisible}){
    const [product, setProduct] = useState("")
    const [message, setMessage] = useState("")
    const [price, setPrice] =useState("")

    return(<Modal
    transparent={true}
    visible={modalVisible}>
        <View style={styles.centerView}>
        <View style={styles.modalView}>
            <View style={styles.centerView}>
            <Text style={styles.header}>Uusi myynti-ilmoitus</Text></View>
            <View style={styles.inputView}>
            <TextInput placeholder="Tuote"
            onChangeText={(text) => setProduct(text)}
            value={product}
            ></TextInput>
            <TextInput placeholder="Hinta"
            onChangeText={(text) => setPrice(text)}
            value={price}/>
            <TextInput
            multiline={true}
            numberOfLines={10}
            onChangeText={(text) => setMessage(text)}
            value={message}
            placeholder="Kirjoita tähän..."/></View>
            <View style={styles.buttons}>
            <View style={styles.button}>
            <Button title="Ilmoita" onPress={() => {newItem(user, product, price, message)}}/></View>
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