import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button } from '@nokia-csf-uxr/csfWidgets';

import './approvals-details.container.styl';

const LABEL = {
    'Accounts': 'accounts',
    'dateCreated': 'Date Submitted',
    'Inserted': 'Date Submitted',
    'Rate_Plan_Type': 'rate plan type',
    'Rate_Plan_Name': 'rate plan',
    'Description': 'description',
    'Pooling_Allowed': 'pooling allowed',
    'Product': 'product',
    'Approval_State': 'approval state'
};

export class ApprovalDetails extends Component {
    constructor(props) {
        super(props);
        this.getView = this.getView.bind(this);
        this.state = {};
    }

    getView() {
        return Object.keys(this.props.data).map(key => {
            if (key !== 'Inserted') {
                return (
                    <div className="approvals-details-item-container">
                        <Label text={LABEL[ key ].toUpperCase() + ':'} position="left" />
                        <span className="approvals-detail__value">
                            {this.props.data[ key ]}
                        </span>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div className="approvals-details-container">
                <div className="approvals-details-header-container">
                    <div className="approvals-details-header__bold">Rate Plan Details</div>
                    <div className="approvals-details-close-container">
                        <Button
                            icon={this.props.getIconUrl('close')}
                            onClick={this.props.switchToGridView}
                        />
                    </div>
                </div>
                <div className="approvals-details-items-container">
                    {this.getView()}
                </div>
            </div>
        );
    }
}

export default ApprovalDetails;

ApprovalDetails.propTypes = {
    data: PropTypes.object.isRequired,
    switchToGridView: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired
};