import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    DataGrid
} from '@nokia-csf-uxr/csfWidgets';

import USCCApprovalSlideOut from '../approval-slide-out/approval-slide-out.layout';

import './approvals-grid.container.styl';

export class ApprovalsGrid extends Component {
    constructor(props) {
        super(props);
        this.approvePlan = this.approvePlan.bind(this);
        this.toggleApprovalSlideOut = this.toggleApprovalSlideOut.bind(this);
        this.getGridOptions = this.getGridOptions.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.state = {
            showConfirm: false,
            showApprovalSlideout: false,
            selectedData: {}
        };
    }

    /* eslint-disable */
    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextProps.approvals) === JSON.stringify(this.props.approvals)
            && nextState.showApprovalSlideout === this.state.showApprovalSlideout
            && !nextState.showApprovalSlideout) {
            return false;
        }
        if (this.state.api && JSON.stringify(nextProps.approvals) !== JSON.stringify(this.props.approvals)) {
            this.state.api.setRowData(nextProps.approvals);
        }
        return true;
    }
    /* eslint-enable */

    onGridReady(params) {
        const api = params.value.api;
        api.sizeColumnsToFit();

        if (this.props.approvals.length > 0) {
            api.setRowData(this.props.approvals);
        }

        this.setState({
            api: api
        });
    }

    getGridOptions() {
        return {
            columnDefs: [
                { headerName: 'Date Submitted', field: 'dateCreated', width: 150 },
                { headerName: 'Type', field: 'Rate_Plan_Type', width: 150 },
                { headerName: 'Name', field: 'Rate_Plan_Name', width: 150 }
            ],
            rowAction: {
                types: [
                    {
                        name: 'Detail',
                        icon: this.props.getIconUrl('info')
                    },
                    {
                        name: 'Approve',
                        icon: this.props.getIconUrl('edit')
                    }
                ],
                callback: params => this.rowClick(params),
                disable() {
                    return false;
                },
            },
            deltaRowDataMode: true,
            getRowNodeId: approvals => approvals.Rate_Plan_Name
        };
    }

    rowClick(params) {
        switch (params.value.name) {
            case 'Approve':
                this.setState(() => ({
                    selectedData: params.value.items[0].data
                }));
                this.toggleApprovalSlideOut();
                break;

            default:
                // Detail
                this.props.viewDetailsClick(params.value.items[ 0 ].data);
                break;
        }
    }

    approvePlan(approvalState, planData) {
        this.props.approvePlan(approvalState, planData);
    }

    toggleApprovalSlideOut() {
        if (this.state.showApprovalSlideout) {
            this.props.updateGrid();
        }

        this.setState(state => ({
            showApprovalSlideout: !state.showApprovalSlideout
        }));
    }

    render() {
        // const selectedData = this.state.api ? this.state.api.getSelectedRows()[ 0 ] : {};

        return (
            <div className="approvals-grid-container">
                <div className="approvals-grid-header">
                    <div className="approvals-grid-header__label">Pending Approvals</div>
                </div>
                <div className="approvals-grid-container__grid">
                    <DataGrid
                        onGridReady={this.onGridReady}
                        gridOptions={this.getGridOptions()}
                        rowData={[]}
                    />
                    <USCCApprovalSlideOut
                        selectedData={this.state.selectedData}
                        label="Approve"
                        open={this.state.showApprovalSlideout}
                        getIconUrl={this.props.getIconUrl}
                        onCloseClick={this.toggleApprovalSlideOut}
                        onSubmit={this.approvePlan}
                    />
                </div>
            </div>
        );
    }
}

export default ApprovalsGrid;

ApprovalsGrid.propTypes = {
    approvals: PropTypes.array,
    approvePlan: PropTypes.func.isRequired,
    viewDetailsClick: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    addNewServiceProfile: PropTypes.func.isRequired,
    updateGrid: PropTypes.func.isRequired
};

ApprovalsGrid.defaultProps = {
    approvals: []
};