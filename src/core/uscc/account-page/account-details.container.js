import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button } from '@nokia-csf-uxr/csfWidgets';

import './account-details.container.styl';

const LABEL = {
    'tops_id': 'id',
    'account_id': 'account id',
    'primary_contact_fname': 'first',
    'primary_contact_lname': 'last',
    'name': 'company',
    'primary_email': 'email',
    'primary_contact_pn': 'phone',
    'business_vertical': 'business',
    'status': 'status',
    'create_date': 'date created',
    'dateCreated': 'date created'
};

export class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.getView = this.getView.bind(this);
        this.state = {};
    }

    getView() {
        return Object.keys(this.props.data).map(key => {
            if (key !== 'create_date') {
                return (
                    <div className="account-details-item-container">
                        <Label text={LABEL[ key ].toUpperCase() + ':'} position="left" />
                        <span className="account-detail__value">
                            {this.props.data[ key ]}
                        </span>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div className="account-details-container">
                <div className="account-details-header-container">
                    <div className="account-details-header__bold">Account Details</div>
                    <div className="account-details-close-container">
                        <Button
                            icon={this.props.getIconUrl('close')}
                            onClick={this.props.switchToGridView}
                        />
                    </div>
                </div>
                <div className="account-details-items-container">
                    {this.getView()}
                </div>
            </div>
        );
    }
}

export default AccountDetails;

AccountDetails.propTypes = {
    data: PropTypes.object.isRequired,
    switchToGridView: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired
};