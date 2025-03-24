import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function Calendar (){


    const[maLista, setMaLista] = useState([])
    const[tiLista, setTiLista] = useState([])
    const[keLista, setKeLista] = useState([])
    const[toLista, setToLista] = useState([])
    const[peLista, setPeLista] = useState([])
    const[laLista, setLaLista] = useState([])
    const[suLista, setSuLista] = useState([])

    const makeLists = () => {
        const today = new Date()
        const getDay = today.getDay()
        const getDate = today.getDate()
        const getMonth = today.getMonth()
        const getYear = today.getFullYear()
        
        const weekMonday = today.setDate(today.getDate() - getDay)
        const weekSunday = weekMonday.setDate(weekMonday.getDate() + 6)



        

        
    }
    
    


    const times = () => {
        const timeList = []
        for(let i = 0; i <= 23; i+=0.5 ){
            timeList.push(i)
        }
        return timeList
    }

    const timeList=times()

    const renderItem = ({item}) => {
        <View style={styles.cell}>
            
        </View>
    }

    return(
        <View style={styles.container}>
            <View style={styles.clockColumn}>
                <Text style={styles.header}>Kello</Text>
                {timeList.map((time) => (
                    <View key={time} style={styles.cell}>
                        <Text>{time}</Text>
                    </View>
                ))}
                {

                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRow: {

    },
    header:{

    },
    cell: {

    }
  });