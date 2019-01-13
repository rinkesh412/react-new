import React, { Component } from 'react';
import { DataGrid, Label } from '@nokia-csf-uxr/csfWidgets';
import './fota-um-test-target-container.styl';
import { formatI18N } from '../../../services/i18n-label-service';
import PropTypes from 'prop-types';
//import getDeleteResultItems from './../../../services/test-result-data-service';
export default class TestTargetProgressTable extends Component {

    constructor(props) {
        super(props);
        this.results = null;
        this.onGridReady = this.onGridReady.bind(this);
        this.state = {
            deleteFunc: '',
            //this.onGridReady = this.onGridReady.bind(this);
            deleteTestData: [],
            subNumber: formatI18N('dsp_sbp_test-target_col1-subnumber'),
            operation: formatI18N('dsp_sbp_sms-push-test_header_operation'),
            totalNumberofTerminals: formatI18N('dsp_sbp_test-target_col2-totalnumberofterminals'),
            totalNumberofTargetTerminals: formatI18N('dsp_sbp_test-target_col3-totalnumberoftargetterminals'),
            numberofCompletion: formatI18N('dsp_sbp_test-target_col4-numberofcompletion'),
            dateforplannedtofininsh: formatI18N('dsp_sbp_test-target_col5-dateforplannedtofininsh'),
            progressStatus: formatI18N('dsp_sbp_test-target_col6-progressStatus'),
            testMsisdnprogressCheck:formatI18N('dsp_fota_um_test_msisdnsubmit_progress_check'),
        };
        const columnDefs = [
            { headerName: this.state.subNumber, field: 'subnumber', width: 130 },
             {headerName: this.state.operation, field: 'operation', width: 130},
            { headerName: this.state.totalNumberofTerminals, field: 'totalnoterminal', width: 130 },
            { headerName: this.state.totalNumberofTargetTerminals, field: 'totaltagetterminal', width: 130 },
            { headerName: this.state.numberofCompletion, field: 'completion', width: 130 },
            { headerName: this.state.dateforplannedtofininsh, field: 'date', width: 130 },
            { headerName: this.state.progressStatus, field: 'status', width: 130 }
        ];
        this.rowData = [{
            subnumber: '100',
            operation: "Delete",
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '3400',
            date: '24/08/2008',
            status: 'completed',
        },
        {
            subnumber: '130',
            operation: "Delete",
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '3400',
            date: '24/08/2008',
            status: 'cancelled'
        }, {
            subnumber: '120',
            operation: "Delete",
            totalnoterminal: '100',
            totaltagetterminal: '24(2)',
            completion: '3400',
            date: '22/08/2008',
            status: 'inprogess'
        }
        ];
        this.gridOptions = {
            columnDefs
        }
    };

    onGridReady = params => {
        this.api = params.value.api;
        this.api.sizeColumnsToFit();
    }

    
    /* componentDidMount() {
        this.setState({ deleteTestData: getDeleteResultItems('resultPage') });
    } */

    render() {
        return (
            <div>
                <div id="testSumitCheck">
                    <Label id="testSumbit" text={this.state.testMsisdnprogressCheck} />
                </div>
                <div style={{ height: 170 }}>
                    <DataGrid columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true}
                        disableRowActions={true} onGridReady={this.onGridReady} gridOptions={this.gridOptions}
                        rowData={this.rowData}
                    />
                </div>
            </div>
        )
    }
}

TestTargetProgressTable.propTypes = {
    nextModeChange: PropTypes.func.isRequired,
}