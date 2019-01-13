import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectItem, Button, Chips, Tabs, Tab, TextInput } from '@nokia-csf-uxr/csfWidgets';

import './account-slide-out.layout.styl';

export class USCCAccountSlideOut extends Component {
    constructor(props) {
        super(props);
        this.getServiceProfileChipsView = this.getServiceProfileChipsView.bind(this);
        this.getRatePlanChipsView = this.getRatePlanChipsView.bind(this);
        this.serviceProfileChipClick = this.serviceProfileChipClick.bind(this);
        this.ratePlanSubmit = this.ratePlanSubmit.bind(this);
        this.ratePlanChipClick = this.ratePlanChipClick.bind(this);
        this.selectServiceProfileChange = this.selectServiceProfileChange.bind(this);
        this.selectRatePlanChange = this.selectRatePlanChange.bind(this);
        this.serviceProfileSubmit = this.serviceProfileSubmit.bind(this);
        this.isServiceProfileSubmitDisabled = this.isServiceProfileSubmitDisabled.bind(this);
        this.apnChange = this.apnChange.bind(this);
        this.state = {
            selectedServiceProfileItem: '',
            selectedRatePlanItem: '',
            apnText: ''
        };
    }

    selectServiceProfileChange(evt) {
        this.setState({
            selectedServiceProfileItem: evt.value
        });
    }

    selectRatePlanChange(evt) {
        this.setState({
            selectedRatePlanItem: evt.value
        });
    }

    serviceProfileSubmit() {
        this.setState({
            selectedServiceProfileItem: '',
            apnText: ''
        });
        this.props.assignServiceProfile(this.state.selectedServiceProfileItem, this.state.apnText);
    }

    ratePlanSubmit() {
        this.setState({
            selectedRatePlanItem: ''
        });
        this.props.assignRatePlan(this.state.selectedRatePlanItem);
    }

    serviceProfileChipClick(evt) {
        this.props.unassignServiceProfile(evt.data);
    }

    ratePlanChipClick(evt) {
        this.props.unassignRatePlan(evt.data);
    }

    getServicePropfileSelectData() {
        const filteredList = this.props.serviceProfiles.filter(serviceProfile => {
            const accounts = serviceProfile.Accounts;
            if (accounts.find(account => account.name === this.props.selectedAccount)) {
                return false;
            }
            return true;
        });

        return filteredList.map(serviceProfile => ({
            label: serviceProfile[ 'Service_Plan' ], value: serviceProfile[ 'Service_Plan' ]
        }));
    }

    getRatePlanSelectData() {
        const filteredList = this.props.ratePlans.filter(ratePlan => {
            const accounts = JSON.parse(ratePlan.Accounts);
            if (accounts.find(account => account === this.props.selectedAccount)) {
                return false;
            }
            return true;
        });

        return filteredList.map(ratePlan => ({
            label: ratePlan[ 'Rate_Plan_Name' ], value: ratePlan[ 'Rate_Plan_Name' ]
        }));
    }

    apnChange(evt) {
        this.setState({
            apnText: evt.value
        });
    }

    isServiceProfileSubmitDisabled() {
        if (!this.state.selectedServiceProfileItem || this.state.apnText === '') {
            return true;
        }
        return false;
    }

    getServiceProfileChipsView() {
        const filteredList = this.props.serviceProfiles.filter(serviceProfile => {
            const accounts = serviceProfile.Accounts;
            if (accounts.find(account => account.name === this.props.selectedAccount)) {
                return true;
            }
            return false;
        });
        return filteredList.map(serviceProfile => {
            let acct = serviceProfile.Accounts.filter(acct => acct.name === this.props.selectedAccount);
            let apn = acct[0] ? acct[0].apn : '';

            return (
                <Chips
                    text={serviceProfile[ 'Service_Plan' ]}
                    secondaryText={apn}
                    onCloseClick={this.serviceProfileChipClick}
                    showCloseButton
                    closeIcon="ic_close_circle"
                    eventData={serviceProfile[ 'Service_Plan' ]}
                    editable={false}
                />
            );
        });
    }

    getRatePlanChipsView() {
        const filteredList = this.props.ratePlans.filter(ratePlan => {
            const accounts = JSON.parse(ratePlan.Accounts);
            if (accounts.find(account => account === this.props.selectedAccount)) {
                return true;
            }
            return false;
        });
        return filteredList.map(ratePlan =>
            <Chips
                text={ratePlan[ 'Rate_Plan_Name' ]}
                onCloseClick={this.ratePlanChipClick}
                showCloseButton
                closeIcon="ic_close_circle"
                eventData={ratePlan[ 'Rate_Plan_Name' ]}
                editable={false}
            />
        );
    }

    /* eslint-disable complexity */
    render() {
        const className = 'uscc-account-slide-out-container' + (this.props.open ? ' uscc-account-slide-out-container__open' : '');
        return (
            <div className={className} >
                <div className="uscc-account-slide-out-container__background">
                    <div className="uscc-account-slide-out-label-container">
                        {this.props.label}
                        <div className="uscc-account-slide-out-label-container__button">
                            <Button
                                icon={this.props.getIconUrl('close')}
                                onClick={this.props.onCloseClick}
                            />
                        </div>
                    </div>
                    <Tabs alignment="left">
                        <Tab label="Service Profile">
                            <div className="uscc-account-slide-out-select-container">
                                <SelectItem
                                    data={this.getServicePropfileSelectData()}
                                    selectedItem={this.state.selectedServiceProfileItem}
                                    onChange={this.selectServiceProfileChange}
                                    width={350}
                                />
                                <div>
                                    <TextInput
                                        text={this.state.apnText}
                                        label="APN Name"
                                        onChange={this.apnChange}
                                    />
                                </div>
                                <div className="uscc-account-slide-out-select-container__button">
                                    <Button
                                        text="Submit"
                                        onClick={this.serviceProfileSubmit}
                                        isCallToAction={true}
                                        disabled={this.isServiceProfileSubmitDisabled()}
                                    />
                                </div>
                            </div>
                            <div className="uscc-account-slide-out--chip-container">
                                {this.getServiceProfileChipsView()}
                            </div>
                        </Tab>
                        <Tab label="Rate Plan">
                            <div className="uscc-account-slide-out-select-container">
                                <SelectItem
                                    data={this.getRatePlanSelectData()}
                                    selectedItem={this.state.selectedRatePlanItem}
                                    onChange={this.selectRatePlanChange}
                                />
                                <div className="uscc-account-slide-out-select-container__button">
                                    <Button
                                        text="Submit"
                                        onClick={this.ratePlanSubmit}
                                        isCallToAction={true}
                                        disabled={this.state.selectedRatePlanItem ? false : true}
                                    />
                                </div>
                            </div>
                            <div className="uscc-account-slide-out--chip-container">
                                {this.getRatePlanChipsView()}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default USCCAccountSlideOut;

USCCAccountSlideOut.propTypes = {
    open: PropTypes.bool,
    ratePlans: PropTypes.array.isRequired,
    serviceProfiles: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    assignServiceProfile: PropTypes.func.isRequired,
    unassignServiceProfile: PropTypes.func.isRequired,
    assignRatePlan: PropTypes.func.isRequired,
    unassignRatePlan: PropTypes.func.isRequired,
    selectedAccount: PropTypes.string
};

USCCAccountSlideOut.defaultProps = {
    open: true,
    chipData: [],
    selectedAccount: ''
};