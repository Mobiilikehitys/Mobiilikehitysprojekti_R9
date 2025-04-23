import { firestore, doc, setDoc } from "../firebase/Config"

export const saveFcmToken = async (fcmToken, uid) => {
    try {
        const userRef = doc(firestore, "users", uid);
        await setDoc(
            userRef,
            { fcmToken: fcmToken },
            { merge: true }
        );
        console.log("FCM token saved successfully.");
    } catch (error) {
        console.error("Error saving FCM token:", error);
    }
};