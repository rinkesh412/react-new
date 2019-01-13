import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatI18N } from '../../../services/i18n-label-service';
import { FormLayout, Label, TextInput, TextArea, RadioButtonGroup, RadioButton, Button } from '@nokia-csf-uxr/csfWidgets';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';

import './sbp-test-multicast-push.styl';
const NUMBER = /^[0-9]*$/;
let invalidFlag = false;
let invalidMS = false;
let invalidIM = false;
let msLenMismatch = false;
let imLenMismatch = false;
export default class SBPTestMulticastPushStep extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        localDev: false,
        jsoCalled: 'NA',
        messageOnUI: '',
        resultsFromFetchJSO: {},
        nextFunctionToCall: 'NA',
        inputMSISDN: '',
        inputIMEI: '',
        isMsisdnRequired: false,
        inputTitle: this.props.receivedData ? this.props.receivedData.title : 'Testing Title',
        inputCautionText: this.props.receivedData ? this.props.receivedData.cautionText : 'Testing Text',
        cautionText: this.props.receivedData ? this.props.receivedData.cautionText : 'Testing Text',
        selectedItemRO: 'Send',
        selectedItemDenied: 'Send',
        selectedItemODB: 'Do not Send',
        sessionIdForPushTask: '0',
        multicastPushTestSectionHeader: formatI18N('dsp_sbp_sms-push-test_header_multicast-push-test'),
        msisdnLabel: formatI18N('dsp_sbp_sms-push-test_label_msisdn'),
        imeiLabel: formatI18N('dsp_sbp_sms-push-test_label_imei'),
        titleLabel: formatI18N('dsp_sbp_sms-push-test_label_title'),
        cautionTextLabel: formatI18N('dsp_sbp_sms-push-test_label_caution-text'),
        sendPermissionsettingGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_send-permission-setting'),
        userDuringROSubGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_user-ro'),
        deniedUserSubGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_denied-user'),
        userDuringODBSubGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_user-odb'),
        sendLabel: formatI18N('dsp_sbp_sms-push-test_label_send'),
        notSendLabel: formatI18N('dsp_sbp_sms-push-test_label_not-send'),
        executeButtonLabel: formatI18N('dsp_sbp_sms-push-test_label_execute'),
        msisdnRequiredMessage: formatI18N('dsp_sbp_sms-push-test_message_msisdn-required'),
        msisdnIncorrectMessage: formatI18N('dsp_sbp_sms-push-test_message_msisdn-incorrect'),
        imeiIncorrectMessage: formatI18N('dsp_sbp_sms-push-test_message_imei-incorrect'),
        incorrectMessage: formatI18N('dsp_sbp_sms-push-test_message_incorrect-digits')
    };
 
    onChangeMSISDN = newText => {
        let msisdnValue = newText.value;
        msisdnValue = parseInt(msisdnValue,10);
        let msisdnLen = msisdnValue.toString().length;
        msLenMismatch = msisdnLen > 10;
        this.setState({ inputMSISDN: newText.value });
        this.setState({isMsisdnRequired: false});
        invalidFlag = false;
        invalidMS = false;
    };

    onChangeIMEI = newText => {
        imLenMismatch = newText.value.length > 14
        this.setState({ inputIMEI: newText.value });
        this.setState({isMsisdnRequired: false});
        invalidFlag = false;
        invalidIM = false;
    };
    
    handlePermissionSetting = event => {
        this.setState({ checked: event.value });
    }
    
    validateRequiredFields = () => {
        let msisdn = this.state.inputMSISDN;
        let excludeZeroMS = msisdn.replace(/^0+/, '');
        if (this.state.inputMSISDN === null || this.state.inputMSISDN === '' || this.state.inputMSISDN === 'undefined') {
            this.setState({isMsisdnRequired: true});
            invalidFlag = true;
            invalidMS = false;
        } else if (msisdn !== '' && excludeZeroMS.length !== 10 ) {
            this.setState({isMsisdnRequired: false});
            invalidFlag = false;
            invalidMS = true;
        } else {
            this.setState({isMsisdnRequired: false});
            invalidFlag = false;
            invalidMS = false;
        }
        if (this.state.inputIMEI !== '' && this.state.inputIMEI.length !== 14) {
            invalidIM = true;
        } else {
            invalidIM = false;
        }

        if (!invalidFlag && !invalidMS && !invalidIM) {
            this.setExecuteParams();
        } else {
            console.log('form has validation errors');
        }
    }
    setExecuteParams = () => {
            let paramsNewRegister = [
                {
                    'name': 'msisdn',
                    'value': this.state.inputMSISDN
                },
                {
                    'name': 'imei',
                    'value': this.state.inputIMEI
                },
                {
                    'name': 'subject',
                    'value': this.state.inputTitle
                },
                {
                    'name': 'body',
                    'value': this.state.inputCautionText
                },
                {
                    'name': 'allowInROUser',
                    'value': this.state.selectedItemRO === 'Send'? true:false
                },
                {
                    'name': 'allowUsersBlockingSpams',
                    'value': this.state.selectedItemRO === 'Send'? true:false
                },
                {
                    'name': 'allowInODBUser',
                    'value': this.state.selectedItemODB === 'Send'? true:false
                }
            ];

            console.log('onClickExecuteBtn state', paramsNewRegister);
            this.executeServiceOperationAdapter('SO_SBP_SendSMSMessageForTest', paramsNewRegister);
    }
    onChangeRO = event => {
        this.setState({ selectedItemRO: event.value });
    };

    onChangeDenied = event => {
        this.setState({ selectedItemDenied: event.value });
    };

    onChangeODB = event => {
        this.setState({ selectedItemODB: event.value });
    }
    
        executeServiceOperationAdapter(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.jsoCalled= jsoName;

        if (this.state.localDev) {
            console.log('Calling JSO - using Fetch');
            this.executeLocalDevSOTestMessages(jsoName, jsoParams);
        } else {
            console.log('Calling JSO - using Servi', jsoName);
            this.props.executeServiceOperation(jsoName, jsoParams);
        }
        //  We call getDerivedStateFromProps. But update state only for local Dev
        if (this.state.localDev) {
            setTimeout(() => {
                console.log('Calling after Settime out >>');
                let soResult = SBPTestMulticastPushStep.getDerivedStateFromProps(this.props, this.state);
                console.log('Calling after Settime out soResult>>', soResult);
                this.setState(soResult);


            }, 1000);
        }

    }

    // Step 3 - LocalDev - Gettin Data and Setting in Polling response
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName,  jsoParams).then(data => {
            console.log('Here');
            // this.props.pollingResponse = data;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }

    // Step 4 - Impelement getDerivedStateFromProps
    static getDerivedStateFromProps(props, state) {
        // let newstate = {};
        console.log('Multicast Push getDerivedStateFromProps call back poll reponse', props.pollingResponse);

        /* console.log('Multicast Push getDerivedStateFromProps call back state >> ', state);
        console.log('Multicast Push getDerivedStateFromProps call back props >> ', props);
        console.log('Jso Action ', state.jsoCalled); */

        let sessionIdForPushTaskFromResult;
        let operationResult;
        // If SO_SBP_SendSMSMessageForTest is called
        if (state.jsoCalled === 'SO_SBP_SendSMSMessageForTest') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    sessionIdForPushTaskFromResult = state.resultsFromFetchJSO[state.jsoCalled].results.properties.sessionId;
                    // console.log('Prad Data from JSO via Fetch', sessionIdForPushTaskFromResult);
                    return { jsoCalled: '', sessionIdForPushTask: sessionIdForPushTaskFromResult };
                }

            } else  {
                if (props.getResults('SO_SBP_SendSMSMessageForTest')) {
                    operationResult = props.getResults('SO_SBP_SendSMSMessageForTest').results.result.value;
                    if (operationResult === '3') {
                        sessionIdForPushTaskFromResult = props.getResults('SO_SBP_SendSMSMessageForTest').results.properties.sessionId;
                        console.log('Session Id created for SMSMessagetest >> ', sessionIdForPushTaskFromResult);
                        return { sessionIdForPushTask: sessionIdForPushTaskFromResult, messageOnUI: 'Session ID'+ sessionIdForPushTaskFromResult + 'Created succesfully' };
                    } else {
                        return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }

            }
        }

        return null;
    }

    componentDidUpdate() {
        if (this.state.jsoCalled === 'SO_SBP_SendSMSMessageForTest' && this.state.messageOnUI !== '') {
            setTimeout(() => {
                console.log('Clear Messae on UI - Test Multicast Push Message');
                this.setState({ messageOnUI: '' });
            }, 3000);
        }

        if (this.state.jsoCalled === 'SO_SBP_SendSMSMessageForTest' && this.state.sessionIdForPushTask !== '0') {
            let msisdnParam = this.state.inputMSISDN;
            if (msisdnParam) {
                this.props.nextHandler && this.props.nextHandler({
                    data: {
                        MSISDN: this.state.inputMSISDN,
                        IMEI: this.state.inputIMEI,
                        title: this.state.title,
                        inputTitle: this.state.inputTitle,
                        cautionText: this.state.cautionText,
                        selectedItemRO: this.state.selectedItemRO,
                        selectedItemDenied: this.state.selectedItemDenied,
                        selectedItemODB: this.state.selectedItemODB,
                        sessionId: this.state.sessionIdForPushTask
                    }
                });

                this.setState({ jsoCalled: 'NA' });
            } else {
                this.setState({ messageOnUI: 'Not a valid MSISDN Number' });
            }
        }

    }
   
    render() {
        return (
            <div className="push-test-form">
                <FormLayout >

                    <div>
                        <span id="SbpTestMultiPushNotifyArea"> {this.state.messageOnUI} </span>
                    </div>

                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="msisdnLabel" text={this.state.msisdnLabel} />
                        </div>
                        <div className="col-sm-3">
                            <TextInput
                                text={this.state.inputMSISDN}
                                id="TextInputID1" focus
                                onChange={this.onChangeMSISDN}
                                error={msLenMismatch}
                                errorMsg={this.state.incorrectMessage}
                                inputPattern={ NUMBER }
                                minCharCount={10}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="imeiLabel" text={this.state.imeiLabel} />
                        </div>
                        <div className="col-sm-4">
                            <TextInput
                                text={this.state.inputIMEI}
                                id="TextInputID2"
                                onChange={this.onChangeIMEI}
                                error = {imLenMismatch}
                                errorMsg={this.state.incorrectMessage}
                                inputPattern={ NUMBER }
                                maxCharCount={14}
                            />
                        </div>
                        <div className="col-sm-3 align">
                            <span>※Optional</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="titleLabel" text={this.state.titleLabel} />
                        </div>
                        <div className="col-sm-5">
                            <TextInput
                                text={this.state.inputTitle}
                                id="TextInputID3"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="cautionTextLabel" text={this.state.cautionTextLabel} />
                        </div>
                        <div className="col-sm-6">
                            <TextArea
                                text={this.state.inputCautionText}
                                id="TextAreaInputID4"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="permissionSetLabel" text={this.state.sendPermissionsettingGroupHeader} />
                        </div>
                        <div className="col-sm-2">
                            <RadioButtonGroup id="user-during-RO-ButtonGroup" name="RO" label={this.state.userDuringROSubGroupHeader}
                                selectedItem={this.state.selectedItemRO} onChange = {this.onChangeRO}
                            >
                                <RadioButton id="ro-option1" label={this.state.sendLabel} name="selectedItemRO" value="Send" />
                                <RadioButton id="ro-option2" label={this.state.notSendLabel} name="selectedItemRO" value="Do not Send" />
                            </RadioButtonGroup>
                        </div>
                        <div className="col-sm-2">
                            <RadioButtonGroup id="spam-sms-denied-user-ButtonGroup" name="Spam" label={this.state.deniedUserSubGroupHeader}
                                selectedItem={this.state.selectedItemDenied} onChange = {this.onChangeDenied}
                            >
                                <RadioButton id="spam-option1" label={this.state.sendLabel} name="selectedItemDenied" value="Send" />
                                <RadioButton id="spam-option2" label={this.state.notSendLabel} name="selectedItemDenied" value="Do not Send" />
                            </RadioButtonGroup>
                        </div>
                        <div className="col-sm-3">
                            <RadioButtonGroup id="user-during-ODB-ButtonGroup" name="ODB" label={this.state.userDuringODBSubGroupHeader}
                                selectedItem={this.state.selectedItemODB} onChange = {this.onChangeODB}
                            >
                                <RadioButton id="spam-option1" label={this.state.sendLabel} value="Send" />
                                <RadioButton id="spam-option2" label={this.state.notSendLabel} value="Do not Send" />
                            </RadioButtonGroup>
                        </div>
                    </div>
                    <div id="error-msg-id-1">
                        { invalidMS ?
                            <span id="message-area-id-1" className="required-msg-show">
                                {this.state.msisdnIncorrectMessage} <br />
                            </span> : ''
                        }
                        { invalidIM ?
                            <span id="message-area-id-2" className="required-msg-show">
                                {this.state.imeiIncorrectMessage} <br />
                            </span> : ''
                        }
                         { this.state.isMsisdnRequired ?
                            <span id="message-area-id-3" className="required-msg-show">
                                {this.state.msisdnRequiredMessage} <br />
                            </span> : ''
                        }
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Button id="executeBtn" text={this.state.executeButtonLabel} isCallToAction onClick={this.validateRequiredFields} />
                        </div>
                    </div>
                </FormLayout>
            </div>
        );
    }
}
SBPTestMulticastPushStep.propTypes = {
    receivedData: PropTypes.object,
    nextHandler: PropTypes.func,
    backHandler: PropTypes.func,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired
};