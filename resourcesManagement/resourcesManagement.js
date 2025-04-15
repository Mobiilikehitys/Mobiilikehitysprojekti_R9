import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Pressable } from "react-native";
import { firestore, collection, query, onSnapshot, doc, setDoc, addDoc, getAuth, signInWithEmailAndPassword, serverTimestamp, Timestamp, MANAGEDRESOURCES, orderBy } from "../firebase/Config.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext.js";
import NewResourceModal from "./newResourceModal.js";
import EditResourceModal from "./editResourceModal.js";

export default function ResourcesManagement({ user }) {

    const [items, setItems] = useState([])

    useEffect(() => {
        const q = query(collection(firestore, MANAGEDRESOURCES), orderBy('created', 'asc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempitems = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                tempitems.push({ ...doc.data(), id: doc.id })
            })
            setItems(tempitems)
        })
        return () => {
            unsubscribe()
        }
    }, [])



    const renderItem = ({ item }) => (

        <View style={styles.items}>
            <Text style={styles.itemsname}>{item.name}</Text>
            <Text>Varattavissa: {item.enabledHoursStart}–{item.enabledHoursEnd}</Text>
            <Text>Sallitut varauspäivät: {
                (item.enabledWeekdays.Monday ? 'ma ' : '') +
                (item.enabledWeekdays.Tuesday ? 'ti ' : '') +
                (item.enabledWeekdays.Wednesday ? 'ke ' : '') +
                (item.enabledWeekdays.Thursday ? 'to ' : '') +
                (item.enabledWeekdays.Friday ? 'pe ' : '') +
                (item.enabledWeekdays.Saturday ? 'la ' : '') +
                (item.enabledWeekdays.Sunday ? 'su ' : '')
            }</Text>
            <EditResourceModal item={item} />


        </View>
    );



    return (
        <View style={styles.centerView}>
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
            <NewResourceModal />
        </View>


    )

}

const styles = StyleSheet.create({
    createButton: {
        backgroundColor: "#ff6b6b",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 6,
    },
    items: {
        padding: 10,
        backgroundColor: "#ccc",
        margin: 6,
        borderRadius: 8,

    },
    itemsname: {
        fontWeight: 'bold',
    },
})