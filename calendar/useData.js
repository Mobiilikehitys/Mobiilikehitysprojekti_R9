import { query, collection, firestore, onSnapshot, RESERVATIONS } from "../firebase/Config";
import { useEffect, useState } from "react";

function useData () {
    const [reservations, setReservations] = useState([])
    useEffect(() => {
        const q = query(collection(firestore, RESERVATIONS))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempReservations = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                tempReservations.push({...doc.data(), id: doc.id})
            })
            setReservations(tempReservations)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return reservations



}

export default useData