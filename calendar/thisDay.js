import timeToMinutes from "./timeToMinutes"

function thisDay () {
    const today = new Date()
    const dayString = today.getDate().toString()+"."+(today.getMonth() +1).toString()+"."+today.getFullYear() 
    return dayString
}

function thisDayByMinutes () {
    const today = new Date()
    const clock = today.getHours().toString()+ ":"+today.getMinutes().toString()
    console.log("Clock", clock)
    return timeToMinutes(clock)
}

export {thisDay, thisDayByMinutes}