import { addDoc, firestore, collection, serverTimestamp } from "../firebase/Config"


export default function saveNewResource (companyId, resourceName, enabledHoursStart, enabledHoursEnd, enabledWeekdays) {

    const MANAGEDRESOURCES = `companies/${companyId}/resources/`

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