import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import ResourcesManagement from '../resourcesManagement/resourcesManagement.js';
import { auth, onAuthStateChanged } from '../firebase/Config'
import { useAuth } from '../context/AuthContext.js';


export default function ResurssienHallinta() {

  const { user } = useAuth();

    return (
            <View>
                {user?.accountType === "company" ? ( <ResourcesManagement user={user.email} />) : (<Text>Not authorized</Text>)}
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});
