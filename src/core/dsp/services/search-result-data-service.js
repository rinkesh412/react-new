export function getSearchResultItems(sourcePage) {

    var hardCodedDataSingle = [ {
        'modl': 'so 702is RAC1',
        'archiveFileName': 'SoModelSubb001_d.jar',
        'tac': '12345678',
        'crver': '1',
        'mode': 'prepare',
        'date-publish': '2009/07/21 12:00:30',
        'date-stop-publish': '2012/07/20 23:59:30'
    }];
    var hardCodedDataMultiple = [ {
        'modl': 'so 702is RAC1',
        'archiveFileName': 'SoModelSubb001_d.jar',
        'tac': '12345678',
        'crver': '1',
        'mode': 'prepare',
        'date-publish': '2009/07/21 12:00:30',
        'date-stop-publish': '2012/07/20 23:59:30'
    },
    {
        'modl': 'so 702is RAC1',
        'archiveFileName': 'SoModelSubb001_d.jar',
        'tac': '12345678',
        'crver': '1',
        'mode': 'prepare',
        'date-publish': '2009/07/21 12:00:30',
        'date-stop-publish': '2012/07/20 23:59:30'
    },
    {
        'modl': 'so 702is RAC1',
        'archiveFileName': 'SoModelSubb001_d.jar',
        'tac': '12345678',
        'crver': '1',
        'mode': 'prepare',
        'date-publish': '2009/07/21 12:00:30',
        'date-stop-publish': '2012/07/20 23:59:30'
    },
    {
        'modl': 'so 702is RAC1',
        'archiveFileName': 'SoModelSubb001_d.jar',
        'tac': '12345678',
        'crver': '1',
        'mode': 'prepare',
        'date-publish': '2009/07/21 12:00:30',
        'date-stop-publish': '2012/07/20 23:59:30'
    }]
    if (sourcePage === 'resultPage') {
        return hardCodedDataMultiple;
    } else {
        return hardCodedDataSingle;
    }
}