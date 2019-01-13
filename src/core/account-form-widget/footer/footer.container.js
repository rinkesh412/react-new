import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as CSFWidget from '@nokia-csf-uxr/csfWidgets';

import './footer.container.styl';

export class AccountWidgetFooter extends Component {
    constructor(props) {
        super(props);
    }

    state = {  }
    render() {
        return (
            <div className="account-widget-footer__label">
                {this.props.status}
            </div>
        );
    }
}

export default AccountWidgetFooter;

AccountWidgetFooter.propTypes = {
    status: PropTypes.string.isRequired
};

AccountWidgetFooter.defaultProps = {

};