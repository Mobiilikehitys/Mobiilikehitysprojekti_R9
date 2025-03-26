import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {useEffect, useState} from 'react'

export default function ResourcePicker({resources, resource, setResource}){
    return(
        <View style={styles.container}>
            <Picker style={styles.picker}
                selectedValue={resource}
                onValueChange={(itemValue, itemIndex) => 
                    setResource(itemValue)
                }
            >
                <Picker.Item style={styles.item} label={"Resurssi"}/>
                {resources.map((item, index) => 
                <Picker.Item key={index} style={styles.item} label={item} value={item}/>
                )}

            </Picker>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    picker:{
        
    }
})