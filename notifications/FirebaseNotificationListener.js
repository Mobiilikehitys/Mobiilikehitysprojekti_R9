import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const FirebaseNotificationListener = () => {
    useEffect(() => {
        // App opened from background by tapping notification
        const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log("Notification opened from background:", remoteMessage);
        });

        // App opened from quit state
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log("Notification opened from quit:", remoteMessage);
                }
            });

        // Foreground message handler
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
            Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
        });

        return () => {
            unsubscribeOpened();
            unsubscribeForeground();
        };
    }, []);

    return null;
};

export default FirebaseNotificationListener;
