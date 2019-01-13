import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './rate-plan-widget.layout.styl';

export class USCCRatePlanWidget extends Component {
    constructor(props) {
        super(props);
        this.getPastListView = this.getPastListView.bind(this);
        this.getNumRatePlansLast24Hour = this.getNumRatePlansLast24Hour.bind(this);
        this.state = {
            data: [
                { name: 'IOT_LTE_5MB', time: '8:55pm', created_date: '2016-06-15' },
                { name: 'IOT_LTE_10MB_FlexIP', time: '11:32am', created_date: '2016-06-15' },
                { name: 'IOT_CDMA_1MB', time: '10:15am', created_date: '2016-06-15' },
                { name: 'IOT_CDMA_2MB', time: '9:55am', created_date: '2016-06-15' }
            ],
            executionID: this.getServiceOperationID()
        };
    }

    componentDidMount() {
        this.executeServiceOperation();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.pollingResponse && props.pollingResponse[state.executionID]) {
            const result = props.getResults(state.executionID);
            return {
                data: JSON.parse(result.results.result.value)
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
        //this.props.executeServiceOperation(this.state.executionID);
    }

    getPastListView() {
        return this.state.data.map(item =>
            <div key="item.name" className="rate-plan-widget-past-item-container">
                <div className="rate-plan-widget-past-item-name-container">
                    {item.name}
                    <div className="rate-plan-widget-past-item-date-container">
                        {item.time}
                    </div>
                </div>
            </div>
        );
    }

    getNumRatePlansLast24Hour() {
        let num = 0;
        this.state.data.forEach(account => {
            if(new Date() - new Date(account.created_date) < 86400000) {
                num ++;
            }
        });
        return num;
    }

    render() {
        return (
            <div className="rate-plan-widget-container">
                <div className="rate-plan-widget-number-rate-plans-container">
                    Total Rate Plans: {this.state.data.length}
                </div>
                <div className="account-widget-number-past-accounts-container">
                    Rate Plans Created in past 24 hours: {this.getNumRatePlansLast24Hour()}
                </div>
                <div className="account-widget-past-accounts-container">
                    {this.getPastListView()}
                </div>

            </div>
        );
    }
}

export default USCCRatePlanWidget;

USCCRatePlanWidget.propTypes = {
    executeServiceOperation: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    componentData: PropTypes.object.isRequired
};

USCCRatePlanWidget.defaultProps = {

};