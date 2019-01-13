/* eslint-disable */

export function executeSOMessagesViaFetch(jsoName, jsoParameters) {
    var bodyProperties = {
        "parameters": {},
        "parpContext": {},
        "subscriber": {
            "uniqueID": "string",
            "attributes": {},
            "labels": [
                "string"
            ],
            "externalCaseID": "string"
        },
        "user": {
            "uniqueID": "string",
            "attributes": {},
            "labels": [
                "string"
            ],
            "roles": [
                "string"
            ]
        },
        "timeoutInSeconds": 0,
        "cacheType": "none"
    };

    var fetchProperties = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': 'https://dcmcdpdemo.com/',
            'Access-Control-Allow-Credentials': 'true',
            'Authorization': 'Basic d2Vic2VydmljZXVzZXI6d2Vic2VydmljZXVzZXIx'
            // 'Auth-Type': 'Basic',
            // 'username': 'webserviceuser',
            // 'password': 'webserviceuser1'
            // 'Credentials': 'same-origin'
        },
        body: JSON.stringify(bodyProperties),
    };

    var url = 'https://dcmcdpdemo.com/configweb/rest/7.0/serviceoperations/';
    // var resultsFromFetchJSO = {};

    // Add your JSO URL here
    /* if(jsoName === 'SO_SBP_GetMessageTemplate'){ */
        url = url + 'SO_SBP_GetMessageTemplate/executions?includeDataTypes=false';
    /* } */

    return fetch(url, fetchProperties)
        .then(
            response => {
                // console.log('Prad testing 1 >> ' + response.body);
                return response.json().then(data => {
                    // console.log('Prad response >> ' + data.results.properties.resultData);
                    
                    return data;
                });
            })
        .catch(
            error => {
                console.log('Prad testing error' + error);
            });
}