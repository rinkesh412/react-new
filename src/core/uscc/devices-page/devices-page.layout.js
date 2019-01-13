/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DevicesGrid from './devices-grid.container';
import DevicesDetails from './devices-details.container';

import { ProgressIndicatorCircular } from '@nokia-csf-uxr/csfWidgets';

import { SelectItem } from '@nokia-csf-uxr/csfWidgets';
import './devices-page.layout.styl';

export class USCCDevicesPage extends Component {
    constructor(props) {
        super(props);
        this.getDevicesByAccount = this.getDevicesByAccount.bind(this);
        this.getView = this.getView.bind(this);
        this.switchToDetailsView = this.switchToDetailsView.bind(this);
        this.switchToGridView = this.switchToGridView.bind(this);
        this.addNew = this.addNew.bind(this);
        this.state = {
            view: 'GRID',
            loading: false,
            view: 'GRID',
            selectedAccount: '',
            accountsModel: [],
            accountsData: [],
            devicesModel: [],
            devicesData: []
        };
    }

    /* eslint-disable complexity */
    static getDerivedStateFromProps(nextProps, prevState) {
        let state = {};

        if (nextProps.pollingResponse && nextProps.pollingResponse[ 'GetMorseAccounts' ]) {
            if (JSON.stringify(nextProps.pollingResponse[ 'GetMorseAccounts' ]) !== JSON.stringify(prevState.accountsData)){
                state.accountsData = nextProps.pollingResponse[ 'GetMorseAccounts' ];
                const result = nextProps.getResults('GetMorseAccounts');
                let accounts = [];
                if (result.results.properties.accounts && result.results.properties.accounts.items) {
                    result.results.properties.accounts.items.map(account => {
                        let accountJson = JSON.parse(account);
                        let cDate = new Date(accountJson.create_date);
                        accountJson.dateCreated = cDate.toLocaleString();
                        accounts.push(accountJson);
                    });
                    let accountData = accounts.map(account => (
                        { label: account.name, value: account.name }
                    ));
                    state.accountsModel = accountData.sort((a, b) => {
                        if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
                        if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
                        return 0;
                    });
                }
            }
        }

        if (nextProps.pollingResponse && nextProps.pollingResponse[ 'SPS' ]) {
            if (JSON.stringify(nextProps.pollingResponse[ 'SPS' ]) !== JSON.stringify(prevState.devicesData)){
                state.devicesData = nextProps.pollingResponse[ 'SPS' ];
                const result = nextProps.getResults('SPS');
                if (result.results.properties.inputs) {
                    let inputs = result.results.properties.inputs.processParams;
                    let account =  JSON.parse(inputs);
                        state.selectedAccount = account.id
                }
                if (result.results.properties.spsResult) {
                    let spsResult = JSON.parse(result.results.properties.spsResult);
                    if (spsResult[ 0 ].devices) {
                        let spsResultMapDataGrid = spsResult[ 0 ].devices.map(device => {
                            let model = {};
                            model.id = device.id;
                            model.iccid = (device.customData.entry.filter(type => type.key === 'ICCID').length > 0) ? device.customData.entry.filter(type => type.key === 'ICCID')[ 0 ].value.value : null;
                            model.meid = (device.customData.entry.filter(type => type.key === 'MEID').length > 0) ? device.customData.entry.filter(type => type.key === 'MEID')[ 0 ].value.value : null;
                            model.mdn = device.identities[ 0 ] ? device.identities[ 0 ].value : null;
                            model.ratePlanName = device.subscriptions[ 0 ] ? device.subscriptions[ 0 ].bundle.name : null;
                            model.label = (device.customData.entry.filter(type => type.key === 'Label').length > 0) ? device.customData.entry.filter(type => type.key === 'Label')[ 0 ].value.value : null;
                            model.dataUsed = device.counterInstancesList ? device.counterInstancesList.counterDefId : null;
                            let cDate = new Date(device.creationTime);
                            model.dateCreated = cDate.toLocaleString();
                            let uDate = new Date(device.lastUpdateTime);
                            model.dateUpdated = uDate.toLocaleString();
                            return model;
                        });
                        state.devicesModel = spsResultMapDataGrid;
                    } else {
                        state.devicesModel = [];
                    }
                }
            }

            state.loading = false;
        }
        return state;
    }

    getDevicesByAccount(targetAccount) {
        this.setState(() => ({
            selectedAccount: targetAccount,
            loading: true
        }));

        const params = [
            {
                'name': 'spsRequestConfig',
                'value': JSON.stringify({ 'method': 'accountdata', 'httpMethod': 'GET', 'useRequestBody': 'false', 'useProcessParams': 'true' })
            },
            {
                'name': 'spsProcessParams',
                'value': JSON.stringify({ 'id': targetAccount, 'detailedQuery': 'true' })
            },
            {
                'name': 'spsBody',
                'value': ''
            }
        ];
        this.props.executeServiceOperation('SPS', params);
    }

    addNew() {
        const execution = {
            name: 'provisionDevice',
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
                <DevicesGrid
                    accounts={this.state.accountsModel}
                    devices={this.state.devicesModel}
                    viewDetailsClick={this.switchToDetailsView}
                    getIconUrl={this.props.getIconUrl}
                    addNew={this.addNew}
                    filterAccount={this.getDevicesByAccount}
                    selectedAccount={this.state.selectedAccount}
                />
            );
        } else {
            return (
                <DevicesDetails
                    data={this.state.detailsData}
                    switchToGridView={this.switchToGridView}
                    getIconUrl={this.props.getIconUrl}
                />
            );
        }
    }

    render() {
        return (
            <div className="devices-page-container" >
                <div className="devices-page-container__padding" >
                    {this.getView()}
                </div>
            </div>
        );
    }
}

USCCDevicesPage.propTypes = {
    pollingResponseState: PropTypes.object,
    siteDefinition: PropTypes.object,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};

export default USCCDevicesPage;