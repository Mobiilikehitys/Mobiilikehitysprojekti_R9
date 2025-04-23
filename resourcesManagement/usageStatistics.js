import { BarChart } from "react-native-chart-kit";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Pressable, Dimensions } from "react-native";
import { firestore, collection, query, onSnapshot, doc, setDoc, addDoc, getAuth, signInWithEmailAndPassword, serverTimestamp, Timestamp, orderBy, getDoc } from "../firebase/Config.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext.js";

const screenWidth = Dimensions.get("window").width;
const companyId = "Gaj885G9LHvIHK46Ls3n"
const resourceId = "4Cj2ytKKWcOeymTFJCQE"

// tää tais jäädä protoiluasteelle

export default function UsageStatistics() {

    const [modalVisible, setModalVisible] = useState(false);


    const [chartData, setChartData] = useState({
        labels: ["MA", "TI", "KE", "TO", "PE", "LA", "SU"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0], // placeholder
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await fetchResource(companyId, resourceId);

            if (fetchedData) {
                const totalValue = Object.values(fetchedData.reservationsByWeekday).reduce((acc, val) => acc + (val || 0), 0);
                console.log(totalValue)
                const updatedData = {
                    labels: ["MA", "TI", "KE", "TO", "PE", "LA", "SU"],
                    datasets: [
                        {
                            data: [
                                (fetchedData.reservationsByWeekday.maanantai || 0) / totalValue * 100,
                                (fetchedData.reservationsByWeekday.tiistai || 0) / totalValue * 100,
                                (fetchedData.reservationsByWeekday.keskiviikko || 0) / totalValue * 100,
                                (fetchedData.reservationsByWeekday.torstai || 0) / totalValue * 100,
                                (fetchedData.reservationsByWeekday.perjantai || 0) / totalValue * 100,
                                (fetchedData.reservationsByWeekday.lauantai || 0) / totalValue * 100,
                                (fetchedData.reservationsByWeekday.sunnuntai || 0) / totalValue * 100,
                            ],
                        },
                    ],
                };
                setChartData(updatedData);
            }
        };

        fetchData();
    }, [companyId, resourceId]);

    const fetchResource = async (companyId, resourceId) => {
        try {
            const docRef = doc(firestore, "companiestest", companyId, "resources", resourceId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                console.log("Resource data:", fetchedData);
                return fetchedData;
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching resource:", error);
        }
    };

    const chartConfig = {
        decimalPlaces: 0,
        backgroundGradientFrom: "#808080",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#808080",
        backgroundGradientToOpacity: 1,
        color: () => `#ffffff`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,   // tän chart-kitin käyttö on aivan syvältä, ei hyvää päivää
        strokeWidth: 16,
        barPercentage: 0.5,
        barRadius: 4,
        fillShadowGradient: '#50C878',
        fillShadowGradientTo: '#98FB98',
        fillShadowGradientOpacity: 1,
        fillShadowGradientToOpacity: 1,
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#cccccc",
            strokeWidth: 0.2
        }
    };

    return (

        <View>

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalView}></View>

                <View>
                    <Text>Resurssin päivittäinen käyttöaste</Text>
                    <View style={{ overflow: 'hidden', borderRadius: 8, }}>
                        <BarChart
                            data={chartData}
                            width={screenWidth}
                            height={250}
                            yAxisSuffix="%"
                            fromZero={true}
                            showBarTops={false}
                            chartConfig={chartConfig}
                        />
                    </View>
                </View>
            </Modal>

            <Pressable
                style={[styles.formButton]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.formButtonText}>Käyttöastekuvaaja</Text>
            </Pressable>

        </View>)
}

const styles = StyleSheet.create({
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
})