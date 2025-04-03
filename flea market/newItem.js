import { addDoc, firestore, collection, MARKETPRODUCTS, serverTimestamp } from "../firebase/Config"


export default function newItem (user, product, price, message) {

    const save = async () => {
        try{
        const docRef = await addDoc(collection(firestore, MARKETPRODUCTS), {
            henkilo: user,
            tuote: product,
            hinta: price,
            luotu: serverTimestamp(),
            viesti: message
            
            
        })}catch(error){
            console.log("Could not post a new bulletin")
        }
        }
        save()

        
    }