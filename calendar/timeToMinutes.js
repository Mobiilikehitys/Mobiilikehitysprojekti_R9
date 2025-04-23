
export default function timeToMinutes (clocktime){
    const split = clocktime.split(":")
    const hourString = split[0]
    const minuteString = split[1]
    const minutes = parseInt(hourString)*60+parseInt(minuteString)
    return minutes
}