import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PieChart } from '@nokia-csf-uxr/csfWidgets';

import './account-device-widget.layout.styl';

export class USCCAccountDeviceWidget extends Component {
    constructor(props) {
        super(props);
        // this.executeServiceOperation = this.executeServiceOperation.bind(this);
        // this.getServiceOperationID = this.getServiceOperationID.bind(this);
        this.state = {
            // executionID: this.getServiceOperationID()
        };
    }

    // componentDidMount() {
    //     console.log('Loading componentDidMount...', this.props);
    //     console.log('Loading componentDidMount... props.componentData', this.props.componentData);
    //     this.executeServiceOperation();
    // }

    // static getDerivedStateFromProps(props, state) {
    //     if (props.pollingResponse[state.executionID]) {
    //         const result = props.getResults(state.executionID);
    //         return{
    //             churn: result.results.properties.ACCT_STATUS_SECTION.AccountStatus.Churn,
    //             experience: result.results.properties.ACCT_STATUS_SECTION.AccountStatus.Experience,
    //             status: result.results.properties.ACCT_STATUS_SECTION.AccountStatus.Status
    //         };
    //     }
    // }

    /* eslint complexity: ["off"]*/
    // getServiceOperationID() {
    //     console.log('Getting props...', this.props);
    //     console.log('Getting service operation Id...', this.props.componentData);
    //     let serviceOperationId = '';
    //     if (this.props.componentData && this.props.componentData.executions) {
    //         for (let execution of this.props.componentData.executions) {
    //             if (execution.type === 'serviceOperation') {
    //                 serviceOperationId = execution.executionIdentifier.name;
    //             }
    //         }
    //     }
    //     return serviceOperationId;
    // }

    // executeServiceOperation() {
    //     console.log('Plugin: Execute service operation:', this.state.executionID);
    //     this.props.executeServiceOperation(this.state.executionID);
    // }

    render() {
        const tinyData = [
            { name: 'Ford', value: 32 },
            { name: 'HP', value: 18 },
            { name: 'Bank of America', value: 25 },
            { name: 'VW', value: 25 }
        ];
        return (
            <div className="account-device-container">
                <PieChart
                    animate={true}
                    outerRadius={60}
                    activeIndex={0}
                    data={tinyData}
                    valueLabel="value"
                    dataKey="value"
                    labelKey="name"
                    width={150}
                />
            </div>
        );
    }
}

export default USCCAccountDeviceWidget;

USCCAccountDeviceWidget.propTypes = {
    executeServiceOperation: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    componentData: PropTypes.object.isRequired
};

USCCAccountDeviceWidget.defaultProps = {

};