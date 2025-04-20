import React, { useState } from "react"
import useData from "./useData"
import { Pressable, View, StyleSheet, Modal, Text, TouchableOpacity, ScrollView, FlatList, Button } from "react-native"
import deleteItem from "../firebase/Delete"
import ResourcePicker from "./ResourcePicker"
import reservation from "./reservation"
import { firestore, RESERVATIONS, NOTIFICATIONS } from "../firebase/Config"
import Icon from 'react-native-vector-icons/FontAwesome'
import { deleteNotification } from "./Notifications/Notifications"

export default function DeleteModal({person, delModalVisible,setDelModalVisible, resources}){
    const [delSuccess, setDelSuccess] = useState("")
    const [resource, setResource] = useState(resources[0])
    const closeModal = () => {
        setDelModalVisible(false)
        setDelSuccess("")
    }

    const Reservations = useData(RESERVATIONS)
    const Notifications = useData(NOTIFICATIONS)

    const DeleteListScroll = () => {
        return(
            <ScrollView style={styles.scroll}>
            {Reservations.map((data, index) => (
                data.henkilo == person && data.resurssi == resource && 
                <View key={data.id} style={styles.Reservation}>
                <Pressable onPress={() => {deleteItem(RESERVATIONS, data.id)
                                            deleteNotification(Notifications,person,resource, data.aloituspaiva, data.aloitusaika)}}>
                <View style={styles.delRow}>
                <View style={styles.texts}>
                <Text>{data.aloituspaiva+" "+data.aloitusaika}</Text>
                <Text>{data.lopetuspaiva+" "+data.lopetusaika}</Text>
                </View>
                <View style={styles.trashcan}>
                <Icon name="trash" size={30} color="#000" />
                </View>
                </View>
                </Pressable></View>
            ))}
            </ScrollView>
        )
    }

    const RenderItem = (item) => {
        return(
            <View key={item.id} style={styles.Reservation}>
                <Pressable onPress={() => deleteItem(RESERVATIONS, item.id)} >
                <View style={styles.delRow}>
                <View style={styles.texts}>
                <Text>{item.aloituspaiva+" "+item.aloitusaika}</Text>
                <Text>{item.lopetuspaiva+" "+item.lopetusaika}</Text>
                </View>
                <View style={styles.trashcan}>
                <Icon name="trash" size={30} color="#000" />
                </View>
                </View>
                </Pressable></View>
        )
    }

    const DeleteListFlat = () => {
        return(
        <FlatList
                    data={Reservations}
                    renderItem={({item, index}) => RenderItem(item) }
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.flatlistContainer}
                    />
                )
    }
    return(
        <View style={styles.main}>
            <View>
            <Modal
            transparent={true}
            style={styles.modal}
            visible={delModalVisible}>
                
            
            <View style={styles.centerModal}>
            <View style={styles.modalView}>

            
            
                         <View style={styles.headerView}> 
                        <Text style={styles.header}>Poista varaus</Text>
                        </View>
                        
                        
                        
            <ResourcePicker resources={resources} resource={resource} setResource={setResource}/>
            <DeleteListScroll/>

            <View style={styles.closeView}>
            <View style={styles.closeButton}>
        <Button title="Close"
                onPress={() => closeModal()}
                />
                </View>
                </View>
            </View>
            </View>
        </Modal>
        </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    centerModal: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    main: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    closeView: {
        flexDirection: "row",
        justifyContent: "center"
    },
    closeButton: {
        height: 40,
        width: 150,
        justifyContent:  'center'

    },
    headerRow: {
        flex:1,
        flexDirection: "row"

    },
    xView: {
        position: "absolute",
        right: 20,
        top: 20
    },
    modalContainer: {

    },
    scroll: {
        flex: 1,
    },
    outModal: {
        flex:1,
        flexDirection: "row",
        justifyContent: 'center'
    },
    main: {
        flex:1
    },
    delRow: {
        flexDirection: "row",
        justifyContent: 'space-evenly'
    },
    Reservation: {
        marginTop: 20
    },
   
    modalView:{
        backgroundColor: "white",
        position: 'relative',
        height: 550,
        width: 300,
        top: 150,
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
    headerView:{
        flexDirection: "row",
        justifyContent: 'center'
    },
    header:{
        fontSize: 20,
        fontWeight: 'bold'
    }
})