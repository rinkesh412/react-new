import React, { Component } from 'react';
import { Button, Label } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from '../../../services/i18n-label-service';
import './fum-reserved-list.styl';
//import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';
import { AgGridReact } from 'ag-grid-react';
import {getViewResultsData } from  '../../../services/fota-um-hardcoded-data.service';


var listOfMISSDNNum = [ '9011112219', '9011112220', '9011112221', '9011112222', '9011112223', '9011112224', '9011112225', '9011112226', '9011112227', '9011112228', '9011112229', '9011112230', '9011112231', '9011112232', '9011112233', '9011112234', '9011112235', '9011112236', '9011112237', '9011112238', '9011112239', '9011112240' ];
var listOfMSISDNLen = 0;
var rowLen = Math.round(listOfMSISDNLen/columnLen);  
var createTextArea = '';
var columnLen = "7";
var cell = '';
var createSpan ='';
export class FUMUploadReservedList extends Component {
    constructor(props) {
        super(props); 
        
        let columnDefs= [
            {
                headerName: 'Corporate code', field: 'corporateCode', lockPosition: true, width: 50, suppressMenu: true, cellStyle: () => ({ border: '.5px solid black', backgroundColor: 'white' })
            },
            {
                headerName: 'Model', lockPosition: true, width: 50, suppressMenu: true,  
                cellStyle: () => ({ border: '.5px solid black', backgroundColor: 'white' }),
                cellRenderer: this.cellRendererCRVersionSessionId.bind(this)
  
            },
            {
                headerName: 'CR Version',
                marryChildren: true, width: 100,
                children: [
                    { headerName: 'Session ID', lockPosition: true, width: 100, suppressSizeToFit: true, cellStyle: function (params) {
                        return { border: '.5px solid black', backgroundColor: 'white' };
                    },
                    cellRenderer: this.cellRendererCRVersionSessionId.bind(this)
                },
  
  
                ],
                lockPosition: true, width: 100, suppressMenu: true, cellStyle: function (params) {
                    return { border: '.5px solid black', backgroundColor: 'white' };
                },
                
            },
            {
                headerName: 'MSISDN',
                marryChildren: true, width: 100,
                children: [
                    { headerName: 'IMEI',  lockPosition: true, width: 100, editable: true, 
                    cellStyle: function (params) {
                        return { boxSizing: 'border-box', border: '.5px solid black', backgroundColor: 'white' };
                    },  
                    cellRenderer: this.cellRendererIMEI_MSISDN.bind(this)
                    
                },
  
                ],
            },
            {
                headerName: 'Result Date', field: 'resultDate', width: 50, suppressMenu: true, cellStyle: function (params) {
                    return { borderRight: '.5px solid black', borderTop: '.5px solid black', borderBottom: '.5px solid black', backgroundColor: 'white' };
                }
            },
            {
                headerName: 'Result Type', field: 'resultType', width: 50, suppressMenu: true, cellStyle: function (params) {
                    return { border: '.5px solid black', backgroundColor: 'white' };
                }
            },
            {
                headerName: 'Result', field: 'result', width: 50, suppressMenu: true, cellStyle: function (params) {
                    return { border: '.5px solid black', backgroundColor: 'white' };
                }
            },
  
        ];

        this.gridOptions = {
            columnDefs,
            rowHeight:50          
        }

        this.state={
            fotaUMUploadSMSSelectOneMSISDN: formatI18N('dsp_fotaUM_upld_whitelst_sms_test_Label_select-MSISDN'),
            fotaUMUploadSMSTest: formatI18N('dsp_fotaUM_upld-whitelst_sms-test_button_Push_SMS'),
            rowData: getViewResultsData(),
            
        }; 
    }
    executeServiceOperationAdapter(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.jsoCalled= jsoName;

        if (this.state.localDev) {
            console.log('Calling JSO - using Fetch');
            this.executeLocalDevSOTestMessages(jsoName, jsoParams);
        } else {
            console.log('Calling JSO - using Servi');
            this.props.executeServiceOperation(jsoName, jsoParams);
        }

    }
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName,  jsoParams).then(data => {
            console.log('Here');
            // this.props.pollingResponse = data;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }

    showUploadSMSResultTable() {
        document.getElementById("fotaUMWhitelistSmsLabel").style.display= 'block';
        var table= document.getElementById('fotaUMPushTstTble');
        listOfMSISDNLen = listOfMISSDNNum.length;
        var rowLen = Math.round(listOfMSISDNLen/columnLen);  
        for (let i=0; i<rowLen; i++) {
            var row = table.insertRow(i);     
            for (let j=0; j<columnLen;j++) {  
                cell = row.insertCell(j);
                createSpan = document.createElement('span');
                createSpan.setAttribute('class', 'fotaUMborderBox');
                var createRadioButton = document.createElement('input');
                createRadioButton.setAttribute('type', 'radio');
                createRadioButton.setAttribute('name', 'pushSMS');
                createRadioButton.onclick = function dynamicTableCreation() {
                    var parentNode = event.target.parentNode;
                    var grantParent = parentNode.parentNode;
                  //  var tableBody = document.getElementById('fotaUMPushResultTableBody');
                   /* for (let i=0; i<2; i++) {
                         var row = tableBody.insertRow(i);     
                        for (let j=0; j<columnLen;j++) {  
                         var cell = row.insertCell(j);
                        }
                    }*/
                   
                }
                createSpan.appendChild(createRadioButton);
                createTextArea = document.createElement('span');
                createTextArea.setAttribute('class', 'fotaUMPushNum'); 
                cell.appendChild(createSpan);
                cell.appendChild(createTextArea);   
            }       
        }  
        for(let k=0; k<listOfMSISDNLen;k++){
            document.getElementsByClassName('fotaUMPushNum')[k].innerText = listOfMISSDNNum[k];
        }
    }
    cellRendererCRVersionSessionId(params){
        var eDiv = document.createElement('div');
        let dataForTable = '<div class="my-css-class">' + params.data.sessionId + '</div>';
        dataForTable = dataForTable +  '<div class="inter-btn-simple">' + params.data.crversion + '</div>';
        eDiv.innerHTML = dataForTable;
        return eDiv;
    }
    cellRendererIMEI_MSISDN(params) {
        var eDiv = document.createElement('div');
        let dataForTable = '<div class="my-css-class">' + params.data.msisdn + '</div>';
        dataForTable = dataForTable +  '<div class="inter-btn-simple">' + params.data.imei + '</div>';
        eDiv.innerHTML = dataForTable;
        return eDiv;
    }

    cellRendererModelData(params) {
        var eDiv = document.createElement('div');
        let dataForTable = '<div class="my-css-class">' + params.data.sessionId + '</div>';
        dataForTable = dataForTable +  '<div class="inter-btn-simple">' + params.data.crversion + '</div>';
        eDiv.innerHTML = dataForTable;
        return eDiv;
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridApi.sizeColumnsToFit();
    };
    render() {
        return (
            <div className="fotaUMWhitelistSmsTest">     
                <Button onClick={this.showUploadSMSResultTable} text="SEARCH" id="fotoUMPushResultBtn" />
                <Label id="fotaUMWhitelistSmsLabel" text={this.state.fotaUMUploadSMSSelectOneMSISDN}></Label>
                <table className="table fotaUMPushTestTable" id="fotaUMPushTstTble" />
                <table id="fotaUMPushResultTable" className="fotaUMPushResultTbl">
                    <tbody id="fotaUMPushResultTableBody">
                    </tbody>             
                </table>
                <div style={{ height: 350, padding: 30, overflow: 'hidden' }} >
                    <AgGridReact 
                        rowData={this.state.rowData} onGridReady={this.onGridReady} gridOptions={this.gridOptions} id="my-datagrid-id"
                    />
                </div>
                <Button id="fotaUMUploadSMSTestBtn" class="fotaUMUpldSMSTestBtn" text={this.state.fotaUMUploadSMSTest}></Button>
            </div>
        );
    }
}