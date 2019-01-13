import React from 'react';
import PropTypes from 'prop-types';
import { FormLayout, RadioButton, RadioButtonGroup, Button, TextArea, Label } from '@nokia-csf-uxr/csfWidgets';
import './fota-select-platform.styl';
import { formatI18N } from '../../services/i18n-label-service';
import TestTargetProgressTable from '../fota-um-upload-test-target-list/fota-um-progress-table/fota-um-test-target-container';

const NUMBER = /^[0-9]*$/;
const NUMBER_WITH_WILD = /^[0-9?]*$/;
const LETTERS = /^[a-z][a-z\s]*$/
const NUMBERANDLETTERES = /^([a-zA-Z0-9 _-]+)$/
const SPACES = /^\s+$/
class UploadTestTargetlist extends React.Component { // eslint-disable-line
    static propTypes = {
        selectedItem: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }

    constructor() {
        super();
        this.checked = '';
        this.textAreaVal = '';
        this.state = {
            nextButton: formatI18N('dsp_sbp_brdcast-next_button_next'),
            selectPlatform: formatI18N('dsp_sbp_brdcast-title_slect_platfrom'),
            docomoPF: formatI18N('dsp_sbp_brdcast_radio-docomo-pf'),
            m2mPF: formatI18N('dsp_sbp_brdcast_radio-m2m_pf'),
            pleaseinputtestMSISDN: formatI18N('dsp_fota_um_label_please_input_test_msisdn'),
            testMSISDNregistartion: formatI18N('dsp_fota_um_label_test_msisdn_registarion'),
            submit: formatI18N('dsp_fota_um_label_sumit'),
            MessagefordeletedMSISDN: formatI18N('dsp_fota_um_message_for_deleted_msisdn'),
            nglist: formatI18N('dsp_fota_um_ng_list'),
            textTestMSISDN: '',
            msisdnError: '',
            errorMsg: '',
            maxCharCount: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event);
        console.log(this.checked);
        if (this.checked === 'dpf') {
            ///alert(document.getElementById('docomopf').label);
            document.getElementById('formlayout').style.display = 'none';
            document.getElementById('pdf').removeAttribute("className", "pdfhide")
            document.getElementById('pdf').style.display = 'block';
        } else if (this.checked === 'm2m') {
            document.getElementById('formlayout').style.display = 'none';
            document.getElementById('m2m').removeAttribute("className", "m2mhide")
            document.getElementById('m2m').style.display = 'block';
        }
    }

    onChangeTestMSISDN = newText => {
        let textMsg = newText.value;
        this.textAreaVal = textMsg;
        this.setState({
            textTestMSISDN: textMsg,
        });
    }

    validateSubmitCondition = e => {
        let textMsg = this.textAreaVal;
        console.log("inside submit validation" + this.textAreaVal);
        if (textMsg.match(NUMBER)) {
            console.log("Number only" + textMsg);
            this.setState({
                textTestMSISDN: textMsg,
                msisdnError: true,
                errorMsg: 'incorrect Digits',
                //maxCharCount: 11
            });
        }
        if (textMsg.includes('.')) {
            console.log("Dot only" + textMsg);
            this.setState({
                textTestMSISDN: textMsg,
                msisdnError: true,
                errorMsg: 'Terminal number illegal',
                //maxCharCount: 11
            });
        }

        if (textMsg.includes(" ")) {
            console.log("Dot space only" + textMsg);
            this.setState({
                textTestMSISDN: textMsg,
                msisdnError: true,
                errorMsg: 'Terminal number illegal',
                //maxCharCount: 11
            });
        }

        if (textMsg.includes('.')) {
            console.log("Dots only" + textMsg);
            this.setState({
                textTestMSISDN: textMsg,
                msisdnError: true,
                errorMsg: 'Terminal number illegal',
                //maxCharCount: 11
            });
        }

        if (textMsg.match(SPACES)) {
            console.log("Spaces only" + textMsg);
            this.setState({
                textTestMSISDN: textMsg,
                msisdnError: true,
                errorMsg: 'Terminal number illegal',
                //maxCharCount: 11
            });
        }

        if (textMsg.match(LETTERS)) {
            console.log("Letters only" + textMsg);
            this.setState({
                textTestMSISDN: textMsg,
                msisdnError: textMsg.length >= 81,
                errorMsg: 'Comment Character Count 81 characters or more',
                maxCharCount: 81
            });
        }
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
        const ColoredLine = ({ color }) => (<hr style={{ color: color, backgroundColor: color, height: 1 }} />);
        return (
            <div>
                <FormLayout>
                    <div id="formlayout" >
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
                                    value="m2m"
                                />
                            </RadioButtonGroup>
                        </div>
                        <div id="targetnextBtn">
                            <Button id="default" text={this.state.nextButton} isCallToAction onClick={e => this.handleChange(e)} />
                        </div>
                    </div>
                </FormLayout>
                <div id="pdftestMessage">
                    <FormLayout>
                        <div className='pdfhide' id='pdf'>
                            <div className="row">
                                <div className="col-sm-12">
                                    <Label id="basicLabel" text={this.state.pleaseinputtestMSISDN} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-3">
                                    <Label id="basicLabel" text={this.state.testMSISDNregistartion} />
                                </div>
                                <div className="col-sm-3" id="regTextArea">
                                    <TextArea
                                        id='regTextArea'
                                        text={this.state.textTestMSISDN}
                                        onChange={this.onChangeTestMSISDN}
                                        error={this.state.msisdnError}
                                        errorMsg={this.state.errorMsg}
                                        //charCount={this.state.charCount}
                                        maxCharCount={this.state.maxCharCount}
                                    />
                                </div>
                            </div>
                            <div id="targetsubmitBtn">
                                <Button id="default" text={this.state.submit} />
                            </div>
                            <div>
                                <Label id="basicLabel" text={this.state.MessagefordeletedMSISDN} />
                                <TextArea
                                    id='deletedArea'
                                    text={this.state.deleteText}
                                    onChange={this.onDleletMsg}
                                    charCount={this.state.deleteCharCount}
                                />
                            </div>
                            <div>
                                <Label id="basicLabel" text={this.state.nglist} />
                                <div id="testngListArea">
                                    <TextArea
                                        id='ngListArea'
                                        text={this.state.ngListText}
                                        onChange={this.ngListMsg}
                                        charCount={this.state.ngListCount}
                                        errorMsg={this.state.errorMsg}
                                    />
                                </div>
                            </div>
                            <div id="dottedLine">
                                <ColoredLine color="dotted" />
                            </div>
                            <div>
                                <TestTargetProgressTable />
                            </div>
                        </div>

                    </FormLayout>
                </div>
            </div>

        );
    }
}

export default UploadTestTargetlist;