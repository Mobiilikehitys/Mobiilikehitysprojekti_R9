import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import messaging from "@react-native-firebase/messaging";

import { addDoc, collection, firestore, onSnapshot, USERS, auth } from "../firebase/Config";


const NotificationHandler = () => {

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("fcm token is", token);
        });
    } else {
      console.log("Permission not granted", authStatus);
    }

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification

          );

        }
      });

    // Assume a message-notifcation contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

}

export default NotificationHandler;