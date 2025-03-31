import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "./Config";

const deleteItem = async(col,docId) => {
    try{
        await deleteDoc(doc(firestore, col, docId))
    }catch(error){
        console.error('Could not delete the item')
    }
}

export default deleteItem