import React from 'react';
import { DataGrid, Label } from '@nokia-csf-uxr/csfWidgets';
import './sbp-test-target-container.styl'

export default class TestTargetProgressTable extends React.Component {
    state = {
        dialog: false,
        deleteBtn: "Delete"
    }

    cellRendererButtonDelete(params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<span class="my-css-class"><button id="delete_' + params.data.id + '" class="inter-btn-simple">' + this.state.deleteBtn + '</button></span>';
        var querySelId = '#delete_' + params.data.id;
        var eButton = eDiv.querySelector(querySelId);
        var that = this;
        eButton.addEventListener('click', this.deleteBroadcast.bind(that, params.data.id));
        return eDiv;
    }

    deleteBroadcast(broadcastId) {
        console.log('Ready to delete ' + broadcastId);


    }

    constructor(props) {
        super(props);
        this.results = null;
        const columnDefs = [
            { headerName: 'Sub-number', field: 'subnumber' },
            {
                headerName: 'Operation', field: 'deleteButton',
                cellRenderer: this.cellRendererButtonDelete.bind(this),
                suppressFilter: true
            },
            { headerName: 'Total Number of Terminals', field: 'totalnoterminal' },
            { headerName: 'Total Number of target Terminals', field: 'totaltagetterminal' },
            { headerName: 'Number of Completion', field: 'completion' },
            { headerName: 'Date for planned to fininsh', field: 'date' },
            { headerName: 'Progress status', field: 'status' }
        ];
        this.rowData = [{
            subnumber: '100',
            operation: "DELETE",
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '3400',
            date: '24/08/2008',
            status: 'completed'
        },
        {
            subnumber: '130',
            operation: "DELETE",
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '400',
            date: '24/08/2008',
            status: 'completed'
        },
        {
            subnumber: '130',
            operation: "DELETE",
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '200',
            date: '24/08/2008',
            status: 'completed'
        }];
        this.gridOptions = {
            columnDefs,
            enableFilter: true,
            enableSorting: true,
            moreHeaderMenuOptions: {
                hideManageColumns: true,
                moreHeaderMenuOptions: true,
                hideResetAllColumns: true,
                hideExportToCsv: true,
                hideExportToXls: true,
                hideClearSorting: true

            }
        }
    };


    render() {
        return (
            <div>
                <div>
                    <Label id="default" text="test MSISDNSubmitProgress Check" />
                </div>
                <div>
                    <DataGrid
                        gridOptions={this.gridOptions}
                        rowData={this.rowData} />
                </div>
            </div>
        )
    }
}