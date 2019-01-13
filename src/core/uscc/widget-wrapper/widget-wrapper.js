import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@nokia-csf-uxr/csfWidgets';

import './widget-wrapper.styl';

export class WidgetWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Card css={{ width: this.props.width, height: this.props.height }}>
                <div className="usccWidgetContainer">
                    {this.props.children}
                </div>
            </Card>
        );
    }
}

export default WidgetWrapper;

WidgetWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.number,
    width: PropTypes.number
};

WidgetWrapper.defaultProps = {
    height: 215,
    width: 329
};