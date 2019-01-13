export function getBroadcastItems(sourcePage) {

    /* var fetchProperties = {
        method: 'GET'
    }; */

    var hardCodedDataSingle = [ {
        'id': 1,
        'modelName': '11-XXX',
        'registeredDate': '2018/05/02',
        'registeredPerson': 'Taro Suzuki',
        'comment': 'xxxxxxxxxx',
        'date': '24/08/2008',
        'pushStatus': 'Interruption',
        'cautionText': 'Please update the software urgently'
    }
    ];

    var hardCodedData = [ {
        'allowInODBUser': 'false',
        'allowInROUser': 'true',
        'allowUsersBlockingSpams': 'true',
        'blacklists': {},
        'description': 'dhjkid',
        'endTime': '2018-12-19 15:23:18',
        'id': '113',
        'inserted': '2018-12-18 09:53:51',
        'message': 'jskjsj edited',
        'messageTitle': 'dkjksjl',
        'modelName': 'SH01K',
        'retryCount': '1',
        'startTime': '2018-12-18 15:23:18',
        'status': 'SCHEDULED',
        'updated': '2018-12-18 09:53:51',
        'username': 'portaluser',
        'whitelists': {}
    },
    {
        'allowInODBUser': 'false',
        'allowInROUser': 'true',
        'allowUsersBlockingSpams': 'false',
        'blacklists': {},
        'description': 'aaaa',
        'endTime': '2018-12-19 15:23:18',
        'id': '111',
        'inserted': '2018-12-18 09:53:51',
        'message': 'aaaa edited',
        'messageTitle': 'aaaa',
        'modelName': 'SH02K',
        'retryCount': '1',
        'startTime': '2018-12-18 15:23:18',
        'status': 'SCHEDULED',
        'updated': '2018-12-18 09:53:51',
        'username': 'portaluser',
        'whitelists': {}
    } ];
    // Mock URL -  May change. change accordingly.
    // Will be replaced with URL of JSO later
    // return fetch('http://demo1194161.mockable.io/getData', fetchProperties)
    // .then(response => response.json());
    if (sourcePage === 'manageBroadcast') {
        return hardCodedData;
    } else {
        return hardCodedDataSingle;
    }

}