const getNextDays = () => {
    const dayList = []
    const today= new Date()
    for(let i = 0; i < 30; i++){
        const day = new Date(today)
        day.setDate(today.getDate() + i)
        let weekDay
        switch (day.getDay()){
            case 0:
                weekDay = "Su"
                break
            case 1:
                weekDay = "Ma"
                break
            case 2:
                weekDay = "Ti"
                break
            case 3:
                weekDay = "Ke"
                break
            case 4:
                weekDay = "To"
                break
            case 5:
                weekDay = "Pe"
                break
            case 6:
                weekDay = "La"
        }
        const dayString = weekDay + " " + day.getDate().toString()+"."+(day.getMonth() +1).toString()+"."
        const reservationDay = day.getDate().toString()+"."+(day.getMonth() +1).toString()+"."+day.getFullYear()
        dayList.push(
            {"dayHeader":dayString, "dayReservation":reservationDay})
    }
    return dayList
}

const weekDayNumber = (weekday) => {
    switch(weekday){
        case "Su":
            return 0
            break
        case "Ma":
            return 1
            break
        case "Ti":
            return 2
            break
        case "Ke":
            return 3
            break
        case "To":
            return 4
            break
        case "Pe":
            return 5
            break
        case "La":
            return 6
            break
        default:
            throw new Error("Weekday error on weekDayNumber")
            break
    }
}

export {getNextDays, weekDayNumber}