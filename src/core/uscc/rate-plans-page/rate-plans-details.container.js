import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button } from '@nokia-csf-uxr/csfWidgets';

import './rate-plans-details.container.styl';

const LABEL = {
    'tops_id': 'id',
    'primary_contact_fname': 'first',
    'primary_contact_lname': 'last',
    'name': 'company',
    'primary_email': 'email',
    'primary_contact_pn': 'phone',
    'business_vertical': 'business',
    'status': 'status',
    'Inserted': 'date created',
    'dateCreated': 'date created'
};

export class RatePlanDetails extends Component {
    constructor(props) {
        super(props);
        this.getView = this.getView.bind(this);
        this.state = {};
    }

    getView() {
        return Object.keys(this.props.data).map(key => (
            <div className="rate-plans-details-item-container">
                <Label text={LABEL[key].toUpperCase() + ':'} position="left" />
                <span className="rate-plans-detail__value">
                    {this.props.data[key]}
                </span>
            </div>
        ));
    }

    render() {
        return (
            <div className="rate-plans-details-container">
                <div className="rate-plans-details-header-container">
                    <div className="rate-plans-details-header__bold">Rate Plan Details</div>
                    <div className="rate-plans-details-close-container">
                        <Button
                            icon={this.props.getIconUrl('close')}
                            onClick={this.props.switchToGridView}
                        />
                    </div>
                </div>
                <div className="rate-plans-details-items-container">
                    {this.getView()}
                </div>
            </div>
        );
    }
}

export default RatePlanDetails;

RatePlanDetails.propTypes = {
    data: PropTypes.object.isRequired,
    switchToGridView: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired
};