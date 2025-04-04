const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

exports.checkAndSendNotifications = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
        const now = admin.firestore.Timestamp.fromMillis(Date.now());
        const snapshotToken = await db.collection("notifications").get()
        
        let token
        snapshotToken.docs.forEach(doc => {
            token = doc.fcmToken;
          });

        const snapshotTime = await db.collection("notifications2")
          .where("muistutusaika", "<=", now)
          .where("muistutusaika", "==", "heti")
          .get();


        if(snapshotTime.empty){
            return null
        }

        const sendPromises = snapshotTime.docs.map(async (doc) => {
            const data = doc.data()
            const resource = data.resurssi
            const user = data.henkilo
            const aloitusaika = data.aloitusaika
            const lopetusaika = data.lopetusaika
            const message = resource + ": " + aloitusaika +","+lopetusaika
            await messaging.send({
                notification: {title: "Varausmuistutus", body: message},
                token: token,
              })
            return db.collection("notifications2").doc(doc.id).delete()
        })

        await Promise.all(sendPromises);
        console.log("All due notifications sent.");
        return null;

    })
    


    

// function name & event type
/*exports.checkAndSendNotifications = functions.pubsub
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
    });*/
