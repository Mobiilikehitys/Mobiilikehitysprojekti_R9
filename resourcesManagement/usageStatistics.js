import { BarChart } from "react-native-chart-kit";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Pressable, Dimensions } from "react-native";
import { firestore, collection, query, onSnapshot, doc, setDoc, addDoc, getAuth, signInWithEmailAndPassword, serverTimestamp, Timestamp, orderBy, getDoc, MANAGEDRESOURCES } from "../firebase/Config.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext.js";

const screenWidth = Dimensions.get("window").width;

// tää tais jäädä protoiluasteelle

export default function UsageStatistics({ resource }) {
    const [chartData, setChartData] = useState({
        labels: ["MA", "TI", "KE", "TO", "PE", "LA", "SU"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0], // placeholder
            },
        ],
    });
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(firestore, 'companies', resource.companyId, resource.collection, resource.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const weekdays = [
                        'maanantai', 'tiistai', 'keskiviikko',
                        'torstai', 'perjantai', 'lauantai', 'sunnuntai'
                    ];

                    const reservations = data.reservationsByWeekday || {};
                    const total = weekdays.reduce((acc, day) => acc + (reservations[day] || 0), 0);

                    if (total > 0) {
                        const percentages = weekdays.map(day =>
                            ((reservations[day] || 0) / total) * 100
                        );

                        setChartData({
                            labels: ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU'],
                            datasets: [{ data: percentages }]
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching usage statistics:", error);
            }
        };

        fetchData();
    }, [resource]);

    const chartConfig = {
        decimalPlaces: 0,
        backgroundGradientFrom: "#808080",
        backgroundGradientTo: "#808080",
        color: () => `#ffffff`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                    <Text>Resurssin käyttöaste viikonpäivittäin</Text>
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
                    <Pressable
                style={[styles.graphButton]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.formButtonText}>Sulje</Text>
            </Pressable>
                </View>
            </Modal>

            <Pressable
                style={[styles.graphButton]}
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
    graphButton: {
        backgroundColor: "#A9A9A9",
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