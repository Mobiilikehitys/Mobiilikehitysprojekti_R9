import { addDoc, collection, firestore, onSnapshot, BULLETINS, auth, serverTimestamp } from "../firebase/Config";

export default function newBulletin (user, header, message) {

    const save = async () => {
        console.log("newBulletin-save-funktio")
        try{
        const docRef = await addDoc(collection(firestore, BULLETINS), {
            henkilo: user,
            otsikko: header,
            luotu: serverTimestamp(),
            viesti: message
            
            
        })}catch(error){
            console.log("Could not post a new bulletin")
        }
        }
        save()

        
    }
    

