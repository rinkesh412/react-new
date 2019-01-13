import React from 'react';
import PropTypes from 'prop-types';
import { FormLayout, RadioButton, RadioButtonGroup, Button, TextArea, Label } from '@nokia-csf-uxr/csfWidgets';
import './sbp-select-platform.styl';
import { formatI18N } from '../../services/i18n-label-service';
import TestTargetProgressTable from '../sbp-progress-table/sbp-test-target-container';
class RadioButtonGroupContainer extends React.Component { // eslint-disable-line
    static propTypes = {
        selectedItem: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }
    constructor() {
        super();
        this.checked = '';
        this.state = {
            nextButton: formatI18N('dsp_sbp_brdcast-next_button_next'),
            selectPlatform: formatI18N('dsp_sbp_brdcast-title_slect_platfrom'),
            docomoPF: formatI18N('dsp_sbp_brdcast_radio-docomo-pf'),
            m2mPF: formatI18N('dsp_sbp_brdcast_radio-m2m_pf')
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event);
        console.log(this.checked);
        if (this.checked === 'dpf') {
            //alert(document.getElementById('docomopf').label);
            document.getElementById('formlayout').style.display = 'none';
            let cname = document.getElementById('text').className;
            cname = cname === 'hide' ? 'show' : cname;
            document.getElementById('text').className = cname;
        } else {
            alert("oops not yet developed");
        }
    }

    onChange = newText => {
        this.setState({
            text: newText.value,
            charCount: newText.value.length,
            error: newText.value.length > 300
        });
    }
    onDleletMsg = newText => {
        this.setState({
            deleteText: newText.value,
            deleteCharCount: newText.value.length,
        });
    }
    ngListMsg = newText => {
        this.setState({
            ngListText: newText.value,
            ngListCount: newText.value.length
        });
    }

    render() {
        return (
            <div>
                <div id="formlayout" className="fieldset">
                    <FormLayout>
                        <Label id="basicLabel" text={this.state.selectPlatform} />
                        <div className="radio">
                            <RadioButtonGroup
                                id="radio-container-id"
                                disabled={false}
                                selectedItem={this.props.selectedItem}
                                name="radiocolorgroup"
                                label={this.props.label}
                                onChange={e => this.checked = e.value}
                            >
                                <RadioButton
                                    label={this.state.docomoPF}
                                    value="dpf"
                                />
                                <RadioButton
                                    label={this.state.m2mPF}
                                    value="mpf"
                                />
                            </RadioButtonGroup>
                        </div>
                        <div id="nextBtn"> 
                            <Button id="default" text={this.state.nextButton} isCallToAction onClick={e => this.handleChange(e)} />
                        </div>
                    </FormLayout>
                </div>

                <div className='hide' id='text'>
                    <div className="flex" className="col-sm-2">
                        <Label id="basicLabel" text='test MSISDN registartion:' />
                        <TextArea
                            id='registartionArea'
                            text={this.state.text}
                            onChange={this.onChange}
                            charCount={this.state.charCount}
                        />
                    </div>
                    <div id="submitBtn">
                        <Button id="default" text="Submit" />
                    </div>
                    <div>
                        <Label id="basicLabel" text='Message for deleted MSISDN: ' />
                        <TextArea
                            id='deletedArea'
                            text={this.state.deleteText}
                            onChange={this.onDleletMsg}
                            charCount={this.state.deleteCharCount}
                        />
                    </div>
                    <div>
                        <Label id="basicLabel" text='NG list: ' />
                        <TextArea
                            id='ngListArea'
                            text={this.state.ngListText}
                            onChange={this.ngListMsg}
                            charCount={this.state.ngListCount}
                        />
                    </div>
                    <div>
                        <TestTargetProgressTable />
                    </div>

                </div>
            </div>
        );
    }
}

export default RadioButtonGroupContainer;