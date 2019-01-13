import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './device-widget.layout.styl';

export class USCCDevicesWidget extends Component {
    constructor(props) {
        super(props);
        this.getPastListView = this.getPastListView.bind(this);
        this.getNumDevicesLast24Hour = this.getNumDevicesLast24Hour.bind(this);
        this.state = {
            data: [
                { name: ' Ford_Camera_0482', time: '8:55pm', created_date: '2018-07-3' },
                { name: 'Ford_Camera_0483', time: '11:32am', created_date: '2016-06-15' },
                { name: 'HP_Sensor_Exit_11', time: '10:15am', created_date: '2016-06-15' },
                { name: ' HP_Sensor_Temp_8B', time: '9:55am', created_date: '2016-06-15' }
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
            <div key="item.name" className="device-widget-past-item-container">
                <div className="device-widget-past-item-name-container">
                    {item.name}
                    <div className="device-widget-past-item-date-container">
                        {item.time}
                    </div>
                </div>
            </div>
        );
    }

    getNumDevicesLast24Hour() {
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
            <div className="device-widget-container">
                <div className="device-widget-number-devices-container">
                    Total Devices: {this.state.data.length}
                </div>
                <div className="device-widget-number-enterprise-devices-container">
                    Enterprises with Active Devices: 15
                </div>
                <div className="account-widget-number-past-accounts-container">
                    Devices Created in past 24 hours: {this.getNumDevicesLast24Hour()}
                </div>
                <div className="account-widget-past-accounts-container">
                    {this.getPastListView()}
                </div>

            </div>
        );
    }
}

export default USCCDevicesWidget;

USCCDevicesWidget.propTypes = {
    executeServiceOperation: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    componentData: PropTypes.object.isRequired
};

USCCDevicesWidget.defaultProps = {

};