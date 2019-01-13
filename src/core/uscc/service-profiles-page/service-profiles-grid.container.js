import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    DataGrid,
    FloatingActionButton,
    AlertDialogConfirm
} from '@nokia-csf-uxr/csfWidgets';

import { USCCServiceProfileSlideOut } from '../service-profile-slide-out/service-profile-slide-out';

import './service-profiles-grid.container.styl';

export class ServiceProfilesGrid extends Component {
    constructor(props) {
        super(props);
        this.getGridOptions = this.getGridOptions.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.getDeleteConfirmView = this.getDeleteConfirmView.bind(this);
        this.getDeletedServiceProfile = this.getDeletedServiceProfile.bind(this);
        this.onClose = this.onClose.bind(this);
        this.assignAccount = this.assignAccount.bind(this);
        this.unassignAccount = this.unassignAccount.bind(this);
        this.toggleAccountSlideOut = this.toggleAccountSlideOut.bind(this);
        this.getAssignedAccounts = this.getAssignedAccounts.bind(this);
        this.rowSelectionChanged = this.rowSelectionChanged.bind(this);
        this.state = {
            showConfirm: false,
            showAccountsSlideout: false,
            serviceProfiles: [],
            assignedAccounts: []
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        let newState = {};
        if(state.api) {
            const selectedServiceProfile = state.api.getSelectedRows();
            if(selectedServiceProfile.length > 0) {
                const serviceProfile = nextProps.serviceProfiles.find(serviceProfile => serviceProfile['Service_Plan'] === selectedServiceProfile[0]['Service_Plan']);
                newState.assignedAccounts = selectedServiceProfile.length > 0 ? JSON.parse(serviceProfile.Accounts) : [];
            }
        }

        return newState;
    }

    /* eslint-disable */
    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.serviceProfiles) === JSON.stringify(this.props.serviceProfiles)
        && JSON.stringify(nextProps.assignedAccounts) === JSON.stringify(this.props.assignedAccounts)
        && nextState.showAccountsSlideout === this.state.showAccountsSlideout
        && nextState.showConfirm === this.state.showConfirm
        && !nextState.showAccountsSlideout)
        {
            return false;
        }

        if (this.state.api && JSON.stringify(nextProps.serviceProfiles) !== JSON.stringify(this.props.serviceProfiles)) {
            this.state.api.setRowData(nextProps.serviceProfiles);
        }
        return true;
    }
    /* eslint-enable */

    onGridReady(params) {
        const api = params.value.api;
        api.sizeColumnsToFit();

        if (this.props.serviceProfiles.length > 0) {
            api.setRowData(this.props.serviceProfiles);
        }

        this.setState({
            api: api
        });
    }

    getGridOptions() {
        return {
            columnDefs: [
                { headerName: 'Service Plan Name', field: 'Service_Plan', width: 200 },
                { headerName: 'Product', field: 'Product', width: 100 },
                { headerName: 'SMS Service', field: 'sms', width: 100 },
                { headerName: 'Voice Service', field: 'voice', width: 105 },
                { headerName: 'Data Service', field: 'DATA_Service', width: 100 },
                { headerName: 'Create Date', field: 'dateCreated', width: 150 }
            ],
            rowAction: {
                types: [
                    {
                        name: 'Assign',
                        icon: this.props.getIconUrl('accountEnterprise')
                    },
                    {
                        name: 'Detail',
                        icon: this.props.getIconUrl('info')
                    },
                    {
                        name: 'Delete',
                        icon: this.props.getIconUrl('delete')
                    }
                ],
                callback: params => this.rowClick(params),
                disable() {
                    return false;
                },
            },
            deltaRowDataMode: true,
            getRowNodeId: data => data.Service_Plan,
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

    toggleAccountSlideOut() {
        this.setState(state => ({
            showAccountsSlideout: !state.showAccountsSlideout
        }));
    }

    rowClick(params) {
        switch (params.value.name) {
            case 'Delete':
                this.deleteClick(params.value.items[ 0 ].data);
                break;
            case 'Assign':
                this.toggleAccountSlideOut();
                break;

            default:
                this.props.viewDetailsClick(params.value.items[ 0 ].data);
                break;
        }
    }

    deleteClick() {
        this.setState(state => ({
            showConfirm: !state.showConfirm
        }));
    }

    getDeletedServiceProfile() {
        if(this.state.api) {
            const profile = this.state.api.getSelectedRows();
            return profile.length > 0 ? profile[0] : {};
        }
        return {};
    }

    assignAccount(acct, apnName) {
        this.props.assignAccount(acct, this.state.api.getSelectedRows()[0]['Service_Plan'], apnName);
    }

    unassignAccount(acct) {
        this.props.unassignAccount(acct, this.state.api.getSelectedRows()[0]['Service_Plan']);
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

    getDeleteConfirmView() {
        if(this.state.showConfirm) {
            let profile = this.getDeletedServiceProfile();
            return (
                <AlertDialogConfirm
                    id={profile.Service_Plan}
                    title="Do you want to delete this service profile?"
                    confirmationText1="This service profile will disappear permanently from the system."
                    confirmationText2={profile.Service_Plan}
                    confirmationButtonLabel="DELETE"
                    onClose={this.onClose}
                    onConfirm={() => this.onConfirm(profile.Service_Plan)}
                    trapFocus={true}
                />
            );
        }
        return null;
    }

    render() {
        const fobStyle = {
            'z-index': '10',
            'position': 'fixed',
            'right': '33px',
            'top': '70px',
            'background': 'rgb(37, 156, 250)'
        };
        const selectData = this.props.accounts.map(account => ({
            label: account.name, value: account.name
        }));

        return (
            <div className="service-profiles-grid-container">
                <div className="service-profiles-grid-header">
                    <div className="service-profiles-grid-header__label">Service Profiles</div>
                    <FloatingActionButton
                        style={fobStyle}
                        icon={this.props.getIconUrl('plus')}
                        onClick={this.props.addNewServiceProfile}
                    />
                </div>
                <div className="service-profiles-grid-container__grid">
                    <DataGrid
                        onGridReady={this.onGridReady}
                        gridOptions={this.getGridOptions()}
                        rowData={[]}
                    />
                    <USCCServiceProfileSlideOut
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

export default ServiceProfilesGrid;

ServiceProfilesGrid.propTypes = {
    serviceProfiles: PropTypes.array,
    accounts: PropTypes.array,
    viewDetailsClick: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    addNewServiceProfile: PropTypes.func.isRequired,
    assignAccount: PropTypes.func.isRequired,
    unassignAccount: PropTypes.func.isRequired
};

ServiceProfilesGrid.defaultProps = {
    serviceProfiles: [],
    accounts: []
};