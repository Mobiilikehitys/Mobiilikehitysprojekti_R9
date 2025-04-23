import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export default function useNotificationHandler(user) {
    useEffect(() => {
      if (!user) return;

        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log("Authorization status:", authStatus);
                const token = await messaging().getToken();
                console.log("fcm token is", token);
            } else {
                console.log("Permission not granted");
            }
        };

        requestUserPermission();

        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log("Opened from quit state:", remoteMessage.notification);
                }
            });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log("Opened from background:", remoteMessage.notification);
        });

        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("Handled in background!", remoteMessage);
        });

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
        });

        return unsubscribe;
    }, []);
};
