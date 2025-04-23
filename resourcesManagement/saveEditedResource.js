import { addDoc, firestore, collection, serverTimestamp, doc, setDoc } from "../firebase/Config"


export default function saveEditedResource(companyId, item, resourceName, enabledHoursStart, enabledHoursEnd, enabledWeekdays) {

    const MANAGEDRESOURCES = `companies/${companyId}/resources/`


    const save = async () => {
        try {
            const docRef = await setDoc(doc(firestore, MANAGEDRESOURCES, item.id), {
                name: resourceName,
                edited: serverTimestamp(),
                enabledHoursStart: enabledHoursStart,
                enabledHoursEnd: enabledHoursEnd,
                enabledWeekdays: enabledWeekdays,
            }, { merge: true });


        } catch (error) {
            console.log("Could not edit resource")
            console.log(error)
        }
    }
    save()


}