import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout, RadioButton, RadioButtonGroup, Button, TextArea, Label } from '@nokia-csf-uxr/csfWidgets';
import './fum-select-push-method.styl';
import { formatI18N } from '../../services/i18n-label-service';

let showPush = true;
export default class FumSelectPushMethod extends Component {
    constructor(props) {
        super(props);
        this.checked = ''
    }
    state = {
        selectedMethod: 'PUSH',
        selectedPushMethod: 'PUSH Reservation Setting',
        selectHeader: formatI18N('dsp_fota_um_select-push_header_select-push'),
        selectPushHeader: formatI18N('dsp_fota_um_select-push_header_select-push-method'),
        pushLabel: formatI18N('dsp_fota_um_select-push_label_push'),
        pullLabel: formatI18N('dsp_fota_um_select-push_label_pull'),
        reservationLabel: formatI18N('dsp_fota_um_select-push_label_reservation-setting'),
        individualLabel: formatI18N('dsp_fota_um_select-push_label_individual-sms'),
        listSmsLabel: formatI18N('dsp_fota_um_select-push_label_list-sms')
    }
    onChangeMethod = (event) => {
        this.setState({ selectedMethod: event.value });
        if (event.value === 'PULL') {
            showPush = false;
            document.getElementById('select-push-section').style.display = 'none';
        } else {
            showPush = true;
            document.getElementById('select-push-section').style.display = 'block';
        }
    }

    onChangePushMethod = (event) => {
        this.setState({ selectedPushMethod: event.value });
    }

    handleNextButton = () => {
        if (this.state.selectedMethod === 'PUSH' && showPush) {
            this.props.nextModeChange(this.state.selectedPushMethod);
        } else {
            this.props.nextModeChange(this.state.selectedMethod);
        }
    }

    render() {
        return(
            <div>
                <FormLayout>
                    <Label id="select-method-label-id" text={this.state.selectHeader} />
                    <div className="radio"> 
                        <RadioButtonGroup id="radio-container-id" name="method-select"
                            selectedItem={this.state.selectedMethod} onChange = {this.onChangeMethod}
                        >
                            <RadioButton id="change-option1" label={this.state.pushLabel} name="selectedMethod" value="PUSH" />
                            <RadioButton id="change-option2" label={this.state.pullLabel} name="selectedMethod" value="PULL" />
                        </RadioButtonGroup>
                    </div>
                </FormLayout>
                <FormLayout>
                    <div id="select-push-section" style={{ display: 'block'}}>
                        <Label id="select-push-label-id" text={this.state.selectPushHeader} />
                        <div className="radio"> 
                            <RadioButtonGroup id="radio-container-id" name="push-method-select"
                                selectedItem={this.state.selectedPushMethod} onChange = {this.onChangePushMethod}
                            >
                                <RadioButton id="change-option1" label={this.state.reservationLabel} name="selectedPushMethod" value="PUSH Reservation Setting" />
                                <RadioButton id="change-option2" label={this.state.individualLabel} name="selectedPushMethod" value="Individual SMS Test" />
                                <RadioButton id="change-option3" label={this.state.listSmsLabel} name="selectedPushMethod" value="List SMS" />
                            </RadioButtonGroup>
                        </div>
                    </div>
                    <div className="button-story__column">
                        <Button id="nextPFBtn" text="Next" onClick={this.handleNextButton} isCallToAction />
                    </div>
                </FormLayout>  
            </div>
        );
    }
}

FumSelectPushMethod.propTypes = {
    nextModeChange: PropTypes.func.isRequired,
}