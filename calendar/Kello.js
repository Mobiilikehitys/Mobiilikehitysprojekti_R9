import { Text } from "react-native"
import React, {useRef, useState, useEffect} from "react"


export default function Clock({clockState, setFullClock}){
    const [clock, setClock] = useState("")
    const intervalRef = useRef(null)

    const tick = () => {
        const timeMinutes = new Date()
        const hours = timeMinutes.getHours()
        const minutes = timeMinutes.getMinutes()
        const seconds = timeMinutes.getSeconds()
        const string = hours.toString()+":"+minutes.toString().padStart(2,"0")+"."+seconds.toString().padStart(2,"0")
        setClock(string)
        setFullClock(timeMinutes)
    }

    useEffect(() => {
        console.log("useeffect-kello")
        if(clockState && intervalRef.current === null){
            intervalRef.current = setInterval(tick, 1000)
        }else if (!clockState && intervalRef.current !== null){
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        return () => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
    }, [clockState])
    

    
    return(<Text>{clock}</Text>)

}