import React, { useEffect, useState } from 'react'
import {StyleSheet, View, Text, Button} from 'react-native'
import {auth, onAuthStateChanged, getAuth, signOut} from '../firebase/Config'
import { useNavigation } from '@react-navigation/native'
export default function KirjauduUlos () {
    const user=auth.currentUser
    const [signedOut, setSignedOut] = useState(false)
    const navigation = useNavigation()
    const [infoText, setInfoText] = useState("")
    useEffect(() => {
        if(!user){
            setSignedOut(true)
            setInfoText("Olet jo uloskirjautunut")
        }
    }, [])


    const out = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("Signing out succeeded")
            setSignedOut(true)
            setInfoText("Kirjauduit ulos, ohjaudut kirjautumissivulle kolmen sekunnin sisään")
            setTimeout(() => navigation.navigate("Login"), 3000)
        }).catch((error) => {
            setInfoText("Uloskirjautuminen epäonnistui")
            console.log("Error when signing out:",error)
    });
    }
    
    return(<View style={styles.centerView}>
        {!signedOut ? <View style={styles.signedIn}>
            <View style={styles.firstRow}>
            <Text>{"Olet kirjautunut sisään käyttäjänä: "}</Text><Text style={styles.userText}>{user.email}</Text></View>
            <View style={styles.centerView}>
            <View style={styles.button}>
            <Button title="Kirjaudu ulos" onPress={() => out()}/></View></View></View> :<View style={styles.centerView}><View style={styles.infoView}><Text>{infoText}</Text></View></View>}
    </View>)

    

}

const styles = StyleSheet.create({
    infoView: {
        width: 300,
    },
    centerView: {
        flexDirection: "row",
        justifyContent: 'center'
    },
    userText: {
        fontWeight: "bold"
    },
    button:{
        width: 180,
        height: 60,
        marginTop: 40
    },
    signedIn: {
        
    },
    firstRow:{
        marginTop: 50,
        flexDirection: "row"
    }
})