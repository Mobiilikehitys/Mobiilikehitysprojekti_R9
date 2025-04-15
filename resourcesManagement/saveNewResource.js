import { addDoc, firestore, collection, MANAGEDRESOURCES, serverTimestamp } from "../firebase/Config"


export default function saveNewResource (resourceName, enabledHoursStart, enabledHoursEnd, enabledWeekdays) {

    const save = async () => {
        try{
        const docRef = await addDoc(collection(firestore, MANAGEDRESOURCES), {
            name: resourceName,
            created: serverTimestamp(),
            enabledHoursStart: enabledHoursStart,
            enabledHoursEnd: enabledHoursEnd,
            enabledWeekdays: enabledWeekdays,
            
        })}catch(error){
            console.log("Could not create resource")
        }
        }
        save()

        
    }