import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FUMSelectPlatform from '../../../components/fum-select-platform/fum-select-platform';

export class FUMPushSelectPlatform extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
               <FUMSelectPlatform nextModeChange={this.props.nextModeChange} /> 
            </div>
        );
    }
}

export default FUMPushSelectPlatform;

FUMPushSelectPlatform.propTypes = {
    nextModeChange: PropTypes.func.isRequired,
}