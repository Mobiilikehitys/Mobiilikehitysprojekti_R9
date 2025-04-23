const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

exports.checkAndSendNotifications = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const now = admin.firestore.Timestamp.fromMillis(Date.now());

    // Nuuskitaan notifikaatiot
    const snapshotTime = await db.collection("notifications2")
      .where("muistutusaika", "<=", now)
      .get();

    if (snapshotTime.empty) {
      console.log("No pending notifications.");
      return null;
    }

    const sendPromises = snapshotTime.docs.map(async (doc) => {
      const data = doc.data();
      const userEmail = data.henkilo;

      // Haetaan käyttäjä
      const userSnapshot = await db.collection("users")
        .where("email", "==", userEmail)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        console.warn(`No user found with email: ${userEmail}`);
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const token = userDoc.data().fcmToken;

      if (!token) {
        console.warn(`No FCM token for user: ${userEmail}`);
        return;
      }

      // Lähetetään notifikaatio
      const resource = data.resurssi;
      const aloitusaika = data.aloitusaika;
      const lopetusaika = data.lopetusaika;
      const message = `${resource}: ${aloitusaika} - ${lopetusaika}`;

      await messaging.send({
        notification: { title: "Varausmuistutus", body: message },
        token: token,
      });

      // Poistetaan notifikaatio
      await db.collection("notifications2").doc(doc.id).delete();
    });

    await Promise.all(sendPromises);
    console.log("All due notifications sent.");
    return null;
  });


  exports.reservationsByWeekday = functions.firestore
  .document('companies/{companyId}/resources/{resourceId}/reservations/{reservationId}')  // kollataan dokumenttien luontia
  .onCreate(async (snap, context) => {
    const { companyId, resourceId } = context.params;

    const reservationsRef = db.collection(`companies/${companyId}/resources/${resourceId}/reservations`);
    const reservationsSnap = await reservationsRef.get();

    const weekdayMap = {
      maanantai: 0,
      tiistai: 0,
      keskiviikko: 0,
      torstai: 0,
      perjantai: 0,
      lauantai: 0,
      sunnuntai: 0,
    };

    reservationsSnap.forEach(doc => {
      const data = doc.data();
      const dateStr = data.aloituspaiva;

      if (!dateStr) return;

	// raakataan viikonpäivä
      const [day, month, year] = dateStr.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      const weekday = date.toLocaleDateString('fi-FI', { weekday: 'long' }).toLowerCase();

      if (weekdayMap.hasOwnProperty(weekday)) {
        weekdayMap[weekday]++;
      }
    });

    // päivitetään dokkari
    const resourceRef = db.doc(`companies/${companyId}/resources/${resourceId}`);
    await resourceRef.set({ reservationsByWeekday: weekdayMap }, { merge: true });

    console.log('Updated reservationsByWeekday for resource ${resourceId}');
    return null;
  });