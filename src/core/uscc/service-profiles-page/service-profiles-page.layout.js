import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ServiceProfilesGrid from './service-profiles-grid.container';
import ServiceProfilesDetails from './service-profiles-details.container';

import Snackbar from '../snackbar/snackbar.container';

import { ProgressIndicatorCircular } from '@nokia-csf-uxr/csfWidgets';

import './service-profiles-page.layout.styl';

export class USCCServiceProfilesPage extends Component {
    constructor(props) {
        super(props);
        this.getInitialServiceProfilesData = this.getInitialServiceProfilesData.bind(this);
        this.getView = this.getView.bind(this);
        this.switchToDetailsView = this.switchToDetailsView.bind(this);
        this.switchToGridView = this.switchToGridView.bind(this);
        this.addNewServiceProfile = this.addNewServiceProfile.bind(this);
        this.assignAccount = this.assignAccount.bind(this);
        this.getInitialAccountData = this.getInitialAccountData.bind(this);
        this.getServiceProfiles = this.getServiceProfiles.bind(this);
        this.unassignAccount = this.unassignAccount.bind(this);
        this.state = {
            serviceProfiles: this.getInitialServiceProfilesData(),
            accounts: this.getInitialAccountData(),
            snackbarMessage: '',
            assignAccountMessageHandled: false,
            unassignAccountMessageHandled: false,
            view: 'GRID',
            loading: true,
            MySQLgetServProfData: {},
            GetMorseAccountsData: {}
        };
    }

    /* eslint-disable complexity, max-depth*/
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (props.pollingResponse && props.pollingResponse[ 'MySQLgetServProf' ]) {
            if (JSON.stringify(props.pollingResponse[ 'MySQLgetServProf' ]) !== JSON.stringify(state.MySQLgetServProfData)) {
                newState.MySQLgetServProfData = props.pollingResponse[ 'MySQLgetServProf' ];
                const result = props.getResults('MySQLgetServProf');
                if (result.results.properties.sqlResult) {
                    let sqlResultJson = JSON.parse(result.results.properties.sqlResult);
                    sqlResultJson.map(profile => {
                        let tDate = new Date(profile.Inserted);
                        profile[ 'dateCreated' ] = tDate.toLocaleString();
                        profile[ 'sms' ] = profile.MO_SMS_Service || profile.MT_SMS_Service;
                        profile[ 'voice' ] = profile.MO_VOICE_Service || profile.MT_VOICE_Service;
                        return profile;
                    });
                    newState.serviceProfiles = sqlResultJson;
                }
            }
            newState.loading = false;
        }

        if (props.pollingResponse && props.pollingResponse[ 'GetMorseAccounts' ]) {
            if (JSON.stringify(props.pollingResponse[ 'GetMorseAccounts' ]) !== JSON.stringify(state.GetMorseAccountsData)) {
                newState.GetMorseAccountsData = props.pollingResponse[ 'GetMorseAccounts' ];
                const result = props.getResults('GetMorseAccounts');
                let accounts = [];
                if (result.results.properties.accounts && result.results.properties.accounts.items) {
                    result.results.properties.accounts.items.map(account => {
                        let accountJson = JSON.parse(account);
                        let cDate = new Date(accountJson.create_date);
                        accountJson.dateCreated = cDate.toLocaleString();
                        accounts.push(accountJson);
                    });
                    newState.accounts = accounts;
                }
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLassignAcctToServProf' ]) {
            const result = props.getResults('MySQLassignAcctToServProf');
            let assignRateResult = result.results;
            if (assignRateResult.errors.items.length > 0) {
                if (state.assignAccountMessageHandled === false) {
                    newState.snackbarMessage = assignRateResult.errors.items[ 0 ].message;
                    newState.assignAccountMessageHandled = true;
                } else {
                    newState.snackbarMessage = '';
                }
            } else {
                if (state.serviceProfiles) {
                    if (state.assignAccountMessageHandled === false) {
                        newState.snackbarMessage = 'Saved';
                        newState.assignAccountMessageHandled = true;

                        const serviceProfileIdx = state.serviceProfiles.findIndex(plan => plan[ 'Service_Plan' ] === state.assignServiceProfileName);
                        let serviceProfiles = JSON.parse(JSON.stringify(state.serviceProfiles));
                        const serviceProfilesAccounts = JSON.parse(serviceProfiles[ serviceProfileIdx ].Accounts);
                        serviceProfilesAccounts.push(state.assignAccountName);
                        serviceProfilesAccounts.sort((a, b) => {
                            if (a.toLowerCase() < b.toLowerCase()) return -1;
                            if (a.toLowerCase() > b.toLowerCase()) return 1;
                            return 0;
                        });
                        serviceProfiles[ serviceProfileIdx ].Accounts = JSON.stringify(serviceProfilesAccounts);
                        newState.serviceProfiles = serviceProfiles;
                    } else {
                        newState.snackbarMessage = '';
                    }
                }
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLunassignAcctFromServProf' ]) {
            const result = props.getResults('MySQLunassignAcctFromServProf');
            let unassignRateResult = result.results;
            if (unassignRateResult.errors.items.length > 0) {
                if (state.unassignAccountMessageHandled === false) {
                    newState.snackbarMessage = unassignRateResult.errors.items[ 0 ].message;
                    newState.unassignAccountMessageHandled = true;
                } else {
                    newState.unassignAccountMessage = '';
                }
            } else {
                if (state.serviceProfiles) {
                    if (state.unassignAccountMessageHandled === false) {
                        newState.snackbarMessage = 'Removed';
                        newState.unassignAccountMessageHandled = true;

                        const serviceProfileIdx = state.serviceProfiles.findIndex(plan => plan[ 'Service_Plan' ] === state.unassignServiceProfileName);
                        let serviceProfiles = JSON.parse(JSON.stringify(state.serviceProfiles));
                        const serviceProfilesAccounts = JSON.parse(serviceProfiles[ serviceProfileIdx ].Accounts);
                        const accountIdx = serviceProfilesAccounts.findIndex(serviceProfilesAccount => serviceProfilesAccount === state.unassignAccountName);
                        serviceProfilesAccounts.splice(accountIdx, 1);
                        serviceProfiles[ serviceProfileIdx ].Accounts = JSON.stringify(serviceProfilesAccounts);
                        newState.serviceProfiles = serviceProfiles;
                    } else {
                        newState.snackbarMessage = '';
                    }
                }
            }
        }

        return newState;
    }

    componentDidMount() {
        this.setState({
            assignAccountMessageHandled: true,
            unassignAccountMessageHandled: true,
            snackbarMessage: ''
        });
    }

    getInitialServiceProfilesData() {
        let result = this.props.getResults('MySQLgetServProf');
        if (result) {
            let result = (result && result.results.properties.sqlResult) ? JSON.parse(result.results.properties.sqlResult) : [];
        } else {
            this.getServiceProfiles();
        }
    }

    getServiceProfiles() {
        const params = [
            {
                'name': 'input',
                'value': ''
            }
        ];
        this.props.executeServiceOperation('MySQLgetServProf', params);
    }

    getInitialAccountData() {
        let result = this.props.getResults('GetMorseAccounts');
        if (result) {
            let result = (result && result.results.properties.accounts) ? JSON.parse(result.results.properties.accounts) : [];
            return result;
        } else {
            this.props.executeServiceOperation('GetMorseAccounts');
        }
    }

    assignAccount(account, serviceplan, apnName) {
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'serviceplan': serviceplan, apn: apnName })
            }
        ];

        this.props.executeServiceOperation('MySQLassignAcctToServProf', params);
        this.getServiceProfiles();
        this.setState({
            snackbarMessage: 'Assigning account: ' + account,
            assignAccountMessageHandled: false,
            assignAccountName: account,
            assignServiceProfileName: serviceplan
        });
    }

    unassignAccount(account, serviceplan) {
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'serviceplan': serviceplan })
            }
        ];

        this.props.executeServiceOperation('MySQLunassignAcctFromServProf', params);
        this.getServiceProfiles();
        this.setState({
            snackbarMessage: 'Removing account: ' + account,
            unassignAccountMessageHandled: false,
            unassignAccountName: account,
            unassignServiceProfileName: serviceplan
        });
    }

    addNewServiceProfile() {
        const execution = {
            name: 'createServiceProfile',
            renderer: 'iframe'
        };
        this.props.executeWorkflow(execution);
    }

    switchToDetailsView(data) {
        this.setState({
            view: 'DETAILS',
            detailsData: data
        });
    }

    switchToGridView() {
        this.setState({
            view: 'GRID',
            detailsData: undefined
        });
    }

    getView() {
        if (this.state.loading) {
            return (
                <ProgressIndicatorCircular
                    spinner="right"
                    className="" css={{ xxlarge: false, overlay: false, fade: true }}
                />
            );
        }

        if (this.state.view === 'GRID') {
            return (
                <ServiceProfilesGrid
                    serviceProfiles={this.state.serviceProfiles}
                    accounts={this.state.accounts}
                    viewDetailsClick={this.switchToDetailsView}
                    getIconUrl={this.props.getIconUrl}
                    addNewServiceProfile={this.addNewServiceProfile}
                    assignAccount={this.assignAccount}
                    unassignAccount={this.unassignAccount}
                />
            );
        } else {
            return (
                <ServiceProfilesDetails
                    serviceProfiles={this.state.detailsData}
                    switchToGridView={this.switchToGridView}
                    getIconUrl={this.props.getIconUrl}
                />
            );
        }
    }

    render() {
        return (
            <div className="service-profiles-page-container" >
                <div className="service-profiles-page-container__padding" >
                    {this.getView()}
                    <Snackbar
                        message={this.state.snackbarMessage}
                        autoHideDuration={400000}
                        hideActionButton={true}
                    />
                </div>
            </div>
        );
    }
}


USCCServiceProfilesPage.propTypes = {
    pollingResponse: PropTypes.object,
    siteDefinition: PropTypes.object,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};

export default USCCServiceProfilesPage;