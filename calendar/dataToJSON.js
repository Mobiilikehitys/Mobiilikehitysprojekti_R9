


export default function dataToJSON({data}) {
    let returnJSON = []
    console.log("dataToJSON:", data)
    for(r of data){
        //Syöte: resurssi, aloituspäivä, aloutusaika, lopetuspäivä, lopetusaika
        const resource = r.resurssi
        const startDate = r.aloituspaiva
        const startTime = r.aloitusaika
        const endDate = r.lopetuspaiva
        const endTime = r.lopetusaika
        const person = r.henkilo
        //Palautus: day, Resource, person, start time, end time
        console.log("Dates:", startDate, endDate)
        //jos päivärajat ylittyvät, jaetaan varaus eri päiville
        const dateList = dates(startDate, endDate)
        let oneJSON = {}       
        for(let i=0; i < dateList.length; i++){
            console.log("dateList:",i,dateList[i])
        }
        let dayAlready

        for(let i = 0; i < dateList.length; i++){

                const day = dateList[i].getDate().toString()+"."+(dateList[i].getMonth()+1).toString()+"."+dateList[i].getFullYear().toString()
                const dayInReturnJSON = returnJSON.find(reservationDay => reservationDay.Day == day)
                console.log("dayInReturnJSON:", dayInReturnJSON)
                console.log("day:",day)
                if(!dayInReturnJSON){
                oneJSON['Day'] = day
                oneJSON['Resources'] = []
                dayAlready = false

                
                }else{
                    console.log("dayAlready:", dayAlready)
                    dayAlready = true
                }
                

                if(!dayAlready){
                const resourceInResources = oneJSON['Resources'].find(resourceFind => resourceFind.Resource == resource)
                if(!resourceInResources){
                oneJSON['Resources']=[...oneJSON['Resources'], {'Resource':resource, 'Reservations':[]}] 
                }}

                

            

            

            let reservation
            if(dateList.length == 1){
                
                reservation = {
                    "Person":person,
                    "Starting time": startTime,
                    "Ending time": endTime
                }
               
            }else if(i == 0 && i != (dateList.length-1) ){
                console.log("Pitkän varauksen alku")
                reservation = {
                    "Person":person,
                    "Starting time": startTime,
                    "Ending time": "24:00"
                }
            }else if(i != dateList.length-1){
                reservation = {
                    "Person":person,
                    "Starting time": "0:00",
                    "Ending time": "24:00"
                }
                
            }else if(i == dateList.length-1){
                reservation = {
                    "Person":person,
                    "Starting time": "0:00",
                    "Ending time": endTime
                }
            }else{
                throw new Error("Problem with converting data to JSON")
            }
            
            if(!dayAlready){
            for(let c = 0; c< oneJSON['Resources'].length ; c++){
                let deepCopy = JSON.parse(JSON.stringify(reservation))
                if(oneJSON['Resources'][c]['Resource'] == resource){
                    oneJSON['Resources'][c]['Reservations'].push({...deepCopy})
                    console.log("Resurssi löytyi:", oneJSON['Resources'][c]['Reservations'])
                    break
                }
           }
           returnJSON = [...returnJSON, oneJSON]
           oneJSON = {}
            }else{
                let index1
                console.log("Päivää ei valmiina")
                for(let b = 0; b<returnJSON.length; b++){
                    if(returnJSON[b]['Day']==day){
                        console.log("Päivä löytyi")
                        index1 = b
                        break
                    }
                }
                for(let a = 0; a < returnJSON[i]['Resources'].length; a++){
                    const newReservation = {...reservation}
                    console.log("returnJSON-looppi:")
                    if(returnJSON[index1]['Resources'][a]['Resource'] == resource){
                        returnJSON[index1]['Resources'][a]['Reservations']=[...returnJSON[index1]['Resources'][a]['Reservations'], {...newReservation}]
                        console.log("returnJSON: Reservation:",reservation)
                        break
                    }
                }
                
           }

            
        
            
        }
        
        

        

    }
    console.log("returnjson:",returnJSON)
    return returnJSON
}

function dates(startDate, endDate) {
    const startSplit = startDate.split(".")
    const endSplit = endDate.split(".")
    console.log("Splits:",startSplit,endSplit)
    const start = new Date()
    const end = new Date()

    start.setDate(parseInt(startSplit[0]))
    start.setMonth(parseInt(startSplit[1])-1)
    start.setFullYear(parseInt(startSplit[2]))
    console.log("Start:",start)
    end.setDate(parseInt(endSplit[0]))
    end.setMonth(parseInt(endSplit[1])-1)
    end.setFullYear(parseInt(endSplit[2]))
    console.log("End:",end)
    let maxDays = 7
    const dayList = []
    for(let i = 0; i < maxDays; i++){
        let copyOfDate = new Date(start.getTime())
        copyOfDate.setDate(copyOfDate.getDate()+i)
        dayList.push(copyOfDate)
        if(copyOfDate.getDate() == end.getDate()){
            break
        }

    }
    return dayList


}