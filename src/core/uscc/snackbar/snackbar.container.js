import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SnackbarView from './views/snackbar.view';

import './snackbar.container.styl';

export default class Snackbar extends Component {

    constructor() {
        super();

        this.state = {
            open: false,
            timerAutoHideId: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.message === this.props.message && nextState.open === this.state.open) {
            return false;
        }

        return true;
    }

    static getDerivedStateFromProps(props) {
        if(props.message !== '') {
            return {
                open: true
            };
        }

        if(props.message === '') {
            return {
                open: false
            };
        }
    }

    componentDidMount = () => {
        if(this.state.open) {
            this.setAutoHideTimer();
        }
    }

    componentDidUpdate() {
        if(this.props.message !== '') {
            this.setAutoHideTimer();
        }
    }

    setAutoHideTimer = () => {
        const autoHideDuration = this.props.autoHideDuration;
        if (autoHideDuration > 0) {
            this.clearTimeout(this.timerAutoHideId);
            this.timerAutoHideId = setTimeout(() => {
                this.setState({ open: false });
                this.props.callback ? this.props.callback() : null;
            }, autoHideDuration);
        }
    }

    clearTimeout = () => {
        clearTimeout(this.timerAutoHideId);
    }

    getClasses = () => {
        let classname = 'Snackbar__Container ';
        if(this.state.open) {
            classname += 'Snackbar__Container--Open';
        }

        return classname;
    }

    actionClick = () => {
        this.clearTimeout();
        this.setState({ open: false });
        this.props.actionClick();
    }

    render() {
        return (
            <div className={this.getClasses()}>
                <SnackbarView
                    message={this.props.message}
                    actionText={this.props.actionText}
                    actionClick={this.actionClick}
                    hideActionButton={this.props.hideActionButton}
                />
            </div>
        );
    }
}

Snackbar.propTypes = {
    autoHideDuration: PropTypes.number,
    message: PropTypes.node.isRequired,
    onRequestClose: PropTypes.func,
    actionText: PropTypes.string,
    callback: PropTypes.func.isRequired,
    actionClick: PropTypes.func.isRequired,
    hideActionButton: PropTypes.bool
};

Snackbar.defaultProps = {
    message: '',
    autoHideDuration: 20000,
    actionText: 'Undo',
    hideActionButton: false
};