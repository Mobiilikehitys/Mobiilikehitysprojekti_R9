import useData from "../calendar/useData";
import { BULLETINS, addDoc, firestore } from "../firebase/Config";
import {Text, View, StyleSheet, Button, FlatList, Pressable } from "react-native"
import newBulletin from "./newBulletin";
import BulletinModal from "./newBulModal";
import { useState } from "react";
import useDataOrder from "./useDataOrder";
import { convertFirebaseTimeStampJS } from "./serverTimeStampToJSON";
import Icon from 'react-native-vector-icons/FontAwesome'
import deleteItem from "../firebase/Delete";


export default function Board({user}){
    const [modalVisible, setModalVisible] = useState(false)
    const oldData = useDataOrder(BULLETINS)

    const RenderItem = (item) => {
        const timeStamp = convertFirebaseTimeStampJS(item.luotu)
        return(
            <View style={styles.centerView}>
        <View style={styles.bulletin}>
            <View style={styles.createdView}>
            <Text style={styles.createdText}>{item.henkilo}{" "}{timeStamp}</Text></View>
            {item.henkilo == user && <View style={styles.closeButton}><Pressable onPress={() => {deleteItem(BULLETINS, item.id)}}>
                <Icon name="times" size={30} color="#000" /></Pressable></View>}
                {item.otsikko && <View style={styles.headerView}><Text style={styles.headerText}>{item.otsikko}</Text></View>}
                <View style={styles.messageView}><Text style={styles.messageText}>{item.viesti}</Text></View>
        </View></View>)
    }
    return(
        <View style={styles.centerView}>
            <View style={styles.centerView}>
            <View>
            <View style={styles.button}>
            <Button title="Uusi ilmoitus"
            onPress={() => setModalVisible(true)}/></View>
            <FlatList
                        data={oldData}
                        renderItem={({item, index}) => RenderItem(item) }
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.flatlistContainer}
                        />
            <BulletinModal user={user} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
            </View></View>
        </View>
    )


}

const styles = StyleSheet.create({
    headerView: {
        marginLeft: 10,
        marginTop: 5
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    centerView: {
        flexDirection: "row",
        justifyContent: 'center'
    },
    button: {
        marginTop: 5,
        width: 450,
        flexDirection: "row",
        justifyContent: 'center'
    },
    messageView: {
        padding: 10
    },
    createdView: {
        paddingLeft: 10
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 5
    },
    bulletin: {
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        backgroundColor: "rgb(20, 167, 215)",
        borderRadius: 10,
        width: 300
    },
    flatlistContainer:{

    },
    messageText:{
        fontSize: 15
    },
    createdText: {
        fontSize: 10
    },
})