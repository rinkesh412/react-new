import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    DataGrid,
    AlertDialogConfirm
} from '@nokia-csf-uxr/csfWidgets';

import USCCRatePlanSlideOut from '../rate-plan-slide-out/rate-plan-slide-out.layout';

import './rate-plans-grid.container.styl';

export class RatePlansGrid extends Component {
    constructor(props) {
        super(props);
        this.getGridOptions = this.getGridOptions.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.rowActionClick = this.rowActionClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.getDeleteConfirmView = this.getDeleteConfirmView.bind(this);
        this.onClose = this.onClose.bind(this);
        this.toggleAccountSlideOut = this.toggleAccountSlideOut.bind(this);
        this.assignAccount = this.assignAccount.bind(this);
        this.getAssignedAccounts = this.getAssignedAccounts.bind(this);
        this.getDeletedRatePlan = this.getDeletedRatePlan.bind(this);
        this.rowSelectionChanged = this.rowSelectionChanged.bind(this);
        this.unassignAccount = this.unassignAccount.bind(this);
        this.state = {
            showConfirm: false,
            showAccountsSlideout: false,
            accounts: [],
            assignedAccounts: []
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        let newState = {};
        if(state.api) {
            const selectedRatePlan = state.api.getSelectedRows();
            if(selectedRatePlan.length > 0) {
                const ratePlan = nextProps.ratePlans.find(ratePlan => ratePlan['Rate_Plan_Name'] === selectedRatePlan[0]['Rate_Plan_Name']);
                newState.assignedAccounts = selectedRatePlan.length > 0 ? JSON.parse(ratePlan.Accounts) : [];
            }
        }

        return newState;
    }

    /* eslint-disable */
    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.ratePlans) === JSON.stringify(this.props.ratePlans)
        && JSON.stringify(nextProps.accounts) === JSON.stringify(this.props.accounts)
        && nextState.showAccountsSlideout === this.state.showAccountsSlideout
        && nextState.showConfirm === this.state.showConfirm
        && !nextState.showAccountsSlideout) {
            return false;
        }

        if (this.state.api && JSON.stringify(nextProps.ratePlans) !== JSON.stringify(this.props.ratePlans)) {
            this.state.api.setRowData(nextProps.ratePlans);
        }
        return true;
    }
    /* eslint-enable */

    onGridReady(params) {
        const api = params.value.api;
        api.sizeColumnsToFit();

        if (this.props.ratePlans.length > 0) {
            api.setRowData(this.props.ratePlans);
        }

        this.setState({
            api: api
        });
    }

    getGridOptions() {
        return {
            columnDefs: [
                { headerName: 'Rate Plan Name', field: 'Rate_Plan_Name', width: 150 },
                { headerName: 'Product', field: 'Product', width: 100 },
                { headerName: 'Status', field: 'Approval_State', width: 110 },
                { headerName: 'Pooling Allowed', field: 'Pooling_Allowed', width: 92 },
                { headerName: 'Rate Plan Type', field: 'Rate_Plan_Type', width: 90 },
                { headerName: 'Create Date', field: 'dateCreated', width: 85 }
            ],
            rowAction: {
                types: [
                    {
                        name: 'Assign',
                        icon: this.props.getIconUrl('accountEnterprise')
                    },
                    {
                        name: 'Delete',
                        icon: this.props.getIconUrl('delete')
                    }
                ],
                callback: params => this.rowActionClick(params),
                disable() {
                    return false;
                },
            },
            deltaRowDataMode: true,
            getRowNodeId: data => data.Rate_Plan_Name,
            onSelectionChanged: this.rowSelectionChanged
        };
    }

    rowSelectionChanged(evt) {
        this.setState({
            assignedAccounts: this.getAssignedAccounts(evt.api)
        });
    }

    getAssignedAccounts(api) {
        const acc = api.getSelectedRows();
        return acc.length > 0 ? JSON.parse(acc[0].Accounts) : [];
    }

    rowActionClick(params) {
        switch (params.value.name) {
            case 'Assign':
                this.toggleAccountSlideOut();
                break;
            case 'Delete':
                this.deleteClick(params.value.items[0].data);
                break;
        }
    }

    toggleAccountSlideOut() {
        this.setState(state => ({
            showAccountsSlideout: !state.showAccountsSlideout
        }));
    }


    deleteClick() {
        this.setState(state => ({
            showConfirm: !state.showConfirm
        }));
    }

    getDeletedRatePlan() {
        if(this.state.api) {
            const ratePlan = this.state.api.getSelectedRows();
            return ratePlan.length > 0 ? ratePlan[0] : {};
        }
        return {};
    }

    onClose() {
        this.setState(() => ({
            showConfirm: false
        }));
    }

    onConfirm() {
        this.setState(() => ({
            showConfirm: false
        }));
    }

    assignAccount(acct) {
        this.props.assignAccount(acct, this.state.api.getSelectedRows()[0]['Rate_Plan_Name']);
    }

    unassignAccount(acct) {
        this.props.unassignAccount(acct, this.state.api.getSelectedRows()[0]['Rate_Plan_Name']);
    }

    getDeleteConfirmView() {
        if(this.state.showConfirm) {
            let ratePlan = this.getDeletedRatePlan();
            return (
                <AlertDialogConfirm
                    id={ratePlan.Rate_Plan_Name}
                    title="Do you want to delete this rate plan?"
                    confirmationText1="This rate plan will disappear permanently from the system."
                    confirmationText2={ratePlan.Rate_Plan_Name}
                    confirmationButtonLabel="delete"
                    onClose={this.onClose}
                    onConfirm={() => this.onConfirm(ratePlan.Rate_Plan_Name)}
                    trapFocus={true}
                />
            );
        }
        return null;
    }


    render() {
        const selectData = this.props.accounts.map(account => ({
            label: account.name, value: account.name
        }));

        return (
            <div className="rate-plans-grid-container">
                <div className="rate-plans-grid-header">
                    <div className="rate-plans-grid-header__label">Rate Plans</div>
                </div>
                <div className="rate-plans-grid-container__grid">
                    <DataGrid
                        onGridReady={this.onGridReady}
                        gridOptions={this.getGridOptions()}
                        rowData={[]}
                    />
                    <USCCRatePlanSlideOut
                        selectData={selectData}
                        chipData={this.state.assignedAccounts}
                        label="Assign"
                        open={this.state.showAccountsSlideout}
                        getIconUrl={this.props.getIconUrl}
                        onCloseClick={this.toggleAccountSlideOut}
                        onSubmit={this.assignAccount}
                        unassignAccount={this.unassignAccount}
                    />
                </div>

                {this.getDeleteConfirmView()}
            </div>
        );
    }
}

export default RatePlansGrid;

RatePlansGrid.propTypes = {
    ratePlans: PropTypes.array,
    accounts: PropTypes.array,
    viewDetailsClick: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    assignAccount: PropTypes.func.isRequired,
    unassignAccount: PropTypes.func.isRequired
};

RatePlansGrid.defaultProps = {
    ratePlans: [],
    accounts: []
};