import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import Calendar from '../calendar/Calendar';
import {auth, onAuthStateChanged} from '../firebase/Config'

export default function Varauskalenteri() {

    const user = auth.currentUser;
    console.log("User:", user.email)
    return( user ? <View style={styles.container}>
        <Calendar user={user.email}/>
        </View>
        :
        <View style={styles.signedOut}>
        <Text>sign in to see the calendar</Text>
         </View>
    
    
)}

const styles = StyleSheet.create({
    signedOut: {
        flexDirection: "column",
        justifyContent: "center"
    },
    container: {

        flexDirection: "row",
        justifyContent: "center"
        
    }
});
