import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './snackbar.view.styl';

export class SnackbarView extends Component {
    constructor(props) {
        super(props);
        this.getButtonView = this.getButtonView.bind(this);
        this.state = {};
    }

    getButtonView() {
        if(!this.props.hideActionButton) {
            return(
                <div className="Snackbar__ButtonContainer">
                    <button className="Snackbar__Button" onClick={this.props.actionClick} >{this.props.actionText}</button>
                </div>
            );
        }
        return undefined;
    }

    render() {
        return (
            <div className="Snackbar__View">
                <div className="Snackbar__Message">{this.props.message}</div>
                {this.getButtonView()}
            </div>
        );
    }
}

SnackbarView.propTypes = {
    message: PropTypes.string,
    actionText: PropTypes.string,
    actionClick: PropTypes.func.isRequired,
    hideActionButton: PropTypes.bool.isRequired
};

export default SnackbarView;