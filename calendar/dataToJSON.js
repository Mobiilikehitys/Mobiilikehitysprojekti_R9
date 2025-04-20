


export default function dataToJSON({data}) {
    let returnJSON = []
    for(r of data){
        //Syöte: resurssi, aloituspäivä, aloutusaika, lopetuspäivä, lopetusaika
        const resource = r.resurssi
        const startDate = r.aloituspaiva
        const startTime = r.aloitusaika
        const endDate = r.lopetuspaiva
        const endTime = r.lopetusaika
        const person = r.henkilo
        //Palautus: day, Resource, person, start time, end time
        //jos päivärajat ylittyvät, jaetaan varaus eri päiville
        const dateList = dates(startDate, endDate)
        let oneJSON = {}       
        for(let i=0; i < dateList.length; i++){
        }
        let dayAlready

        for(let i = 0; i < dateList.length; i++){

                const day = dateList[i].getDate().toString()+"."+(dateList[i].getMonth()+1).toString()+"."+dateList[i].getFullYear().toString()
                const dayInReturnJSON = returnJSON.find(reservationDay => reservationDay.Day == day)
                if(!dayInReturnJSON){
                oneJSON['Day'] = day
                oneJSON['Resources'] = []
                dayAlready = false

                
                }else{
                    dayAlready = true
                }
                

                if(!dayAlready){
                const resourceInResources = oneJSON['Resources'].find(resourceFind => resourceFind.Resource == resource)
                if(!resourceInResources){
                oneJSON['Resources']=[...oneJSON['Resources'], {'Resource':resource, 'Reservations':[]}] 
                }}

                

            

            

            let reservation
            let endTime0 = false
            if(dateList.length == 1){
                
                reservation = {
                    "Person":person,
                    "Starting time": startTime,
                    "Ending time": endTime
                }
               
            }else if(i == 0 && i != (dateList.length-1) ){
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
                if(endTime != "0:00"){
                    reservation = {
                        "Person":person,
                        "Starting time": "0:00",
                        "Ending time": endTime
                    }
                }else{
                    endTime0 = true
                }
                
            }else{
                throw new Error("Problem with converting data to JSON")
            }
            
            if(!dayAlready && endTime0 == false){
            for(let c = 0; c< oneJSON['Resources'].length ; c++){
                let deepCopy = JSON.parse(JSON.stringify(reservation))
                if(oneJSON['Resources'][c]['Resource'] == resource){
                    oneJSON['Resources'][c]['Reservations'].push({...deepCopy})
                    break
                }
           }
           returnJSON = [...returnJSON, oneJSON]
           oneJSON = {}
            }else if(endTime0 == false){
                let index1
                for(let b = 0; b<returnJSON.length; b++){
                    if(returnJSON[b]['Day']==day){
                        index1 = b
                        break
                    }
                }
                for(let a = 0; a < returnJSON[i]['Resources'].length; a++){
                    const newReservation = {...reservation}
                    if(returnJSON[index1]['Resources'][a]['Resource'] == resource){
                        returnJSON[index1]['Resources'][a]['Reservations']=[...returnJSON[index1]['Resources'][a]['Reservations'], {...newReservation}]
                        break
                    }
                }
                
           }

            
        
            
        }
        
        

        

    }
    return returnJSON
}

function dates(startDate, endDate) {
    const startSplit = startDate.split(".")
    const endSplit = endDate.split(".")
    const start = new Date()
    const end = new Date()

    start.setDate(parseInt(startSplit[0]))
    start.setMonth(parseInt(startSplit[1])-1)
    start.setFullYear(parseInt(startSplit[2]))
    end.setDate(parseInt(endSplit[0]))
    end.setMonth(parseInt(endSplit[1])-1)
    end.setFullYear(parseInt(endSplit[2]))
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