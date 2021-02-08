## nodeApp
   - Dependencies: mongodb (npm install mongodb)

## Objective
   - Create a web server with two endpoints:
     ### 1. /process/*
     This endpoint must accept HTTP request sent using any of the methods (GET, POST, PUT, DELETE) and respond back with a JSON describing the request. 
     To be specific the response JSON must contain the following fields
     ```
     {
        date: //ISO formatted date time when the request was received,
        method: //HTTP method used for making the request,
        headers: //HTTP headers in the request,
        path: //request path (will start with /process),
        query: //the parsed query string as key-values, if any
        body: //request body, if any
        duration: //time taken to process the request
     }
     ```
      
     ### 2. /stats/p=m
     This endpoint must return a JSON object with aggregated results from the past minutes m.
     The object should look like:
     ```
     {
        "startdate": start date from which the data is aggregated,
        "enddate": end date upto which the data is aggregated,
        "data": list of records fetched
     }
     ```
 ## Instructions
   - Get inside nodeApp.
   - Execute command: node app
   - Say, we need to check the aggregations from the past 80 minutes, paste this in a web browser: `localhost:8000/stats/p=80`
