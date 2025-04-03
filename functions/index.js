const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

// These lines load the firebase-functions and firebase-admin modules,
// and initialize an admin app instance
// from which Cloud Firestore changes can be made.

const db = admin.firestore();
const messaging = admin.messaging();

// function name & event type
exports.checkAndSendNotifications = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
      // callback
      const now = admin.firestore.Timestamp.fromMillis(Date.now());

      const snapshot = await db.collection("notifications")
          .where("timestamp", "<=", now)
          .get();

      if (snapshot.empty) {
        console.log("No pending notifications.");
        return null;
      }

      const sendPromises = snapshot.docs.map(async (doc) => {
        const {fcmToken, message} = doc.data();

        await messaging.send({
          notification: {title: "Scheduled Notification", body: message},
          token: fcmToken,
        });

        // eslint-disable-next-line max-len
        return db.collection("notifications").doc(doc.id).delete(); // Remove after sending
      });

      await Promise.all(sendPromises);
      console.log("All due notifications sent.");
      return null;
    });
