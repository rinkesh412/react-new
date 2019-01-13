import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RatePlansGrid from './rate-plans-grid.container';
import RatePlanDetails from './rate-plans-details.container';

import Snackbar from '../snackbar/snackbar.container';

import { ProgressIndicatorCircular } from '@nokia-csf-uxr/csfWidgets';

import './rate-plans-page.layout.styl';

export class USCCRatePlansPage extends Component {
    constructor(props) {
        super(props);
        this.getInitialRatePlanData = this.getInitialRatePlanData.bind(this);
        this.getInitialAccountData = this.getInitialAccountData.bind(this);
        this.assignAccount = this.assignAccount.bind(this);
        this.getView = this.getView.bind(this);
        this.switchToDetailsView = this.switchToDetailsView.bind(this);
        this.switchToGridView = this.switchToGridView.bind(this);
        this.getRatePlans = this.getRatePlans.bind(this);
        this.unassignAccount = this.unassignAccount.bind(this);
        this.state = {
            ratePlans: this.getInitialRatePlanData(),
            accounts: this.getInitialAccountData(),
            snackbarMessage: '',
            assignAccountMessageHandled: false,
            unassignAccountMessageHandled: false,
            view: 'GRID',
            loading: true
        };
    }

    /* eslint-disable complexity */
    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (props.pollingResponse && props.pollingResponse['MySQLgetRatePlan']) {
            const result = props.getResults('MySQLgetRatePlan');
            if(result.results.result.value !== '') {
                let ratePlanResult = JSON.parse(result.results.properties.sqlResult);
                ratePlanResult.map(plan => {
                    let cDate = new Date(plan.Inserted);
                    plan.dateCreated = cDate.toLocaleString();
                });
                newState.ratePlans = ratePlanResult;
                newState.loading = false;
            }
        }

        if (props.pollingResponse && props.pollingResponse['GetMorseAccounts']) {
            const result = props.getResults('GetMorseAccounts');
            let accounts = [];
            if(result.results.properties.accounts && result.results.properties.accounts.items) {
                result.results.properties.accounts.items.map(account => {
                    let accountJson = JSON.parse(account);
                    let cDate = new Date(accountJson.create_date);
                    accountJson.dateCreated = cDate.toLocaleString();
                    accounts.push(accountJson);
                });
                newState.accounts = accounts;
            }
        }

        if (props.pollingResponse && props.pollingResponse['MySQLassignAccountToRatePlan']) {
            const result = props.getResults('MySQLassignAccountToRatePlan');
            let assignRateResult = result.results;
            if(assignRateResult.errors.items.length > 0) {
                if(state.assignAccountMessageHandled === false) {
                    newState.snackbarMessage = assignRateResult.errors.items[0].message;
                    newState.assignAccountMessageHandled = true;
                }else {
                    newState.snackbarMessage = '';
                }
            }else{
                if(state.ratePlans) {
                    if(state.assignAccountMessageHandled === false) {
                        newState.snackbarMessage = 'Saved';
                        state.assignAccountMessageHandled = true;

                        const ratePlanIdx = state.ratePlans.findIndex(plan => plan['Rate_Plan_Name'] === state.assignRatePlanName);
                        let ratePlans= JSON.parse(JSON.stringify(state.ratePlans));
                        const ratePlanAccounts = JSON.parse(ratePlans[ratePlanIdx].Accounts);
                        ratePlanAccounts.push(state.assignAccountName);
                        ratePlanAccounts.sort((a, b) => {
                            if(a.toLowerCase() < b.toLowerCase()) return -1;
                            if(a.toLowerCase() > b.toLowerCase()) return 1;
                            return 0;
                        });
                        ratePlans[ratePlanIdx].Accounts = JSON.stringify(ratePlanAccounts);
                        newState.ratePlans = ratePlans;
                    }else{
                        newState.snackbarMessage = '';
                    }
                }
            }
        }

        if (props.pollingResponse && props.pollingResponse['MySQLunassignAccountFromRatePlan']) {
            const result = props.getResults('MySQLunassignAccountFromRatePlan');
            let unassignRateResult = result.results;

            if(unassignRateResult.errors.items.length > 0) {
                if(state.unassignAccountMessageHandled === false) {
                    newState.snackbarMessage = unassignRateResult.errors.items[0].message;
                    newState.unassignAccountMessageHandled = true;
                }else {
                    newState.snackbarMessage = '';
                }
            }else{
                if(state.ratePlans) {
                    if(state.unassignAccountMessageHandled === false) {
                        newState.snackbarMessage = 'Removed';
                        newState.unassignAccountMessageHandled = true;

                        const ratePlanIdx = state.ratePlans.findIndex(plan => plan['Rate_Plan_Name'] === state.unassignRatePlanName);
                        let ratePlans= JSON.parse(JSON.stringify(state.ratePlans));
                        const ratePlansAccounts = JSON.parse(ratePlans[ratePlanIdx].Accounts);
                        const accountIdx = ratePlansAccounts.findIndex(ratePlansAccount => ratePlansAccount === state.unassignAccountName);
                        ratePlansAccounts.splice(accountIdx, 1);
                        ratePlans[ratePlanIdx].Accounts = JSON.stringify(ratePlansAccounts);
                        newState.ratePlans = ratePlans;
                    }else{
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
            assignAccountMessage: ''
        });
    }

    /* eslint-disable complexity */
    getInitialRatePlanData() {
        let result = this.props.getResults('MySQLgetRatePlan');
        if(result) {
            let result = (result && result.results.properties.sqlResult) ? JSON.parse(result.results.properties.sqlResult) : [];
            return result;
        }else {
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

    getInitialAccountData() {
        let result = this.props.getResults('GetMorseAccounts');
        if(result) {
            let result = (result && result.results.properties.accounts) ? JSON.parse(result.results.properties.accounts) : [];
            return result;
        }else {
            this.props.executeServiceOperation('GetMorseAccounts');
            return [];
        }
    }

    assignAccount(account, ratePlan) {
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'rateplan': ratePlan })
            }
        ];

        this.props.executeServiceOperation('MySQLassignAccountToRatePlan', params);
        this.getRatePlans();
        this.setState({
            snackbarMessage: 'Assigning account ' + account,
            assignAccountMessageHandled: false,
            assignAccountName: account,
            assignRatePlanName: ratePlan
        });
    }

    unassignAccount(account, rateplan) {
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify({ 'account': account, 'rateplan': rateplan })
            }
        ];

        this.props.executeServiceOperation('MySQLunassignAccountFromRatePlan', params);
        this.getRatePlans();
        this.setState({
            snackbarMessage: 'Removing account: ' + account,
            unassignAccountMessageHandled: false,
            unassignAccountName: account,
            unassignRatePlanName: rateplan
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
        if(this.state.loading) {
            return(
                <ProgressIndicatorCircular
                    spinner="right"
                    className="" css={{ xxlarge: false, overlay: false, fade: true }}
                />
            );
        }

        if(this.state.view === 'GRID') {
            return(
                <RatePlansGrid
                    ratePlans={this.state.ratePlans}
                    accounts={this.state.accounts}
                    viewDetailsClick={this.switchToDetailsView}
                    getIconUrl={this.props.getIconUrl}
                    assignAccount={this.assignAccount}
                    unassignAccount={this.unassignAccount}
                />
            );
        }else {
            return(
                <RatePlanDetails
                    data={this.state.detailsData}
                    switchToGridView={this.switchToGridView}
                    getIconUrl={this.props.getIconUrl}
                />
            );
        }
    }

    render() {
        return (
            <div className="rate-plans-page-container" >
                <div className="rate-plans-page-container__padding" >
                    {this.getView()}
                    <Snackbar
                        message={this.state.snackbarMessage}
                        autoHideDuration={4000}
                        hideActionButton={true}
                    />
                </div>
            </div>
        );
    }
}

USCCRatePlansPage.propTypes = {
    pollingResponse: PropTypes.object,
    siteDefinition: PropTypes.object,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};

export default USCCRatePlansPage;