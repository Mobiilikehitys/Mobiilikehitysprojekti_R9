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

export default getNextDays