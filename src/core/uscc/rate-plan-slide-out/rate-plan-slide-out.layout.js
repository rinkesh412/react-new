import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectItem, Button, Chips } from '@nokia-csf-uxr/csfWidgets';

import './rate-plan-slide-out.layout.styl';

export class USCCRatePlanSlideOut extends Component {
    constructor(props) {
        super(props);
        this.getChipsView = this.getChipsView.bind(this);
        this.chipClick = this.chipClick.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.submit = this.submit.bind(this);
        this.unassignAccount = this.unassignAccount.bind(this);
        this.state = {
            selectedItem: ''
        };
    }

    selectChange(evt) {
        this.setState({
            selectedItem: evt.value
        });
    }

    submit() {
        this.setState({
            selectedItem: ''
        });
        this.props.onSubmit(this.state.selectedItem);
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
                onCloseClick={this.unassignAccount}
                showCloseButton
                closeIcon="ic_close_circle"
                eventData={chip}
                editable={false}
            />
        );
    }

    render() {
        const className = 'uscc-rate-plan-slide-out-container' + (this.props.open ? ' uscc-rate-plan-slide-out-container__open' : '');
        return (
            <div className={className} >
                <div className="uscc-rate-plan-slide-out-container__background">
                    <div className="uscc-rate-plan-slide-out-label-container">
                        {this.props.label}
                        <div className="uscc-rate-plan-slide-out-label-container__button">
                            <Button
                                icon={this.props.getIconUrl('close')}
                                onClick={this.props.onCloseClick}
                            />
                        </div>
                    </div>
                    <div className="uscc-rate-plan-slide-out-select-container">
                        <SelectItem data={this.getSelectData()} selectedItem={this.state.selectedItem} onChange={this.selectChange} />
                        <div className="uscc-rate-plan-slide-out-select-container__button">
                            <Button text="Submit" onClick={this.submit} isCallToAction={true} disabled={this.state.selectedItem ? false : true } />
                        </div>
                    </div>
                    <div className="uscc-rate-plan-slide-out--chip-container">
                        {this.getChipsView()}
                    </div>
                </div>
            </div>
        );
    }
}

export default USCCRatePlanSlideOut;

USCCRatePlanSlideOut.propTypes = {
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

USCCRatePlanSlideOut.defaultProps = {
    open: true,
    chipData: []
};