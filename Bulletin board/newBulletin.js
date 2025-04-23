import { addDoc, collection, firestore, onSnapshot, BULLETINS, auth, serverTimestamp } from "../firebase/Config";

export default function newBulletin (setPostSuccess , user, header, message) {

    const save = async () => {
        console.log("newBulletin-save-funktio")
        try{
        const docRef = await addDoc(collection(firestore, BULLETINS), {
            henkilo: user.email,
            otsikko: header,
            luotu: serverTimestamp(),
            viesti: message })
            setPostSuccess("Uusi ilmoitus lisätty")
            }catch(error){
            console.log("Could not post a new bulletin")
            setPostSuccess("Ilmoitus epäonnistui")
        }
        }
        save()

        
    }
    

