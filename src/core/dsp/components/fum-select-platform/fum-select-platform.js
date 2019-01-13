import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout, RadioButton, RadioButtonGroup, Button, TextArea, Label } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from './../../services/i18n-label-service';
import './fum-select-platform.styl';

export default class FumSelectPlatform extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        selectedPf: 'Docomo-PF',
        selectUpdateHeader: formatI18N('dsp_fota_um_select-platform_header_select-update'),
        docomoPfLabel: formatI18N('dsp_fota_um_select-platform_label_docomo'),
        m2mPfLabel: formatI18N('dsp_fota_um_select-platform_label_m2m'),
        nextBtnLabel: formatI18N('dsp_fota_um_select-platform_label_next'),
        skipBtnLabel: formatI18N('dsp_fota_um_select-platform_label_skip')
    }
    onChangeSelectPf = (event) => {
        console.log(this.state.selectedPf);
        this.setState({ selectedPf: event.value });
    }

    render() {
        return(
            <div>
                <FormLayout>
                    <Label id="select-update-label-id" text={this.state.selectUpdateHeader} />
                    <div className="radio"> 
                        <RadioButtonGroup id="radio-container-id" name="platform-select"
                            selectedItem={this.state.selectedPf} onChange = {this.onChangeSelectPf}
                        >
                            <RadioButton id="change-option1" label={this.state.docomoPfLabel} name="selectedPf" value="Docomo-PF" />
                            <RadioButton id="change-option2" label={this.state.m2mPfLabel} name="selectedPf" value="M2M-PF" />
                        </RadioButtonGroup>
                    </div>
                    <div className="button-container">
                        <Button id="nextPFBtn" text={this.state.nextBtnLabel} onClick={() => {this.props.nextModeChange(this.state.selectedPf)}}  isCallToAction /> 
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button id="skipPFBtn" text={this.state.skipBtnLabel} onClick={() => this.props.nextModeChange('Skip')} isCallToAction />
                    </div>
                </FormLayout>  
            </div>
        );
    }
}

FumSelectPlatform.propTypes = {
    nextModeChange: PropTypes.func.isRequired,
}