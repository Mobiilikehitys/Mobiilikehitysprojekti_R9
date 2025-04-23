import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Pressable } from "react-native";
import { firestore, collection, query, onSnapshot, doc, setDoc, addDoc, getAuth, signInWithEmailAndPassword, serverTimestamp, Timestamp, orderBy } from "../firebase/Config.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext.js";
import saveEditedResource from "./saveEditedResource.js";
import { Picker } from "@react-native-picker/picker";
import hours from "./hours.js";
import deleteItem from "../firebase/Delete.js";

export default function EditResourceModal({ item }) {

    const { user } = useAuth();
    const companyId = user.uid
    const MANAGEDRESOURCES = `companies/${companyId}/resources/`

    const [modalVisible, setModalVisible] = useState(false);

    const [resourceName, setResourceName] = useState(item.name)

    const [enabledWeekdays, setEnabledWeekdays] = useState(item.enabledWeekdays);

    const [enabledHoursStart, setEnabledHoursStart] = useState(item.enabledHoursStart)
    const [enabledHoursEnd, setEnabledHoursEnd] = useState(item.enabledHoursEnd);
    const filteredEndHours = hours.filter(hour => hour.value > enabledHoursStart);


    const save = () => {
        if (resourceName == '') {
            Alert.alert(
                'Virhe',
                'Resurssilla on oltava nimi')
        }
        else if (enabledHoursStart >= enabledHoursEnd) {
            Alert.alert(
                'Virhe',
                'Tarkista varausajat')
        }
        else {
            saveEditedResource(companyId, item, resourceName, enabledHoursStart, enabledHoursEnd, enabledWeekdays)
            setModalVisible(!modalVisible)
        }
    }

    const toggleDay = (dayName) => {
        setEnabledWeekdays(prev => ({
            ...prev,
            [dayName]: !prev[dayName],
        }));
        console.log(enabledWeekdays)
    };

    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',];

    return (
        <View>

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Resurssin muokkaus</Text>

                    <TextInput style={styles.formInput}
                        value={resourceName}
                        onChangeText={text => setResourceName(text)}
                        placeholder="Resurssin nimi..."
                    />
                    <Text>Varattavissa alkaen</Text>

                    <View style={styles.pickerView}>
                        <Picker
                            style={styles.picker}
                            selectedValue={enabledHoursStart}
                            onValueChange={(itemValue, itemIndex) => {
                                setEnabledHoursStart(itemValue)
                                // setEnabledHoursEnd("24:00")
                            }
                            }>
                            {
                                hours.map(item => (
                                    <Picker.Item style={styles.item} key={item.value} value={item.value} label={item.label} />
                                ))
                            }
                        </Picker>
                    </View>
                    <Text>Varattavissa päättyen</Text>

                    <View style={styles.pickerView}>
                        <Picker
                            style={styles.picker}
                            selectedValue={enabledHoursEnd}
                            onValueChange={(itemValue, itemIndex) =>
                                setEnabledHoursEnd(itemValue)
                            }>
                            {
                                filteredEndHours.map(item => (
                                    <Picker.Item
                                        style={styles.item}
                                        key={item.value}
                                        value={item.value}
                                        label={item.label}
                                    />
                                ))
                            }
                        </Picker>
                    </View>

                    <Text>Sallitut varauspäivät</Text>

                    <View style={styles.weekdaysContainer}>
                        {orderedDays.map(day => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.dayButton,
                                    enabledWeekdays[day] && styles.dayButtonActive,
                                ]}
                                onPress={() => toggleDay(day)}
                            >
                                <Text style={styles.dayText}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.form}>
                        <View style={styles.formButtons}>

                            <Pressable
                                style={[styles.formButton]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.formButtonText}>Peruuta</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.formButton]}
                                onPress={save}>
                                <Text style={styles.formButtonText}>Tallenna</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.formButton]}
                                onPress={() => {
                                    Alert.alert(
                                        'Vahvista poisto',
                                        'Haluatko varmasti poistaa resurssin?',
                                        [
                                            { text: 'Peruuta', style: 'cancel' },
                                            {
                                                text: 'Poista',
                                                style: 'destructive',
                                                onPress: () => deleteItem(MANAGEDRESOURCES, item.id)
                                            }
                                        ]
                                    );
                                }}>
                                <Text style={styles.formButtonText}>Poista</Text>
                            </Pressable>

                        </View>
                    </View>


                </View>
            </Modal>

            <Pressable
                style={[styles.editButton]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.formButtonText}>Muokkaa</Text>
            </Pressable>

        </View>

    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 5,
        width: 450,
        flexDirection: "row",
        justifyContent: 'center'
    },
    modalView: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fbfafb',
        marginTop: 50,
        elevation: 5,
    },
    modalText: {
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    formInput: {
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 16,
        backgroundColor: '#ccc',
        borderRadius: 8,
        padding: 16,
    },
    formButtonsContainer: {
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    formButton: {
        backgroundColor: "#ff6b6b",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 6,
    },
    formButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',

    },
    editButton: {
        backgroundColor: "#A9A9A9",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 6,
    },
    weekdaysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 16,
    },
    dayButton: {
        backgroundColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 6,
    },
    dayButtonActive: {
        backgroundColor: '#4CAF50',
    },
    dayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    picker: {
        width: '100%',
        backgroundColor: '#ccc',
        borderRadius: 8,
    },
    pickerView: {
        width: '100%',
        borderRadius: 8,
        //borderWidth: 1,
        //borderColor:'#000000',
        overflow: 'hidden',
        marginBottom: 16,
    },
})