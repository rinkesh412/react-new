import React, { Component } from 'react';
import { ColumnChart } from '@nokia-csf-uxr/csfWidgets';

import './billing-summary-widget.layout.styl';

export class USCCBillingSummaryWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = [
            {
                month: 'Apr',
                Ford: 132637000,
                HP: 11688000,
                MSI: 20393000,
                M3: 48226000,
                Starbucks: 41000000,
                Yahoo: 69835000,
                Nokia: 7675000,
                VW: 41000000,
                Tesla: 69835000,
                BankOfAmerica: 7675000,
            },
            {
                month: 'May',
                Ford: 152271000,
                HP: 14011422,
                MSI: 28485180,
                M3: 50127000,
                Starbucks: 42518000,
                Yahoo: 68374572,
                Nokia: 8442750,
                VW: 41000000,
                Tesla: 69835000,
                BankOfAmerica: 7675000,
            },
            {
                month: 'Jun',
                Ford: 180671000,
                HP: 18266765,
                MSI: 38578505,
                M3: 52372000,
                Starbucks: 46584000,
                Yahoo: 72480869,
                Nokia: 9036700,
                VW: 41000000,
                Tesla: 69835000,
                BankOfAmerica: 7675000,
            },
        ];

        return (
            <div className="billing-summary-container">
                <ColumnChart
                    data={data}
                    text="Standard Text"
                    yLabel="Total (USD)"
                    xLabel="Accounts"
                    isAnimation={true}
                    xDataKey="month"
                    yDataKey={[ 'Ford', 'HP', 'MSI', 'M3', 'Starbucks', 'Yahoo', 'Nokia', 'VW', 'Tesla', 'BankOfAmerica' ]}
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

export default USCCBillingSummaryWidget;

USCCBillingSummaryWidget.propTypes = {

};

USCCBillingSummaryWidget.defaultProps = {

};