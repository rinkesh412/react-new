import React, { Component } from 'react';
import { DataGrid, Button, TextInput, Label, CheckBox, CalendarNew } from '@nokia-csf-uxr/csfWidgets';
import AutoComplete from '../../../../components/model-name-autocomplete/model-name-autocomplete';
import { formatI18N } from '../../../../services/i18n-label-service';
import { getSearchResultItems } from '../../../../services/search-result-data-service';

export default class FumModeChangeOp extends Component {
    cellRendererLinkDetail(params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<span class="my-css-class" ><button id="' + params.data.id + '" class="restart-btn-simple">'+"Mode Change"+'</button></span>';
        var eButton = eDiv.querySelectorAll('.restart-btn-simple')[0];
        var that = this;
        eButton.addEventListener('click', function addListener() {
            console.log('Detail button was clicked!!');
            // document.getElementById('testingSection').innerHTML = 'Restart clicked for ' + this.id;
        });
        return eDiv;
    }
    constructor(props) {
        super(props);
        this.onGridReady = this.onGridReady.bind(this);
        this.state = {
            selectedResultData: []
        };
        let columnDefs = [
            { headerName: 'Modl', field: 'modl', width: 120, suppressFilter: true },
            { headerName: 'CRVer', field: 'crver', width: 60, suppressFilter: true },
            { headerName: 'Archive File Name', field: 'archiveFileName', width: 120, suppressFilter: true },
            { headerName: 'Mode', field: 'mode', width: 60, suppressFilter: true },
            { headerName: '', field: 'change', cellRenderer: this.cellRendererLinkDetail.bind(this),
            width: 80, suppressFilter: true }
        ];
        this.gridOptions = {
            columnDefs
        };
    }
    onGridReady = params => {
        this.api = params.value.api;
        this.api.sizeColumnsToFit();
    }
    componentDidMount() {
        this.setState({ selectedResultData: getSearchResultItems('detailPage')});
    }
    render() {
        return( 
            <div id="search-result-id " style={{ height: 90 }}>
                  <DataGrid columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true}
                      disableRowActions={true} onGridReady={this.onGridReady} gridOptions={this.gridOptions}
                      rowData={this.state.selectedResultData}
                  />
            </div>
        )
    }
}