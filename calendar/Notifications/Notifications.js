import { addDoc, collection, firestore, onSnapshot, NOTIFICATIONS, auth, Timestamp } from "../../firebase/Config";
import deleteItem from "../../firebase/Delete";



function newNotification(user, resource, startTime, startTimeString, endTimeString) {
    console.log("newNotification aloitettu")

    const save = async () => {
        const docRefNow = await addDoc(collection(firestore, NOTIFICATIONS), {
            henkilo: user,
            resurssi: resource,
            aloitusaika: startTimeString,
            lopetusaika: endTimeString,
            muistutusaika: Timestamp.fromDate(
                new Date(startTime.getTime() - 15 * 60 * 1000)
            )
        })
        console.log("docRef done")

    }
    save()


}

function deleteNotification(Notifications, person, resurssi, aloituspaiva, aloitusaika) {
    for (note of Notifications) {
        if (note.henkilo == person && note.resurssi == resurssi) {
            const noteDay = new Date(note.aloitusaika.seconds * 1000)
            const noteDayString = noteDay.getDate().toString() + "." + (noteDay.getMonth() + 1).toString() + "." + noteDay.getFullYear().toString()
            const noteTimeString = noteDay.getHours().toString() + ":" + noteDay.getMinutes().toString()
            if (aloituspaiva == noteDayString && aloitusaika == noteTimeString) {
                deleteItem(NOTIFICATIONS, note.id)
            }

        }

    }
}

export { newNotification, deleteNotification }