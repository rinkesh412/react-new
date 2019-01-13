import React from 'react';
import { DataGrid, Label } from '@nokia-csf-uxr/csfWidgets';
import './sbp-test-target-container.styl'

export default class TestTargetProgressTable extends React.Component {

    state = {
        deleteFunc: '',
        contacts: []
    }
    constructor(props) {
        super(props);
        this.results = null;
        const columnDefs = [
            { headerName: 'Sub-number', field: 'subnumber',width: 130},
            {
                headerName: 'Operation', field: 'deleteButton',
                cellRenderer: this.cellRendererButtonDelete.bind(this),
                suppressFilter: true,
                width: 130
            },
            { headerName: 'Total Number of Terminals', field: 'totalnoterminal',width: 130 },
            { headerName: 'Total Number of target Terminals', field: 'totaltagetterminal',width: 130 },
            { headerName: 'Number of Completion', field: 'completion',width: 130 },
            { headerName: 'Date for planned to fininsh', field: 'date',width: 130 },
            { headerName: 'Progress status', field: 'status',width: 130 }
        ];
        this.rowData = [{
            id: 1,
            subnumber: '100',
            operation: this.state.deleteFunc,
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '3400',
            date: '24/08/2008',
            status: 'completed'
        },
        {
            id: 2,
            subnumber: '130',
            operation: this.state.deleteFunc,
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '400',
            date: '24/08/2008',
            status: 'completed'
        },
        {
            id: 3,
            subnumber: '130',
            operation: this.state.deleteFunc,
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '200',
            date: '24/08/2008',
            status: 'completed'
        }];
        this.gridOptions = {
            columnDefs,
            enableFilter: false,
            enableSorting: false,
            moreHeaderMenuOptions: {
                hideManageColumns: true,
                moreHeaderMenuOptions: false,
                hideResetAllColumns: true,
                hideExportToCsv: true,
                hideExportToXls: true,
                hideClearSorting: true
            }
        }
    };



    cellRendererButtonDelete(index) {

        this.state.deleteFunc = 'Delete';
        var getOperation = this.rowData.indexOf(index);
       // alert(getOperation);
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<span class="my-css-class"><button id="delete_' + getOperation + '" class="inter-btn-simple">' + this.state.deleteFunc + '</button></span>';
        var querySelId = '#delete_' + getOperation;
        //alert(querySelId);
        var eButton = eDiv.querySelector(querySelId);
        var that = this;
        eButton.addEventListener('click', this.deleteBroadcast.bind(that, getOperation));
        return eDiv;
    }

    deleteBroadcast(index) {
        this.state.contacts = [...this.rowData];
        this.state.contacts.splice(index, 1);
        this.rowData = this.state.contacts;
        console.log(this.rowData)
        console.log(this.state.contacts);
    };



    render() {
        return (
            <div>
                <div>
                    <Label id="default" text="test MSISDNSubmitProgress Check" />
                </div>
                <div style={{ height: 450, overflow: 'hidden' }}>
                    <DataGrid columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true} disableRowActions={true}
                        gridOptions={this.gridOptions}
                        rowData={this.rowData} />
                </div>
            </div>
        )
    }
}