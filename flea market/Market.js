import useDataOrder from "../Bulletin board/useDataOrder";
import { useState } from "react";
import { MARKETPRODUCTS } from "../firebase/Config";
import { StyleSheet, View, Text, Button, FlatList, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import NewItemModal from "./newItemModal";
import { convertFirebaseTimeStampJS } from "../Bulletin board/serverTimeStampToJSON";
import deleteItem from "../firebase/Delete";

export default function FleaMarket({user}){
    const [modalVisible, setModalVisible] = useState(false)
    const oldData = useDataOrder(MARKETPRODUCTS)

    const RenderItem = (item) => {
        const timeStamp = convertFirebaseTimeStampJS(item.luotu)
        return(
            <View style={styles.centerView}>
            <View style={styles.market}>
            <View style={styles.createdView}>
            <Text style={styles.createdText}>{item.henkilo}{" "}{timeStamp}</Text></View>
            {item.henkilo == user && <View style={styles.closeButton}><Pressable onPress={() => {deleteItem(MARKETPRODUCTS, item.id)}}>
                <Icon name="times" size={30} color="#000" /></Pressable></View>}

                {item.hinta == 0 || !item.hinta ? <View style={styles.giveAwayView}><Text style={styles.giveAwayText}>Annetaan</Text></View>:<View><View style={styles.headerView}>
                <Text style={styles.headerLabel}>Myydään: </Text>
                    <Text style={styles.headerText}>{item.tuote}</Text>
                </View>

                
                <View style={styles.priceView}>
                <Text style={styles.priceLabel}>Hinta: </Text>
                <Text style={styles.priceText}>{item.hinta}{"€"}</Text></View></View>}
                <View style={styles.messageView}><Text style={styles.messageText}>{item.viesti}</Text></View>
        </View></View>)
    }

    return(
            <View style={styles.centerView}>
                <View style={styles.centerView}>
                <View>
                <View style={styles.centerView}>
                <View style={styles.button}>
                <Button title="Uusi myynti-ilmoitus"
                onPress={() => setModalVisible(true)}/></View></View>
                <FlatList
                            data={oldData}
                            renderItem={({item, index}) => RenderItem(item) }
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.flatlistContainer}
                            />
                <NewItemModal user={user} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
                </View></View>
            </View>
        )



   
}

const styles = StyleSheet.create({
    giveAwayText: {
        fontWeight: 'bold',
        fontSize: 18
    },
    giveAwayView: {

    },
    headerLabel: {
        fontSize: 17
    },
    priceLabel: {
        fontSize: 15
    },
    button: {
        width: "80%"
    },
    flatlistContainer: {

    },
    centerView: {
        flexDirection: "row",
        justifyContent: 'center'
    },
    market: {
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        backgroundColor: "rgb(20, 167, 215)",
        borderRadius: 10,
        width: "90%"
    },
    createdView: {

    },
    createdText: {

    },
    headerView: {
        marginTop: 10,
        flexDirection: "row"
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 17
    },
    priceView: {
        flexDirection: "row"
    },
    priceText: {
        fontWeight: 'bold',
        fontSize: 15
    },
    messageView: {
        marginTop: 10
    },
    messageText: {

    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 5
    },




})