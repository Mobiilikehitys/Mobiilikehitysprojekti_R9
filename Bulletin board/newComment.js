import { BULLETINS, collection, doc, firestore, updateDoc, addDoc, serverTimestamp } from "../firebase/Config";

export default function newComment (setCommentSuccess, documentId,comment, user){
    const save = async() => {
        console.log("newComment-save-funktio")
        try{
            const comRef = await doc(firestore, BULLETINS, documentId)
            const coll = collection(comRef, "comments")
           const update = await addDoc(coll, {
                henkilo: user,
                kommentti: comment,
                luotu: serverTimestamp()
           })
           setCommentSuccess("Kommentti luotu")
        }catch(error){
            console.log("Could not post a new comment")
            setCommentSuccess("Kommentin luonti epäonnistui")
        }
    }

    save()
}