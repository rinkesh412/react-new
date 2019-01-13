import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import './billing-cycle-widget.layout.styl';

export class USCCBillingCycleWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="due-date-container">
                <div className="due-date-container__start">
                    Billing cycle starts on the
                    <div className="due-date-container__date">
                        26th
                    </div>
                </div>
            </div>
        );
    }
}

export default USCCBillingCycleWidget;

USCCBillingCycleWidget.propTypes = {

};

USCCBillingCycleWidget.defaultProps = {

};