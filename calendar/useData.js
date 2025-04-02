import { query, collection, firestore, onSnapshot, RESERVATIONS } from "../firebase/Config";
import { useEffect, useState } from "react";

function useData (target) {
    const [data, setData] = useState([])
    useEffect(() => {
        const q = query(collection(firestore, target))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempReservations = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                tempReservations.push({...doc.data(), id: doc.id})
            })
            setData(tempReservations)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return data



}

export default useData