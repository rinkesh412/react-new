import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import './rate-plans-pending-widget.layout.styl';

export class USCCRatePlansPendingWidget extends Component {
    constructor(props) {
        super(props);
        this.getRatePlansContentView = this.getRatePlansContentView.bind(this);

        /* eslint-disable no-unused-vars */
        const ratePlans3 = [
            {
                name: 'IOT_LTE_2MB'
            },
            {
                name: 'IOT_LTE_2MB_FlexIP'
            },
            {
                name: 'IOT_CDMA_2MB'
            }
        ];

        this.state = {
            ratePlans: ratePlans3
        };
    }

    componentDidMount() {
        let headerText = 'No Rate Plans Pending Approval';
        if(this.state.ratePlans.length > 0) {
            headerText = 'You have ' + this.state.ratePlans.length + ' Pending Approvals';
        }
        this.setState({
            ratePlanHeaderText: headerText
        });
    }

    getRatePlansContentView() {
        return this.state.ratePlans.map(item =>
            <div key="item.name" className="rate-plan-pending-item-container">
                <div className="rate-plan-pending-item-name-container">
                    {item.name}
                </div>
            </div>
        );

    }

    render() {
        let rateBackgroundColor = 'white';
        if(this.state.ratePlans.length > 0 && this.state.ratePlans.length < 5) {
            rateBackgroundColor = '#f7ff546e';
        }else if(this.state.ratePlans.length > 5) {
            rateBackgroundColor = '#fa000059';
        }
        const ratePlaneHeaderStyl = {
            backgroundColor: rateBackgroundColor
        };

        return (
            <div className="rate-plan-pending-container">
                <div className="rate-plan-pending__header" style={ratePlaneHeaderStyl}>
                    {this.state.ratePlanHeaderText}
                </div>
                <div className="rate-plan-pending-plans-container">
                    {this.getRatePlansContentView()}
                </div>
            </div>
        );
    }
}

export default USCCRatePlansPendingWidget;

USCCRatePlansPendingWidget.propTypes = {

};

USCCRatePlansPendingWidget.defaultProps = {

};