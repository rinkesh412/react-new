import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button } from '@nokia-csf-uxr/csfWidgets';

import './devices-admin-details.container.styl';

const LABEL = {
    'iccid': 'iccid',
    'meid': 'meid',
    'mdn': 'mdn',
    'ratePlanName': 'rate plan name',
    'label': 'label',
    'dataUsed': 'data used (kb)',
    'dateCreated': 'date created',
    'dateUpdated': 'date updated',
    'id': 'id'
};
export class DevicesAdminDetails extends Component {
    constructor(props) {
        super(props);
        this.getView = this.getView.bind(this);
        this.state = {};
    }

    getView() {
        return Object.keys(this.props.data).map(key => (
            <div className="devices-details-item-container">
                <Label text={LABEL[ key ].toUpperCase() + ':'} position="left" />
                <span className="devices-detail__value">
                    {this.props.data[ key ]}
                </span>
            </div>
        ));
    }

    render() {
        return (
            <div className="devices-details-container">
                <div className="devices-details-header-container">
                    <div className="devices-details-header__bold">Device Details</div>
                    <div className="devices-details-close-container">
                        <Button
                            icon={this.props.getIconUrl('close')}
                            onClick={this.props.switchToGridView}
                        />
                    </div>
                </div>
                <div className="devices-details-items-container">
                    {this.getView()}
                </div>
            </div>
        );
    }
}

export default DevicesAdminDetails;

DevicesAdminDetails.propTypes = {
    data: PropTypes.object.isRequired,
    switchToGridView: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired
};