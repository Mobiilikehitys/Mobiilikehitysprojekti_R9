import { addDoc, collection, firestore, onSnapshot, NOTIFICATIONS, auth, Timestamp } from "../../firebase/Config";
import deleteItem from "../../firebase/Delete";



function newNotification (user, resource, startTime, endTime){
    console.log("newNotification aloitettu")

    const save = async () => {
        console.log("save aloitettu")
        console.log("save-time:",time)
        const docRefNow = await addDoc(collection(firestore, NOTIFICATIONS), {
            henkilo: user,
            resurssi: resource,
            aloitusaika: Timestamp.fromDate(startTime),
            lopetusaika: Timestamp.fromDate(endTime),
            muistutusaika: "heti"
        })
        console.log("First docRef done")
        const now = new Date()
        const diff = time-now
        const diffInMinutes = diff/1000/60

        if(diffInMinutes >= 15){
            const remember = new Date(time.getTime())
            remember.setMinutes(remember.getMinutes()-15)
            const docRefLater = await addDoc(collection(firestore, NOTIFICATIONS), {
                henkilo: user,
                resurssi: resource,
                aloitusaika: Timestamp.fromDate(time),
                lopetusaika: Timestamp.fromDate(endTime),
                muistutusaika: Timestamp.fromDate(remember)
            })
            console.log("Second docRef done")
        }
    }
   save()
    

}

function deleteNotification(Notifications, person, resurssi, aloituspaiva, aloitusaika){
    for(note of Notifications){
        if(note.henkilo == person && note.resurssi == resurssi){
            const noteDay = new Date(note.aloitusaika.seconds*1000)
            const noteDayString = noteDay.getDate().toString() +"."+(noteDay.getMonth()+1).toString()+"."+noteDay.getFullYear().toString()
            const noteTimeString = noteDay.getHours().toString()+":"+noteDay.getMinutes().toString()
            if(aloituspaiva == noteDayString && aloitusaika == noteTimeString){
                deleteItem(NOTIFICATIONS, note.id)
            }

        }

    }
}

export {newNotification, deleteNotification}