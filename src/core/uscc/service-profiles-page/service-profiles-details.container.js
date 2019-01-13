import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button } from '@nokia-csf-uxr/csfWidgets';

import './service-profiles-details.container.styl';

const LABEL = {
    'Accounts': 'accounts',
    'Service_Plan': 'service plan name',
    'Product': 'product',
    'DATA_Service': 'data service',
    'voice': 'voice',
    'sms': 'sms',
    'Inserted': 'date created',
    'localeDatetime': 'create date',
    'MT_VOICE_Service': 'MT_VOICE_Service',
    'MO_VOICE_Service': 'MO_VOICE_Service',
    'MO_SMS_Service': 'MO_SMS_Service',
    'MT_SMS_Service': 'MT_SMS_Service',
    'dateCreated': 'date creatd'
};

export class ServiceProfilesDetails extends Component {
    constructor(props) {
        super(props);
        this.getValue = this.getValue.bind(this);
        this.getView = this.getView.bind(this);
        this.state = {};
    }

    getValue(key) {
        let value;
        if (key.toUpperCase() !== 'ACCOUNTS') {
            value = this.props.serviceProfiles[ key ];
        } else {
            value = this.props.serviceProfiles[ key ].map(account => account.name);
            value = value.toString().replace(/,/g, ', ');
        }
        return value;
    }

    getView() {

        return Object.keys(this.props.serviceProfiles).map(key => {
            if (key !== 'Inserted') {
                return (
                    <div className="service-profiles-details-item-container">
                        <Label text={LABEL[ key ].toUpperCase() + ':'} position="left" />
                        <span className="service-profiles-detail__value">
                            {this.getValue(key)}
                        </span>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div className="service-profiles-details-container">
                <div className="service-profiles-details-header-container">
                    <div className="service-profiles-details-header__bold">Service Profiles Details</div>
                    <div className="service-profiles-details-close-container">
                        <Button
                            icon={this.props.getIconUrl('close')}
                            onClick={this.props.switchToGridView}
                        />
                    </div>
                </div>
                <div className="service-profiles-details-items-container">
                    {this.getView()}
                </div>
            </div>
        );
    }
}

export default ServiceProfilesDetails;

ServiceProfilesDetails.propTypes = {
    serviceProfiles: PropTypes.object.isRequired,
    switchToGridView: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired
};