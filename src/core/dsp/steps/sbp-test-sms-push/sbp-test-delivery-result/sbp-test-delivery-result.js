/* eslint-disable no-inline-comments */
import React from 'react';
import './sbp-test-delivery-result.styl';
import { formatI18N } from '../../../services/i18n-label-service';
import PropTypes from 'prop-types';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';
import { Button, FormLayout } from '@nokia-csf-uxr/csfWidgets';
export default class SBPTestDeliveryResultStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deliveryResultData: [],
            currentRowNum: '1',
            localDev: false,
            curTime: '',
            testDeliveryResultData: {},
            totalNoOfretries: 100,
            milliSecondsBetweenRetries: 30000,
            retriedCount: 0,
            stillRetryingFlag: false,
            isJsoError: false,
            MSISDN: props.receivedData ? props.receivedData.MSISDN : '',
            IMEI: props.receivedData ? props.receivedData.IMEI : '',
            title: props.receivedData ? props.receivedData.inputTitle : '',
            cautionText: props.receivedData ? props.receivedData.cautionText : '',
            selectedItemRO: props.receivedData ? props.receivedData.selectedItemRO : '',
            selectedItemDenied: props.receivedData ? props.receivedData.selectedItemDenied : '',
            selectedItemODB: props.receivedData ? props.receivedData.selectedItemODB : '',
            smsDeliveryResultSectionHeader: formatI18N('dsp_sbp_sms-push-test_header_sms-delivery-result'),
            managementNumberTableHeader: formatI18N('dsp_sbp_sms-push-test_header_management-number'),
            msisdnTableHeader: formatI18N('dsp_sbp_sms-push-test_header_msisdn'),
            imeiTableHeader: formatI18N('dsp_sbp_sms-push-test_header_imei'),
            operationTableHeader: formatI18N('dsp_sbp_sms-push-test_header_operation'),
            instructionContentTableHeader: formatI18N('dsp_sbp_sms-push-test_header_instruction-content'),
            signalTypeTableHeader: formatI18N('dsp_sbp_sms-push-test_header_signal-type'),
            sendReceiveDateTableHeader: formatI18N('dsp_sbp_sms-push-test_header_send-receive-date'),
            statusTableHeader: formatI18N('dsp_sbp_sms-push-test_header_status'),
            controlResultTableHeader: formatI18N('dsp_sbp_sms-push-test_header_control-result'),
            factorTableHeader: formatI18N('dsp_sbp_sms-push-test_header_factor'),
            detailTableHeader: formatI18N('dsp_sbp_sms-push-test_header_detail'),
            updateButtonLabel: formatI18N('dsp_sbp_sms-push-test_label_update'),
            infoUpdateBtnLabel: formatI18N('dsp_sbp_sms-push-test_label_update'),
            userDuringROSubGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_user-ro'),
            deniedUserSubGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_denied-user'),
            userDuringODBSubGroupHeader: formatI18N('dsp_sbp_sms-push-test_header_user-odb'),
            deliveryResult000MapValue: formatI18N('dsp_sbp_sms-push-delivery-result-000'),
            deliveryResult001MapValue: formatI18N('dsp_sbp_sms-push-delivery-result-001'),
            deliveryResult002MapValue: formatI18N('dsp_sbp_sms-push-delivery-result-002'),
            deliveryResult003MapValue: formatI18N('dsp_sbp_sms-push-delivery-result-003'),
            deliveryResult004MapValue: formatI18N('dsp_sbp_sms-push-delivery-result-004'),
            deliveryResultNAMapValue: formatI18N('dsp_sbp_sms-push-delivery-result-NA'),
        };

    }
    updatedRowNum = () => {
        let updatedRowNum = this.state.currentRowNum + 1;
        this.setState({ currentRowNum: updatedRowNum });
    }

    componentDidMount() {

        let params = [];
        setInterval(() => {
            this.setState({
                curTime: new Date().toLocaleString()
            });
        }, 1000);

        if (!this.state.localDev) {
            params = [
                {
                    'name': 'sessionId',
                    'value': this.props.receivedData.sessionId
                } ];
            console.log('Calling SO_SBP_PollForSMSResult componentDidMount sessionId', this.props.receivedData.sessionId);
        }
        this.setState({ stillRetryingFlag: true });

        /*   if (this.props.sessionId !== '0') { */
        console.log('Calling SO_SBP_PollForSMSResult inside componentDiMount>>', this.props.receivedData.sessionId);
        setTimeout(() => {
            console.log('Calling after Settime of 1 Min >>');
            this.executeServiceOperationAdapter('SO_SBP_PollForSMSResult', params);
            this.setState({ stillRetryingFlag: false });
        }, 30000);


        /*   } */

    }

    executeServiceOperationAdapter(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.jsoCalled = jsoName;
        console.log('Going to execute JSO', jsoName);

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
                let soResult = SBPTestDeliveryResultStep.getDerivedStateFromProps(this.props, this.state);
                console.log('Calling after Settime out soResult>>', soResult);
                this.setState(soResult);
            }, 1000);
        }

    }

    // Step 3 - LocalDev - Gettin Data and Setting in Polling response
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName, jsoParams).then(data => {
            console.log('Here');
            // this.props.pollingResponse = data;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }
    componentDidUpdate() {
        console.log('Inside componentDidUpdate pollForSMSResult');
        if (this.state.nextFunctionToCall === 'pollForSMSResult') {
            console.log('Calling  pollForSMSResult with Session ID', this.props.receivedData.sessionId);
            setTimeout(() => {
                let params = [
                    {
                        'name': 'sessionId',
                        'value': this.props.receivedData.sessionId
                    } ];
                this.executeServiceOperationAdapter('SO_SBP_PollForSMSResult', params);
                this.setState({ nextFunctionToCall: 'NA' });
            }, this.state.milliSecondsBetweenRetries);

        }


        if (this.state.messageOnUI !== '') {
            setTimeout(() => {
                console.log('Clear Messae on UI');
                this.setState({ messageOnUI: '', jsoCalled: 'NA' });
            }, 3000);
        }

    }
    // Step 4 - Impelement getDerivedStateFromProps
    static getDerivedStateFromProps(props, state) {
        // let newstate = {};
        console.log('Delivery result getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        // console.log('Delivery result getDerivedStateFromProps call back state >> ', state);
        // console.log('Delivery result getDerivedStateFromProps call back props >> ', props);
        let resultsFromFetchJSO;
        let operationResult;
        // If SO_SBP_SendSMSMessageForTest is called
        console.log('Jso Action ', state.jsoCalled);
        if (state.jsoCalled === 'SO_SBP_PollForSMSResult') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    resultsFromFetchJSO = state.resultsFromFetchJSO[state.jsoCalled].results.properties.sessionId;
                    console.log('Prad Data from JSO via Fetch', resultsFromFetchJSO);
                    return { testDeliveryResultData: resultsFromFetchJSO };
                }

            } else {
                if (props.getResults('SO_SBP_PollForSMSResult')) {
                    operationResult = props.getResults('SO_SBP_PollForSMSResult').results.result.value;
                    if (operationResult === '3') {
                        resultsFromFetchJSO = props.getResults('SO_SBP_PollForSMSResult').results.properties.resultData;
                        console.log('Test Delivery result JSO via SO >> ', resultsFromFetchJSO);
                        return { isJsoError: false, testDeliveryResultData: resultsFromFetchJSO, stillRetryingFlag: false, retriedCount: 0 };
                    } else {
                        console.log('Test Delivery result >> ERROR', operationResult);
                        return { isJsoError: true, stillRetryingFlag: false, messageOnUI: props.getResults('SO_SBP_PollForSMSResult').results.resolution.value, retriedCount: 0 };
                    }
                } else {
                    // No result found. Retry
                    console.log('Test Delivery No Results Found.. Going to retry');

                    /*  let retriedCountLocal = state.retriedCount + 1;
                    return { nextFunctionToCall: 'pollForSMSResult', retriedCount: retriedCountLocal, stillRetryingFlag: true }; */

                    if (state.retriedCount <= state.totalNoOfretries) {
                        console.log('Retry No >> ', state.retriedCount);
                        let retriedCountLocal = state.retriedCount + 1;
                        return { nextFunctionToCall: 'pollForSMSResult', retriedCount: retriedCountLocal, stillRetryingFlag: true };
                    } else {
                        return { nextFunctionToCall: 'NA', stillRetryingFlag: false  };
                    }
                }

            }
        }

        return null;
    }


    onClickExecuteBtn = () => {
        console.log('Calling Execution button Manually');
        this.setState({ retriedCount: 0 });
        let params = [
            {
                'name': 'sessionId',
                'value': this.props.receivedData.sessionId
            } ];
        this.executeServiceOperationAdapter('SO_SBP_PollForSMSResult', params);
    }

    render() {

        return (
            <div>
                { this.state.isJsoError ? (<div> Erorr has occured...{this.state.messageOnUI}</div>) : (
                    this.state.stillRetryingFlag ? (
                        <div> Waiting for Response from FSCP... {this.state.curTime}</div>
                    ) : (
                        <div>
                            <div className="manage-broadcast-detail-table-container">

                                <div className="manage-broadcast-detail-table-column">
                                    <div className="manage-broadcast-detail-table-rowFlex row-header rowspan2">
                                        {this.state.managementNumberTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex  row-data rowspan2">
                                        {this.state.currentRowNum}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex  row-data rowspan2">
                                        {this.state.currentRowNum}
                                    </div>

                                </div>

                                <div className="manage-broadcast-detail-table-column">
                                    <div className="manage-broadcast-detail-table-rowFlex row-header">
                                        {this.state.msisdnTableHeader}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.imeiTableHeader}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data" >
                                        {this.state.MSISDN}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        {this.state.IMEI}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data" >
                                        {this.state.MSISDN}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        {this.state.IMEI}
                                    </div>
                                </div>


                                <div className="manage-broadcast-detail-table-column">
                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.operationTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.instructionContentTableHeader}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data">

                                        <b>JSO change*</b>
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        <span> {this.state.title} <br />
                                            {this.state.userDuringROSubGroupHeader}: {this.state.selectedItemRO} <br />
                                            {this.state.deniedUserSubGroupHeader}: {this.state.selectedItemDenied} <br />
                                            {this.state.userDuringODBSubGroupHeader}: {this.state.selectedItemODB} </span>
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        <b>JSO change*</b>
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        <span> {this.state.title} <br />
                                            {this.state.userDuringROSubGroupHeader}: {this.state.selectedItemRO} <br />
                                            {this.state.deniedUserSubGroupHeader}: {this.state.selectedItemDenied} <br />
                                            {this.state.userDuringODBSubGroupHeader}: {this.state.selectedItemODB} </span>
                                    </div>
                                </div>

                                <div className="manage-broadcast-detail-table-column">
                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.signalTypeTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.sendReceiveDateTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        {this.state.testDeliveryResultData.requestControlResult === '0000'? this.state.deliveryResult000MapValue:
                                            this.state.testDeliveryResultData.requestControlResult === '0001'?this.state.deliveryResult001MapValue:
                                                this.state.testDeliveryResultData.requestControlResult === '0002'?this.state.deliveryResult002MapValue:
                                                    this.state.testDeliveryResultData.requestControlResult === '0003'?this.state.deliveryResult003MapValue:
                                                        this.state.testDeliveryResultData.requestControlResult === '0004'?this.state.deliveryResult004MapValue:
                                                            this.state.deliveryResultNAMapValue
                                        }
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        {this.state.testDeliveryResultData.requested}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        {this.state.testDeliveryResultData.requestControlResult === '0000'? this.state.deliveryResult000MapValue:
                                            this.state.testDeliveryResultData.requestControlResult === '0001'?this.state.deliveryResult001MapValue:
                                                this.state.testDeliveryResultData.requestControlResult === '0002'?this.state.deliveryResult002MapValue:
                                                    this.state.testDeliveryResultData.requestControlResult === '0003'?this.state.deliveryResult003MapValue:
                                                        this.state.testDeliveryResultData.requestControlResult === '0004'?this.state.deliveryResult004MapValue:
                                                            this.state.deliveryResultNAMapValue
                                        }
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        {this.state.testDeliveryResultData.callbackReceived}
                                    </div>
                                </div>

                                <div className="manage-broadcast-detail-table-column">
                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.statusTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.controlResultTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        {this.state.testDeliveryResultData.requestStatus}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        {this.state.testDeliveryResultData.requestControlResult}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        {this.state.testDeliveryResultData.requestStatus}
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        {this.state.testDeliveryResultData.requestControlResult}
                                    </div>
                                </div>

                                <div className="manage-broadcast-detail-table-column">
                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.factorTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                                        {this.state.detailTableHeader}
                                    </div>

                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        <b>JSO change*</b>
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                                        <b>JSO change*</b>
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        <b>JSO change*</b>
                                    </div>
                                    <div className="manage-broadcast-detail-table-rowFlex content-height-align">
                                        <b>JSO change*</b>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <FormLayout >
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <Button id="infoUpdateBtn" text={this.state.infoUpdateBtnLabel} isCallToAction onClick={this.onClickExecuteBtn} />
                                        </div>
                                    </div>
                                </FormLayout>
                            </div>

                        </div>

                    ))}
            </div>

        );
    }
}

SBPTestDeliveryResultStep.propTypes = {
    receivedData: PropTypes.object,
    sessionId: PropTypes.string,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
};