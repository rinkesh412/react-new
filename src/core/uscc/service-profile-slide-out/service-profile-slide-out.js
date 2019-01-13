import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectItem, Button, Chips, TextInput } from '@nokia-csf-uxr/csfWidgets';

import './service-profile-slide-out.layout.styl';

export class USCCServiceProfileSlideOut extends Component {
    constructor(props) {
        super(props);
        this.getChipsView = this.getChipsView.bind(this);
        this.chipClick = this.chipClick.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.submit = this.submit.bind(this);
        this.unassignAccount = this.unassignAccount.bind(this);
        this.apnChange = this.apnChange.bind(this);
        this.state = {
            selectedItem: '',
            apnText: ''
        };
    }

    selectChange(evt) {
        this.setState({
            selectedItem: evt.value
        });
    }

    apnChange(evt) {
        this.setState({
            apnText: evt.value
        });
    }

    submit() {
        this.setState({
            selectedItem: '',
            apnText: ''
        });
        this.props.onSubmit(this.state.selectedItem, this.state.apnText);
    }

    unassignAccount(evt) {
        this.props.unassignAccount(evt.data);
    }

    chipClick(evt) {
        this.props.onDelete(evt.value);
    }

    getSelectData() {
        return this.props.selectData.filter(item =>
            !this.props.chipData.find(chip => chip === item.value)
        );
    }

    getChipsView() {
        return this.props.chipData.map(chip =>
            <Chips
                text={chip}
                eventData={chip}
                onCloseClick={this.unassignAccount}
                showCloseButton={true}
                closeIcon="ic_close_circle"
                editable={false}
            />
        );
    }

    render() {
        const className = 'uscc-service-profile-slide-out-container' + (this.props.open ? ' uscc-service-profile-slide-out-container__open' : '');
        return (
            <div className={className} >
                <div className="uscc-service-profile-slide-out-container__background">
                    <div className="uscc-service-profile-slide-out-label-container">
                        {this.props.label}
                        <div className="uscc-service-profile-slide-out-label-container__button">
                            <Button
                                icon={this.props.getIconUrl('close')}
                                onClick={this.props.onCloseClick}
                            />
                        </div>
                    </div>
                    <div className="uscc-service-profile-slide-out-select-container">
                        <SelectItem data={this.getSelectData()} selectedItem={this.state.selectedItem} onChange={this.selectChange} />
                        <div>
                            <TextInput
                                text={this.state.apnText}
                                label="APN Name"
                                onChange={this.apnChange}
                            />
                        </div>
                        <div className="uscc-service-profile-slide-out-select-container__button">
                            <Button text="Submit" onClick={this.submit} isCallToAction={true} disabled={this.state.selectedItem ? false : true } />
                        </div>
                    </div>
                    <div className="uscc-service-profile-slide-out--chip-container">
                        {this.getChipsView()}
                    </div>
                </div>
            </div>
        );
    }
}

export default USCCServiceProfileSlideOut;

USCCServiceProfileSlideOut.propTypes = {
    open: PropTypes.bool,
    selectData: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    unassignAccount: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    chipData: PropTypes.array,
    label: PropTypes.string.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

USCCServiceProfileSlideOut.defaultProps = {
    open: true,
    chipData: []
};