/* eslint-disable max-lines*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AccountGrid from './account-grid.container';
import AccountDetails from './account-details.container';

import { ProgressIndicatorCircular } from '@nokia-csf-uxr/csfWidgets';

import './account-page.layout.styl';
import Snackbar from '../snackbar/snackbar.container';

export class USCCAccountPage extends Component {
    constructor(props) {
        super(props);
        this.getAccounts = this.getAccounts.bind(this);
        this.getView = this.getView.bind(this);
        this.switchToDetailsView = this.switchToDetailsView.bind(this);
        this.switchToGridView = this.switchToGridView.bind(this);
        this.addNewAccount = this.addNewAccount.bind(this);
        this.getInitialServiceProfilesData = this.getInitialServiceProfilesData.bind(this);
        this.getServiceProfiles = this.getServiceProfiles.bind(this);
        this.getInitialRatePlansData = this.getInitialRatePlansData.bind(this);
        this.getRatePlans = this.getRatePlans.bind(this);
        this.assignServiceProfile = this.assignServiceProfile.bind(this);
        this.assignRatePlan = this.assignRatePlan.bind(this);
        this.unassignServiceProfile = this.unassignServiceProfile.bind(this);
        this.unassignRatePlan = this.unassignRatePlan.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.state = {
            accounts: this.getAccounts(),
            serviceProfiles: this.getInitialServiceProfilesData(),
            ratePlans: this.getInitialRatePlansData(),
            assignAccountMessageHandled: false,
            unassignAccountMessageHandled: false,
            deleteAccountMessageHandled: false,
            view: 'GRID',
            loading: true,
            GetMorseAccountsData: {},
            MySQLgetServProfData: {},
            MySQLgetRatePlanData: {},
            MySQLassignAccountToRatePlanData: {},
            MySQLunassignAccountFromRatePlanData: {},
            MySQLassignServProfToAcctData: {},
            MySQLunassignServProfFromAcctData: {}
        };
    }

    /* eslint-disable complexity */
    static getDerivedStateFromProps(props, state) {
        let newState = {};

        if (props.pollingResponse && props.pollingResponse[ 'GetMorseAccounts' ]) {
            if (JSON.stringify(props.pollingResponse[ 'GetMorseAccounts' ]) !== JSON.stringify(state.GetMorseAccountsData)) {
                newState.GetMorseAccountsData = props.pollingResponse[ 'GetMorseAccounts' ];
                const result = props.getResults('GetMorseAccounts');
                if (result.results.properties.accounts && result.results.properties.accounts.items) {
                    let accountResult = [];
                    result.results.properties.accounts.items.map(account => {
                        let accountJson = JSON.parse(account);
                        let cDate = new Date(accountJson.create_date);
                        accountJson.dateCreated = cDate.toLocaleString();
                        accountResult.push(accountJson);
                    });
                    newState.accounts = accountResult;
                    newState.loading = false;
                }
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLgetRatePlan' ]) {
            if (JSON.stringify(props.pollingResponse[ 'MySQLgetRatePlan' ]) !== JSON.stringify(state.MySQLgetRatePlanData)) {
                newState.MySQLgetRatePlanData = props.pollingResponse[ 'MySQLgetRatePlan' ];
                const result = props.getResults('MySQLgetRatePlan');

                if (result.results.result.properties !== '') {
                    let ratePlanResult = JSON.parse(result.results.properties.sqlResult);
                    ratePlanResult.map(plan => {
                        let cDate = new Date(plan.Inserted);
                        plan.dateCreated = cDate.toLocaleString();
                    });
                    newState.ratePlans = ratePlanResult;
                }
            }
        }

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
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLassignAccountToRatePlan' ]) {
            if (JSON.stringify(props.pollingResponse[ 'MySQLassignAccountToRatePlan' ]) !== JSON.stringify(state.MySQLassignAccountToRatePlanData)) {
                newState.MySQLassignAccountToRatePlanData = props.pollingResponse[ 'MySQLassignAccountToRatePlan' ];
                const result = props.getResults('MySQLassignAccountToRatePlan');
                let assignRateResult = result.results;
                if (assignRateResult.errors.items.length > 0) {
                    if (state.assignAccountMessageHandled === false) {
                        newState.snackbarMessage = assignRateResult.errors.items[ 0 ].message;
                        newState.assignAccountMessageHandled = true;
                    } else {
                        newState.snackbarMessage = '';
                    }
                } else {
                    if (state.ratePlans && state.ratePlans.length > 0) {
                        if (state.assignAccountMessageHandled === false) {
                            newState.snackbarMessage = 'Saved';
                            state.assignAccountMessageHandled = true;

                            const ratePlanIdx = state.ratePlans.findIndex(plan => plan[ 'Rate_Plan_Name' ] === state.assignRatePlanName);
                            let ratePlans = JSON.parse(JSON.stringify(state.ratePlans));
                            const ratePlanAccounts = JSON.parse(ratePlans[ ratePlanIdx ].Accounts);
                            ratePlanAccounts.push(state.assignAccountName);
                            ratePlanAccounts.sort((a, b) => {
                                if (a.toLowerCase() < b.toLowerCase()) return -1;
                                if (a.toLowerCase() > b.toLowerCase()) return 1;
                                return 0;
                            });
                            ratePlans[ ratePlanIdx ].Accounts = JSON.stringify(ratePlanAccounts);
                            newState.ratePlans = ratePlans;
                        } else {
                            newState.snackbarMessage = '';
                        }
                    }
                }
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLunassignAccountFromRatePlan' ]) {
            if (JSON.stringify(props.pollingResponse[ 'MySQLunassignAccountFromRatePlan' ]) !== JSON.stringify(state.MySQLunassignAccountFromRatePlanData)) {
                newState.MySQLunassignAccountFromRatePlanData = props.pollingResponse[ 'MySQLunassignAccountFromRatePlan' ];
                const result = props.getResults('MySQLunassignAccountFromRatePlan');
                let unassignRateResult = result.results;

                if (unassignRateResult.errors.items.length > 0) {
                    if (state.unassignAccountMessageHandled === false) {
                        newState.snackbarMessage = unassignRateResult.errors.items[ 0 ].message;
                        newState.unassignAccountMessageHandled = true;
                    } else {
                        newState.snackbarMessage = '';
                    }
                } else {
                    if (state.ratePlans && state.ratePlans.length > 0) {
                        if (state.unassignAccountMessageHandled === false) {
                            newState.snackbarMessage = 'Removed';
                            newState.unassignAccountMessageHandled = true;

                            const ratePlanIdx = state.ratePlans.findIndex(plan => plan[ 'Rate_Plan_Name' ] === state.unassignRatePlanName);
                            let ratePlans = JSON.parse(JSON.stringify(state.ratePlans));
                            const ratePlansAccounts = JSON.parse(ratePlans[ ratePlanIdx ].Accounts);
                            const accountIdx = ratePlansAccounts.findIndex(ratePlansAccount => ratePlansAccount === state.unassignAccountName);
                            ratePlansAccounts.splice(accountIdx, 1);
                            ratePlans[ ratePlanIdx ].Accounts = JSON.stringify(ratePlansAccounts);
                            newState.ratePlans = ratePlans;
                        } else {
                            newState.snackbarMessage = '';
                        }
                    }
                }
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLassignServProfToAcct' ]) {
            if (JSON.stringify(props.pollingResponse[ 'MySQLassignServProfToAcct' ]) !== JSON.stringify(state.MySQLassignServProfToAcct)) {
                newState.MySQLassignServProfToAcct = props.pollingResponse[ 'MySQLassignServProfToAcct' ];
                const result = props.getResults('MySQLassignServProfToAcct');
                let assignServiceProfileResult = result.results;
                if (assignServiceProfileResult.errors.items.length > 0) {
                    if (state.assignAccountMessageHandled === false) {
                        newState.snackbarMessage = assignServiceProfileResult.errors.items[ 0 ].message;
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
                            const serviceProfilesAccounts = serviceProfiles[ serviceProfileIdx ].Accounts;
                            let acct = { name: state.assignAccountName, apn: state.assignServiceProfileApn };
                            serviceProfilesAccounts.push(acct);
                            serviceProfilesAccounts.sort((a, b) => {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            });
                            serviceProfiles[ serviceProfileIdx ].Accounts = serviceProfilesAccounts;
                            newState.serviceProfiles = serviceProfiles;
                        }
                    }
                }
            }
            if (state.assignAccountMessageHandled) {
                newState.snackbarMessage = '';
                newState.assignAccountMessageHandled = false;
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'MySQLunassignServProfFromAcct' ]) {
            if (JSON.stringify(props.pollingResponse[ 'MySQLunassignServProfFromAcct' ]) !== JSON.stringify(state.MySQLunassignServProfFromAcct)) {
                newState.MySQLunassignServProfFromAcct = props.pollingResponse[ 'MySQLunassignServProfFromAcct' ];
                const result = props.getResults('MySQLunassignServProfFromAcct');
                let unassignServiceProfile = result.results;
                if (unassignServiceProfile.errors.items.length > 0) {
                    if (state.unassignAccountMessageHandled === false) {
                        newState.snackbarMessage = unassignServiceProfile.errors.items[ 0 ].message;
                        newState.unassignAccountMessageHandled = true;
                    } else {
                        newState.snackbarMessage = '';
                    }
                } else {
                    if (state.serviceProfiles) {
                        if (state.unassignAccountMessageHandled === false) {
                            newState.snackbarMessage = 'Removed';
                            newState.unassignAccountMessageHandled = true;

                            const serviceProfileIdx = state.serviceProfiles.findIndex(plan => plan[ 'Service_Plan' ] === state.unassignServiceProfileName);
                            let serviceProfiles = JSON.parse(JSON.stringify(state.serviceProfiles));
                            const serviceProfilesAccounts = serviceProfiles[ serviceProfileIdx ].Accounts;
                            const accountIdx = serviceProfilesAccounts.findIndex(serviceProfilesAccount => serviceProfilesAccount.name === state.unassignAccountName);
                            serviceProfilesAccounts.splice(accountIdx, 1);
                            serviceProfiles[ serviceProfileIdx ].Accounts = serviceProfilesAccounts;
                            newState.serviceProfiles = serviceProfiles;
                        }
                    }
                }
            }
            if (state.unassignAccountMessageHandled) {
                newState.snackbarMessage = '';
                newState.unassignAccountMessageHandled = false;
            }
        }

        if (props.pollingResponse && props.pollingResponse[ 'DeleteAccount' ]) {
            const result = props.getResults('DeleteAccount');
            let deleteAccount = result.results;
            if (deleteAccount.errors.items.length > 0) {
                if (state.deleteAccountMessageHandled === false) {
                    newState.snackbarMessage = deleteAccount.errors.items[ 0 ].message;
                    newState.deleteAccountMessageHandled = true;
                } else {
                    newState.snackbarMessage = '';
                }
            } else {
                if (state.accounts) {
                    if (state.deleteAccountMessageHandled === false) {
                        newState.snackbarMessage = 'Deleted: ' + state.deleteAccountName;
                        newState.deleteAccountMessageHandled = true;

                        let accounts = JSON.parse(JSON.stringify(state.accounts));
                        const accountIdx = accounts.findIndex(account => account.name === state.deleteAccountName);
                        accounts.splice(accountIdx, 1);

                        newState.accounts = accounts;
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
            deleteAccountMessageHandled: true
        });
    }

    getAccounts() {
        let result = this.props.getResults('GetMorseAccounts');
        if (result) {
            let result = (result && result.results.properties.accounts) ? JSON.parse(result.results.properties.accounts) : [];
            this.setState({
                loading: false
            });
            return result;
        } else {
            this.props.executeServiceOperation('GetMorseAccounts');
        }
    }

    getInitialServiceProfilesData() {
        let result = this.props.getResults('MySQLgetServProf');
        if (result) {
            let result = (result && result.results.properties.sqlResult) ? JSON.parse(result.results.properties.sqlResult) : [];
        } else {
            this.getServiceProfiles();
            return [];
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

    getInitialRatePlansData() {
        let result = this.props.getResults('MySQLgetRatePlan');
        if (result) {
            let result = (result && result.results.properties.sqlResult) ? JSON.parse(result.results.properties.sqlResult) : [];
            return result;
        } else {
            this.getRatePlans();
            return [];
        }
    }

    getRatePlans() {
        const params = [
            {
                'name': 'methodName',
                'value': 'rateplandata'
            },
            {
                'name': 'input',
                'value': ''
            }
        ];
        this.props.executeServiceOperation('MySQLgetRatePlan', params);
    }

    addNewAccount() {
        const execution = {
            name: 'createAccount',
            renderer: 'iframe'
        };
        this.props.executeWorkflow(execution);
    }

    assignServiceProfile(serviceProfile, apn, account) {
        this.setState({
            snackbarMessage: 'Assigning Service Profile: ' + serviceProfile,
            assignAccountMessageHandled: false,
            assignAccountName: account,
            assignServiceProfileName: serviceProfile,
            assignServiceProfileApn: apn
        });

        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'serviceplan': serviceProfile, apn: apn })
            }
        ];

        this.props.executeServiceOperation('MySQLassignServProfToAcct', params);
        this.getServiceProfiles();
    }

    unassignServiceProfile(serviceProfile, account) {
        this.setState({
            snackbarMessage: 'Removing Service Profile: ' + serviceProfile,
            unassignAccountMessageHandled: false,
            unassignAccountName: account,
            unassignServiceProfileName: serviceProfile
        });

        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'serviceplan': serviceProfile })
            }
        ];

        this.props.executeServiceOperation('MySQLunassignServProfFromAcct', params);
        this.getServiceProfiles();
    }

    assignRatePlan(rateplan, account) {
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'rateplan': rateplan })
            }
        ];

        this.props.executeServiceOperation('MySQLassignAccountToRatePlan', params);
        this.getRatePlans();
        this.setState({
            snackbarMessage: 'Assigning Rate Plan: ' + rateplan,
            assignAccountMessageHandled: false,
            assignAccountName: account,
            assignRatePlanName: rateplan
        });
    }

    unassignRatePlan(rateplan, account) {
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'rateplan': rateplan })
            }
        ];

        this.props.executeServiceOperation('MySQLunassignAccountFromRatePlan', params);
        this.getRatePlans();
        this.setState({
            snackbarMessage: 'Removing Rate Plan: ' + rateplan,
            unassignAccountMessageHandled: false,
            unassignAccountName: account,
            unassignRatePlanName: rateplan
        });
    }

    deleteAccount(account) {
        const params = [
            {
                'name': 'accountId',
                'value': account[ 'tops_id' ]
            }
        ];

        this.props.executeServiceOperation('DeleteAccount', params);
        this.props.executeServiceOperation('GetMorseAccounts');
        this.setState({
            snackbarMessage: 'Removing Account: ' + account.name,
            deleteAccountMessageHandled: false,
            deleteAccountName: account.name
        });
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
                <AccountGrid
                    accounts={this.state.accounts}
                    ratePlans={this.state.ratePlans}
                    serviceProfiles={this.state.serviceProfiles}
                    viewDetailsClick={this.switchToDetailsView}
                    getIconUrl={this.props.getIconUrl}
                    addNewAccount={this.addNewAccount}
                    assignServiceProfile={this.assignServiceProfile}
                    unassignServiceProfile={this.unassignServiceProfile}
                    assignRatePlan={this.assignRatePlan}
                    unassignRatePlan={this.unassignRatePlan}
                    deleteAccount={this.deleteAccount}
                />
            );
        } else {
            return (
                <AccountDetails
                    data={this.state.detailsData}
                    switchToGridView={this.switchToGridView}
                    getIconUrl={this.props.getIconUrl}
                />
            );
        }
    }

    render() {
        return (
            <div className="account-page-container" >
                <div className="account-page-container__padding" >
                    {this.getView()}
                    <Snackbar
                        message={this.state.snackbarMessage} autoHideDuration={4000} hideActionButton={true}
                    />
                </div>
            </div>
        );
    }
}

export default USCCAccountPage;

USCCAccountPage.propTypes = {
    pollingResponse: PropTypes.object,
    siteDefinition: PropTypes.object,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired
};