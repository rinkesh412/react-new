import React, { Component } from 'react';

import * as CSFWidget from '@nokia-csf-uxr/csfWidgets';

import './usage-trends-widget.layout.styl';

export class USCCUsageTrendWidget extends Component {
    constructor(props) {
        super(props);
        this.getUsageTrendData = this.getUsageTrendData.bind(this);
        this.getTimeSelectData = this.getTimeSelectData.bind(this);
        this.setTimeFrame = this.setTimeFrame.bind(this);
        this.yTickFormatter = this.yTickFormatter.bind(this);
        this.state = {
            timeFrame: 'weekly'
        };
    }

    getUsageTrendData() {
        const timeWeek = [
            {
                time: 'Jan 1',
                cdma: 350000,
                dualMode: 100000,
            },
            {
                time: 'Jan 8',
                cdma: 300000,
                dualMode: 80000,
            },
            {
                time: 'Jan 15',
                cdma: 220000,
                dualMode: 40000,
            },
            {
                time: 'Jan 22',
                cdma: 890000,
                dualMode: 120000,
            },
            {
                time: 'Jan 31',
                cdma: 1000000,
                dualMode: 70000,
            }
        ];
        const timeMonth = [
            {
                time: 'Jan',
                cdma: 1000000,
                dualMode: 860000,
            },
            {
                time: 'Feb',
                cdma: 800000,
                dualMode: 670000,
            },
            {
                time: 'March',
                cdma: 500000,
                dualMode: 450000,
            },
            {
                time: 'April',
                cdma: 3000000,
                dualMode: 340000,
            },
            {
                time: 'May',
                cdma: 2000000,
                dualMode: 670000,
            }
        ];
        const timeThreeMonth = [
            {
                time: 'Jan',
                cdma: 9760000,
                dualMode: 6870000,
            },
            {
                time: 'March',
                cdma: 8730000,
                dualMode: 4630000,
            },
            {
                time: 'June',
                cdma: 5740000,
                dualMode: 3240000,
            },
            {
                time: 'September',
                cdma: 2430000,
                dualMode: 1230000,
            },
            {
                time: 'December',
                cdma: 7580000,
                dualMode: 2120000,
            }
        ];
        switch(this.state.timeFrame) {
            case 'weekly':
                return timeWeek;
            case 'monthly':
                return timeMonth;
            case 'triMonth':
                return timeThreeMonth;
        }
    }

    getTimeSelectData() {
        return [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: '3 Months', value: 'triMonth' }
        ];
    }

    setTimeFrame(evt) {
        this.setState({
            timeFrame: evt.value
        });
    }

    yTickFormatter(value) {
        return value/10000;
    }

    render() {
        return (
            <div className="uscc-usage-tends-widget-container">
                <CSFWidget.SelectItem
                    label="Time Frame"
                    data={this.getTimeSelectData()}
                    selectedItem={this.state.timeFrame}
                    onChange={this.setTimeFrame}
                />
                <CSFWidget.LineChart
                    title="Usage Trends"
                    data={this.getUsageTrendData()}
                    xDataKey="time"
                    yDataKey={[ 'cdma', 'dualMode' ]}
                    xLabel="Time"
                    yLabel="Devices (10K)"
                    width={650}
                    height={350}
                    yTickFormatter={this.yTickFormatter}
                />
            </div>
        );
    }
}

export default USCCUsageTrendWidget;

USCCUsageTrendWidget.propTypes = {

};

USCCUsageTrendWidget.defaultProps = {

};