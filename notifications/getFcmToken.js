import messaging from '@react-native-firebase/messaging';
import { saveFcmToken } from './saveFcmToken';


export const getFcmToken = async (uid) => {

    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) return null;

        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        console.log(uid)
        saveFcmToken(token, uid);
    } catch (err) {
        console.error("Error getting FCM token:", err);
        return null;
    }
};
