import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './account-widget.layout.styl';

export class USCCAccountWidget extends Component {
    constructor(props) {
        super(props);
        this.executeServiceOperation = this.executeServiceOperation.bind(this);
        this.getServiceOperationID = this.getServiceOperationID.bind(this);
        this.getPastListView = this.getPastListView.bind(this);
        this.getNumAccLast24Hour = this.getNumAccLast24Hour.bind(this);
        this.state = {
            data: [],
            executionID: this.getServiceOperationID()
        };
    }

    componentDidMount() {
        this.executeServiceOperation();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.pollingResponse && props.pollingResponse[ state.executionID ]) {
            const result = props.getResults(state.executionID);
            let accounts = [];
            if (result.results.properties.accounts && result.results.properties.accounts.items) {
                result.results.properties.accounts.items.map(account => {
                    let accountJson = JSON.parse(account);
                    let cDate = new Date(accountJson.create_date);
                    accountJson.dateCreated = cDate.toLocaleString();
                    accounts.push(accountJson);
                });
            }
            return {
                data: accounts
            };
        }
    }

    /* eslint complexity: ["off"]*/
    getServiceOperationID() {

        let serviceOperationId = '';
        if (this.props.componentData && this.props.componentData.executions) {
            for (let execution of this.props.componentData.executions) {
                if (execution.type === 'serviceOperation') {
                    serviceOperationId = execution.executionIdentifier.name;
                }
            }
        }
        return serviceOperationId;
    }

    executeServiceOperation() {
        this.props.executeServiceOperation(this.state.executionID);
    }

    getNumAccLast24Hour() {
        let accountLast24Hours = [];
        accountLast24Hours = this.state.data.filter(account => ((new Date() - new Date(account.create_date)) < 86400000));
        return accountLast24Hours.length;
    }

    getPastListView() {
        return this.state.data.map(item =>
            <div key="item.name" className="account-widget-past-item-container">
                <div className="account-widget-past-item-name-container">
                    {item.name}
                    <div className="account-widget-past-item-date-container">
                        {item.primary_email}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="account-widget-container">
                <div className="account-widget-number-accounts-container">
                    Total Accounts: {this.state.data.length}
                </div>
                <div className="account-widget-number-past-accounts-container">
                    Account Created in past 24 hours: {this.getNumAccLast24Hour()}
                </div>
                <div className="account-widget-past-accounts-container">
                    {this.getPastListView()}
                </div>

            </div>
        );
    }
}

export default USCCAccountWidget;

USCCAccountWidget.propTypes = {
    executeServiceOperation: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    componentData: PropTypes.object.isRequired
};

USCCAccountWidget.defaultProps = {

};