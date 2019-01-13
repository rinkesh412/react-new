import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DataGrid, Button, TextInput, Label, CheckBox, CalendarNew } from '@nokia-csf-uxr/csfWidgets';
import AutoComplete from '../../../components/model-name-autocomplete/model-name-autocomplete';
import { formatI18N } from '../../../services/i18n-label-service';
import { getSearchResultItems } from '../../../services/search-result-data-service';
export default class FumSearchResultOp extends Component {
    
    constructor(props) {
        super(props);
        this.onGridReady = this.onGridReady.bind(this);
        this.state = {
            searchResultData: []
        };
        let columnDefs = [
            { headerName: 'Modl', field: 'modl', width: 120, suppressFilter: true },
            { headerName: 'Archive File Name', field: 'archiveFileName', width: 120, suppressFilter: true },
            { headerName: 'TAC', field: 'tac', width: 60, suppressFilter: true },
            { headerName: 'CRVer', field: 'crver', width: 60, suppressFilter: true },
            { headerName: 'Mode', field: 'mode', width: 60, suppressFilter: true },
            { headerName: 'Date of Publish', field: 'date-publish', width: 120, suppressFilter: true },
            { headerName: 'Date of Stop Publish', field: 'date-stop-publish', width: 120, suppressFilter: true },
            { headerName: '', field: 'detail', cellRenderer: this.cellRendererLinkDetail.bind(this),
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
    cellRendererLinkDetail(params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<span class="my-css-class" ><button id="' + params.data.id + '" class="restart-btn-simple">'+"Detail"+'</button></span>';
        var eButton = eDiv.querySelectorAll('.restart-btn-simple')[0];
        var that = this;
        eButton.addEventListener('click', function addListener() {
            console.log('Detail button was clicked!!');
            that.props.nextModeChange("mode-select");
            // document.getElementById('testingSection').innerHTML = 'Restart clicked for ' + this.id;
        });
        return eDiv;
    }
    componentDidMount() {
        this.setState({ searchResultData: getSearchResultItems('resultPage')});
    }
    render() {
        return( 
            <div id="search-result-id " style={{ height: 300 }}>
                  <DataGrid columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true}
                      disableRowActions={true} onGridReady={this.onGridReady} gridOptions={this.gridOptions}
                      rowData={this.state.searchResultData}
                  />
            </div>
        )
    }
}
FumSearchResultOp.propTypes = {
    nextModeChange: PropTypes.func.isRequired,  
}