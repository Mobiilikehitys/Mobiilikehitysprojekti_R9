const testResources = [
        "Pyykkikone 1", "Pyykkikone 2"
    ]


    const testReservations = [
        {
            "Day":"29.3.2025",
            "Resources": [
                {   "Resource": "Pyykkikone 1",
                    "Reservations":[
                        {   
                            "Person":"AP",
                            "Starting time": "12:00",
                            "Ending time": "22:00"
                            
                        }
                    ]
                    

                }
            ]
        },
        {
            "Day":"28.3.2025",
            "Resources": [
                {   "Resource": "Pyykkikone 2",
                    "Reservations":[
                        {   
                            "Person":"AP",
                            "Starting time": "11.00",
                            "Ending time": "14.00"
                            
                        }
                    ]
                    

                }
            ]
        },
        
    ]

export {testResources, testReservations}