export const convertFirebaseTimeStampJS = (timeStamp) => {
    if( timeStamp !== null && timeStamp !== undefined){
        const firebaseTime = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)
        const result =
        firebaseTime.getDate() + '.' +
        (firebaseTime.getMonth() +1) + '.'+
        firebaseTime.getFullYear() + ' '+
        firebaseTime.getHours() + '.'+
        String(firebaseTime.getMinutes()).padStart(2, '0') + '.'+
        String(firebaseTime.getSeconds()).padStart(2, '0')
        return result
    }else{
        return ''
    }
}