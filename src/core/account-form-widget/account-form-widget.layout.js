import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as CSFWidget from '@nokia-csf-uxr/csfWidgets';

import AccountWidgetFooter from './footer/footer.container';

class AccountFormWidget extends Component {
    constructor() {
        super();
        this.executeServiceOperation = this.executeServiceOperation.bind(this);
        this.getServiceOperationID = this.getServiceOperationID.bind(this);
        this.state = {
            churn: '',
            experience: '',
            status: '',
            executionID: undefined
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.pollingResponse[state.executionID]) {
            const result = nextProps.getResults(state.executionID);
            return {
                churn: result.results.properties.ACCT_STATUS_SECTION.AccountStatus.Churn,
                experience: result.results.properties.ACCT_STATUS_SECTION.AccountStatus.Experience,
                status: result.results.properties.ACCT_STATUS_SECTION.AccountStatus.Status

            };
        }
        return state;
    }

    componentDidMount() {
        const id = this.getServiceOperationID();
        this.setState({
            executionID: id
        }, () => {
            this.executeServiceOperation();
        });
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

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(this.props.pollingResponse[ this.state.executionID ]) !== JSON.stringify(nextProps.pollingResponse[ this.state.executionID ])) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div className="account-widget">
                I execute a service operation that is defined in my widget.json. Then I show the results below. Very cool!
                <CSFWidget.TextInput
                    text={this.state.churn}
                    label="Churn"
                    hasOutline={false}
                />
                <CSFWidget.TextInput
                    text={this.state.experience}
                    label="Experience"
                    hasOutline={false}
                />
                <div className="account-wdiget-footer">
                    <AccountWidgetFooter status={this.state.status} />
                </div>
            </div>

        );
    }
}

export default AccountFormWidget;

AccountFormWidget.propTypes = {
    executeServiceOperation: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    componentData: PropTypes.object.isRequired
};