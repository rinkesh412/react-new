import React, { Component } from 'react';
import { ColumnChart } from '@nokia-csf-uxr/csfWidgets';

import './billing-summary-admin-widget.layout.styl';

export class USCCBillingSummaryAdminWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = [
            {
                month: 'Apr',
                Company: 132637000
            },
            {
                month: 'May',
                Company: 152271000
            },
            {
                month: 'Jun',
                Company: 180671000
            },
        ];

        return (
            <div className="billing-summary-admin-container">
                <ColumnChart
                    data={data}
                    text="Standard Text"
                    yLabel="Total (USD)"
                    xLabel="Accounts"
                    isAnimation={true}
                    xDataKey="month"
                    yDataKey={[ 'Company' ]}
                    width={700}
                    height={250}
                    yDataMin="auto"
                    yDataMax="auto"
                    xDataMin="auto"
                    xDataMax="auto"
                />
            </div>
        );
    }
}

export default USCCBillingSummaryAdminWidget;

USCCBillingSummaryAdminWidget.propTypes = {

};

USCCBillingSummaryAdminWidget.defaultProps = {

};