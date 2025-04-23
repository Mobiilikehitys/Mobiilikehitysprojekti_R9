import { addDoc, collection, firestore, onSnapshot, RESERVATIONS, auth } from "../firebase/Config";
import { useState } from "react";
import useData from "./useData";
import dataToJSON from "./dataToJSON";
import timeToMinutes from "./timeToMinutes";
import { newNotification } from "./Notifications/Notifications";
import { dayJSON, hourJSON } from "./handleResources";

export default function reservation({data,data2, reserSuccess, setReserSuccess,resource, person, startDate, clockStart, endDate, clockEnd}){
    
    const startDateString = startDate.getDate().toString()+"."+(startDate.getMonth()+1).toString()+"."+startDate.getFullYear().toString()
    const endDateString = endDate.getDate().toString()+"."+(startDate.getMonth()+1).toString()+"."+endDate.getFullYear().toString()
    const startTimeString = clockStart.getHours().toString()+":"+ clockStart.getMinutes().toString().padStart(2, "0")
    const endTimeString = clockEnd.getHours().toString()+":"+ clockEnd.getMinutes().toString().padStart(2, "0")
    

    let dataJSON = []
    try{
    
    
    if(data.length != 0){
        dataJSON = dataToJSON({data})
    }
    }catch(error){
        console.error("CalendarModal-dataJSON:",error)
    }
    

    const timeTest1 = checkCurrentTime(startDate, clockStart)
    if(!timeTest1){
        setReserSuccess("Aloitusaika ennen nykyhetkeä")
        return
    }

    const timeTest2 = checkTimes(startDate, clockStart, endDate, clockEnd)
    if(!timeTest2){
        setReserSuccess("Aloitusaika lopetusajan jälkeen")
        return
    }

    const timeCollasionTest = checkOldReservations(dataJSON, resource, startDate, clockStart, endDate, clockEnd)
    if(!timeCollasionTest){
        setReserSuccess("Varaus menee muiden varausten kanssa päällekkäin")
        return
    }

    const allowedDayTest = checkAllowedDay(startDate, endDate, data2, resource)
    if(!allowedDayTest){
        setReserSuccess("Varaus kiellettynä päivänä")
        return
    }
    const allowedClocktimeTest = checkAllowedClock(startDate, clockStart, endDate, clockEnd, data2, resource)
    if(!allowedClocktimeTest){
        setReserSuccess("Varaus kiellettynä kellonaikana")
        return
    }

    const save = async () => {
    console.log("Save aloitettu")
    console.log("Save-resurssi:", resource)
    const docRef = await addDoc(collection(firestore, RESERVATIONS), {
        
        henkilo: person,
        resurssi: resource,
        aloituspaiva: startDateString,
        aloitusaika:  startTimeString,
        lopetuspaiva: endDateString,
        lopetusaika: endTimeString,
    })}

        try{
            save()
        }catch(error){
            console.log("Reservation save error:",error)
        }
        
        noteTime = new Date()
        noteTime.setDate(startDate.getDate())
        noteTime.setMonth(startDate.getMonth())
        noteTime.setFullYear(startDate.getFullYear())
        noteTime.setHours(clockStart.getHours())
        noteTime.setMinutes(clockStart.getMinutes())

        endTime = new Date()
        endTime.setDate(endDate.getDate())
        endTime.setMonth(endDate.getMonth())
        endTime.setFullYear(endDate.getFullYear())
        endTime.setHours(clockEnd.getHours())
        endTime.setMinutes(clockEnd.getMinutes())
        newNotification(person,resource, noteTime, startTimeString, endTimeString)
        setReserSuccess("Varaus onnistui")

    
    
}

function checkOldReservations (dataJSON, resource, startDate, clockStart, endDate, clockEnd) {
    const startComplete = new Date()
    startComplete.setDate(startDate.getDate())
    startComplete.setMonth(startDate.getMonth())
    startComplete.setFullYear(startDate.getFullYear())
    startComplete.setHours(clockStart.getHours())
    startComplete.setMinutes(clockStart.getMinutes())

    const endComplete = new Date()
    endComplete.setDate(endDate.getDate())
    endComplete.setMonth(endDate.getMonth())
    endComplete.setFullYear(endDate.getFullYear())
    endComplete.setHours(clockEnd.getHours())
    endComplete.setMinutes(clockEnd.getMinutes())

    const maxDays = 7
    const dateList = []
    let dayIteration = new Date()
    for(let a = 0; a < maxDays; a++){
        dayIteration.setDate(startComplete.getDate() + a)
        dateList.push(dayIteration)
        if(dayIteration.getDate() == endComplete.getDate()){
            break
        }
    }

    for(day of dateList){
        const dayDate = day
        const dayString = day.getDate().toString()+"."+(day.getMonth()+1).toString()+"."+day.getFullYear()
        const dayFind = dataJSON.find(reservationDay => reservationDay.Day == dayString)
        if(dayFind){
            const resourcesOfDay = dayFind['Resources']
            const resourceFind = resourcesOfDay.find(Resources => Resources.Resource == resource)
            if(resourceFind){
                const reservations = resourceFind['Reservations']
                for(res of reservations){
                    const start = res['Starting time'].split(":")
                    const startToDate = new Date()
                    startToDate.setDate(day.getDate())
                    startToDate.setMonth(day.getMonth())
                    startToDate.setHours(parseInt(start[0]))
                    startToDate.setMinutes(parseInt(start[1]))

                    const end = res['Ending time'].split(":")
                    const endToDate = new Date()
                    endToDate.setDate(day.getDate())
                    endToDate.setMonth(day.getMonth())
                    endToDate.setHours(parseInt(end[0]))
                    endToDate.setMinutes(parseInt(end[1]))

                    if(!(startComplete.getTime() > endToDate.getTime() || endComplete.getTime() < startToDate.getTime())){
                        return false
                    }

                }
            }
            

        }
    }
    

    return true
    


}

function checkTimes (startDate, startTime, endDate, endTime){
    const startDateTime = startDate.getTime()
    const endDateTime = endDate.getTime()
    const startDate2 = startDate.getDate()
    const endDate2 = endDate.getDate()
    if(startDateTime > endDateTime && startDate2 != endDate2){
        return false
    }
    const startTimeMinutes=startTime.getHours()*60+startTime.getMinutes()
    const endTimeMinutes=endTime.getHours()*60+endTime.getMinutes()
    if(startDate2 == endDate2 && startTimeMinutes > endTimeMinutes){
        return false
    }
    return true

}

function checkCurrentTime(startDate, startTime){
    const today = new Date()
    const todayTime = today.getTime()
    const startDateTime = startDate.getTime()

    const todayDate = today.getDate()
    const startDate2 = startDate.getDate()

    if(todayTime > startDateTime && todayDate != startDate2){
        return false
    }
    const startTimeMinutes = startTime.getHours()*60+startTime.getMinutes()
    const nowTimeMinutes =today.getHours()*60+today.getMinutes()
    if(todayDate == startDate2 && nowTimeMinutes > startTimeMinutes){
        return false
    }
    return true

}

function checkAllowedDay (startDate, endDate, data, resource){
    const dayJSON2 = dayJSON(data)[resource]
    const falseList = []
    for(let a = 0; a < 7; a++){
        if(dayJSON2[a.toString()] == false){
            falseList.push(a)
        }
    }
    if(falseList.length == 0){
        return true
    }else{
        for(let a = 0; a <7; a++){
            const weekday = startDate.getDay()
            if(falseList.includes(weekday)){
                return false
            }
            if(weekday == endDate.getDay()){
                break
            }
            startDate.setDate(startDate.getDate()+1)
        }
        return true
    }

    
}

function checkAllowedClock (startDate, clockStart, endDate, clockEnd, data, resource){

    const clockJSON = hourJSON(data)[resource]

    if(clockJSON['Alku'] == "00:00" && clockJSON['Loppu'] == "24:00"){
        return true
    }else if(clockJSON['Alku'] == clockJSON['Loppu']){
        return true
    }
    const start = startDate
    start.setHours(clockStart.getHours())
    start.setMinutes(clockStart.getMinutes())

    const end = endDate
    end.setHours(clockEnd.getHours())
    end.setMinutes(clockEnd.getMinutes())

    
    const rajaAlku =clockJSON['Alku'].split(":")
    const rajaLoppu=clockJSON['Loppu'].split(":")
    
    const limitStart = new Date(startDate)
    limitStart.setHours(parseInt(rajaAlku[0]))
    limitStart.setMinutes(parseInt(rajaAlku[1]))

    const limitEnd = new Date()
    limitEnd.setHours(parseInt(rajaLoppu[0]))
    limitEnd.setMinutes(parseInt(rajaLoppu[1]))
    if(limitEnd.getTime() < limitStart.getTime()){
        limitEnd.setDate(limitEnd.getDate() + 1)
    }

    if(limitStart.getTime() > start.getTime() || limitEnd.getTime() < end.getTime()){
        return false
    }

    return true
    

    

}
