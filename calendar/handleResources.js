


function resourceList(data){
    const resList = []
    for(d of data){
        resList.push(d.name)
    }
    return resList
}

function dayJSON(data){
    const JSON = {}
    for(d of data){
        JSON[d.name]={}
        JSON[d.name]["1"]=d['enabledWeekdays']['Monday']
        JSON[d.name]["2"]=d['enabledWeekdays']['Tuesday']
        JSON[d.name]["3"]=d['enabledWeekdays']['Wednesday']
        JSON[d.name]["4"]=d['enabledWeekdays']['Thursday']
        JSON[d.name]["5"]=d['enabledWeekdays']['Friday']
        JSON[d.name]["6"]=d['enabledWeekdays']['Saturday']
        JSON[d.name]["0"]=d['enabledWeekdays']['Sunday']
    }
    return JSON
}

function hourJSON(data){
    const JSON = {}
    for(d of data){
        JSON[d.name]={}
        JSON[d.name]["Alku"]=d['enabledHoursStart']
        JSON[d.name]["Loppu"]=d['enabledHoursEnd']
    }
    return JSON
}


export{resourceList, dayJSON, hourJSON}