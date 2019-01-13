export function getBlacklistSetupData() {

    /* var fetchProperties = {
        method: 'GET'
    }; */

    var hardCodedData = {
        'irregularData': [
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '2',
                'startMin': 20
            },
            {
                'endHour': 11,
                'endMin': 50,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '3',
                'startMin': 40
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '4',
                'startMin': 30
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '5',
                'startMin': 30
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '6',
                'startMin': 20
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '7',
                'startMin': 20
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '8',
                'startMin': 20
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '9',
                'startMin': 20
            },
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '10',
                'startMin': 20
            },
            {
                'endHour': 11,
                'endMin': 45,
                'isRegular': false,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 4,
                'id': '11',
                'startMin': 25
            }
        ],
        'regularData': [
            {
                'endHour': 11,
                'endMin': 40,
                'isRegular': true,
                'dateForIrregular': '2018-03-02',
                'startHour': 9,
                'weekNoForRegular': 5,
                'weekDayForIrregular': 2,
                'id': '1',
                'startMin': 20
            }
        ]
    };

    // Mock URL -  May change. change accordingly.
    // Will be replaced with URL of JSO later
    // return fetch('http://demo1194161.mockable.io/getData', fetchProperties)
    // .then(response => response.json());
    return hardCodedData;

}

export function getViewResultsData() {

    /* var fetchProperties = {
        method: 'GET'
    }; */

    var hardCodedData =
       [
           {
               'corporateCode': 'C01',
               'model': 'Samsung',
               'modelName': 'ABC 200',
               'subModel': 'V2',
               'sessionId': '11111',
               'crversion': 'CR111',
               'imei': '12345678901234',
               'msisdn': '1234567890',
               'resultDate': '02-03-2019',
               'resultType': 'OK',
               'result': 'NG200'
           },
           {
               'corporateCode': 'C02',
               'model': 'LG Super',
               'modelName': 'XYX 300',
               'subModel': 'X5',
               'sessionId': '22222',
               'crversion': 'CR222',
               'imei': '66666678901234',
               'msisdn': '6789567890',
               'resultDate': '12-23-2019',
               'resultType': 'OK',
               'result': 'NG100'
           },
           {
               'corporateCode': 'C03',
               'model': 'Nokia Super',
               'modelName': 'XYX 300',
               'subModel': 'X5',
               'sessionId': '22222',
               'crversion': 'CR222',
               'imei': '66666678901234',
               'msisdn': '6789567890',
               'resultDate': '12-23-2019',
               'resultType': 'NOT OK',
               'result': 'NG100'
           }


       ];


    // Mock URL -  May change. change accordingly.
    // Will be replaced with URL of JSO later
    // return fetch('http://demo1194161.mockable.io/getData', fetchProperties)
    // .then(response => response.json());
    return hardCodedData;

}