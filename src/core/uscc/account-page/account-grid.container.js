import React, { Component } from 'react';
import PropTypes from 'prop-types';

import USCCAccountSlideOut from '../account-slide-out/account-slide-out.layout';

import {
    DataGrid,
    FloatingActionButton,
    AlertDialogConfirm
} from '@nokia-csf-uxr/csfWidgets';

import './account-grid.container.styl';

export class AccountGrid extends Component {
    constructor(props) {
        super(props);
        this.getGridOptions = this.getGridOptions.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.rowActionsClick = this.rowActionsClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.getDeleteConfirmView = this.getDeleteConfirmView.bind(this);
        this.onClose = this.onClose.bind(this);
        this.toggleAccountSlideOut = this.toggleAccountSlideOut.bind(this);
        this.assignServiceProfile = this.assignServiceProfile.bind(this);
        this.unassignServiceProfile = this.unassignServiceProfile.bind(this);
        this.assignRatePlan = this.assignRatePlan.bind(this);
        this.unassignRatePlan = this.unassignRatePlan.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.state = {
            showConfirm: false,
            showAccountsSlideout: false,
            selectedAccount: { name: '' }
        };
    }

    /* eslint-disable complexity */
    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.ratePlans) === JSON.stringify(this.props.ratePlans)
        && JSON.stringify(nextProps.serviceProfiles) === JSON.stringify(this.props.serviceProfiles)
        && JSON.stringify(nextProps.accounts) === JSON.stringify(this.props.accounts)
            && nextState.showConfirm === this.state.showConfirm
            && nextState.showAccountsSlideout === this.state.showAccountsSlideout
            && !nextState.showAccountsSlideout
        ) {
            return false;
        }

        if (this.state.api && JSON.stringify(nextProps.accounts) !== JSON.stringify(this.props.accounts)) {
            this.state.api.setRowData(nextProps.accounts);
        }
        return true;
    }

    onGridReady(params) {
        const api = params.value.api;
        api.sizeColumnsToFit();

        if (this.props.accounts.length > 0) {
            api.setRowData(this.props.accounts);
        }

        this.setState({
            api: api
        });
    }

    getGridOptions() {
        return {
            columnDefs: [
                { headerName: 'Company', field: 'name', width: 100 },
                { headerName: 'ID', field: 'tops_id', width: 50 },
                { headerName: 'Status', field: 'status', width: 80 },
                { headerName: 'Business Vertical', field: 'business_vertical', width: 80 },
                { headerName: 'Date Created', field: 'dateCreated', width: 80 },
            ],
            rowAction: {
                types: [
                    {
                        name: 'Detail',
                        icon: this.props.getIconUrl('info')
                    },
                    {
                        name: 'Assign',
                        icon: this.props.getIconUrl('serviceProfile')
                    },
                    {
                        name: 'Edit',
                        icon: this.props.getIconUrl('edit')
                    },
                    {
                        name: 'Delete',
                        icon: this.props.getIconUrl('delete')
                    }
                ],
                callback: params => this.rowActionsClick(params),
                disable() {
                    return false;
                },
            },
            deltaRowDataMode: true,
            onRowClicked: this.rowClick,
            getRowNodeId: accounts => accounts.tops_id
        };
    }

    rowClick(evt) {
        this.setState({
            selectedAccount: evt.data
        });
    }

    rowActionsClick(params) {
        switch (params.value.name) {
            case 'Assign':
                this.toggleAccountSlideOut();
                break;
            case 'Delete':
                this.deleteClick(params.value.items[ 0 ].data);
                break;
            case 'Edit':
                // TODO: add edit operation
                break;
            default:
                // Detail
                this.props.viewDetailsClick(params.value.items[ 0 ].data);
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

    assignServiceProfile(serviceProfile, apn) {
        this.props.assignServiceProfile(serviceProfile, apn, this.state.selectedAccount.name);
    }

    unassignServiceProfile(serviceProfile) {
        this.props.unassignServiceProfile(serviceProfile, this.state.selectedAccount.name);
    }

    assignRatePlan(ratePlan) {
        this.props.assignRatePlan(ratePlan, this.state.selectedAccount.name);
    }

    unassignRatePlan(ratePlan) {
        this.props.unassignRatePlan(ratePlan, this.state.selectedAccount.name);
    }

    deleteAccount() {
        this.props.deleteAccount(this.state.selectedAccount);
        this.setState({
            showConfirm: false
        });
    }

    getDeleteConfirmView() {
        if (this.state.showConfirm) {
            return (
                <AlertDialogConfirm
                    id={this.state.selectedAccount.tops_id}
                    title="Do you want to delete this account?"
                    confirmationText1="This account will disappear permanently from the system."
                    confirmationText2={this.state.selectedAccount.name}
                    confirmationButtonLabel="DELETE"
                    onClose={this.onClose}
                    onConfirm={this.deleteAccount}
                    trapFocus={true}
                />
            );
        }
        return null;
    }

    onClose() {
        this.setState(() => ({
            showConfirm: false
        }));
    }

    onConfirm(accountId) {
        this.setState(() => ({
            showConfirm: false
        }));
    }

    render() {
        const fobStyle = {
            'z-index': '10',
            'position': 'fixed',
            'right': '33px',
            'top': '70px',
            'background': 'rgb(37, 156, 250)'
        };

        return (
            <div className="account-grid-container">
                <div className="account-grid-header">
                    <div className="account-grid-header__label">Accounts</div>
                    <FloatingActionButton
                        style={fobStyle}
                        icon={this.props.getIconUrl('plus')}
                        onClick={this.props.addNewAccount}
                    />
                </div>
                <div className="account-grid-container__grid">
                    <DataGrid
                        onGridReady={this.onGridReady}
                        gridOptions={this.getGridOptions()}
                        rowData={[]}
                    />
                    <USCCAccountSlideOut
                        ratePlans={this.props.ratePlans}
                        serviceProfiles={this.props.serviceProfiles}
                        label="Assign"
                        open={this.state.showAccountsSlideout}
                        getIconUrl={this.props.getIconUrl}
                        onCloseClick={this.toggleAccountSlideOut}
                        assignServiceProfile={this.assignServiceProfile}
                        unassignServiceProfile={this.unassignServiceProfile}
                        assignRatePlan={this.assignRatePlan}
                        unassignRatePlan={this.unassignRatePlan}
                        selectedAccount={this.state.selectedAccount.name}
                    />
                </div>

                {this.getDeleteConfirmView()}
            </div>
        );
    }
}

export default AccountGrid;

AccountGrid.propTypes = {
    accounts: PropTypes.array,
    ratePlans: PropTypes.array,
    serviceProfiles: PropTypes.array,
    viewDetailsClick: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    addNewAccount: PropTypes.func.isRequired,
    assignServiceProfile: PropTypes.func.isRequired,
    unassignServiceProfile: PropTypes.func.isRequired,
    assignRatePlan: PropTypes.func.isRequired,
    unassignRatePlan: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired
};

AccountGrid.defaultProps = {
    accounts: []
};