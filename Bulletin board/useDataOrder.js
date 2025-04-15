import { useEffect, useState } from "react"
import { collection, firestore, query, BULLETINS, onSnapshot } from "../firebase/Config"
import { orderBy } from "firebase/firestore"

export default function useDataOrder (targetCollection) {
    const [data, setData] = useState([])
    useEffect(() => {
        const q = query(targetCollection, orderBy('luotu', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const tempBullets = []
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id)
                        tempBullets.push({...doc.data(), id: doc.id})
                    })
                    setData(tempBullets)
                })
                return () => {
                    unsubscribe()
                }
    }, [] )

    return data

}
