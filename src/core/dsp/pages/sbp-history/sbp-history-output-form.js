import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormLayout, Button, TextInput, Label, CheckBox, CalendarNew } from '@nokia-csf-uxr/csfWidgets';
import AutoComplete from '../../components/model-name-autocomplete/model-name-autocomplete';
import { formatI18N } from './../../services/i18n-label-service';
import './sbp-history-output-form.styl';

const fourYearsAfter = moment().add(48, 'month');
const fiveYearsAfter = moment().add(60, 'month');
const sixMonthsPrev = moment().subtract(6, 'month');
const NUMBER = /^[0-9]*$/;
const NUMBER_WITH_WILD = /^[0-9?]*$/;
let invalidMS = false;
let invalidIM = false;
let invalidModel = false;
export default class SBPExportResults extends Component { //eslint-disable-line
    constructor(props) {
        super(props);
    }
    static propTypes = {
        isStartOpen: PropTypes.bool,
        isEndOpen: PropTypes.bool
    };
    static defaultProps = {
        isStartOpen: false,
        isEndOpen: false
    };
    state = {
        textMSISDN: '',
        textIMEI: '',
        modelName: '',
        enteredModel: '',
        data_auto: [],
        selected: false,
        isCallToAction: false,
        pickedDate: null,
        isStartOpen: false,
        isEndOpen: false,
        startDateValue: null,
        endDateValue: null,
        addedFields: [],
        msisdnError: false,
        imeiError: false,
        invalidModel: false,
        isRequired: false,
        startDtReq: false,
        endDtReq: false,
        beforeDtError: false,
        msisdnLabel: formatI18N('sbp.history.msisdnLabel'),
        imeiLabel: formatI18N('sbp.history.imeiLabel'),
        modelIdLabel: formatI18N('sbp.history.modelIdLabel'),
        startDateLabel: formatI18N('sbp.history.startDateLabel'),
        endDateLabel: formatI18N('sbp.history.endDateLabel'),
        searchExecutionLabel: formatI18N('sbp.history.searchExecution'),
        searchConditionLabel: formatI18N('sbp.history.searchConditionLabel'),
        historyPageHeadingLabel: formatI18N('sbp.history.historyPageHeadingLabel'),
        incorrectMsisdnDigitMsg: formatI18N('dsp_sbp_history_message_incorrect-msisdn-digits-err'),
        incorrectImeiDigitMsg: formatI18N('dsp_sbp_history_message_incorrect-imei-digits-err'),
        incorrectModelMsg: formatI18N('dsp_sbp_history_message_invalid-model'),
        mandatoryMsg: formatI18N('dsp_sbp_history_message_mandatory-fields-err'),
        beforeDtErrMsg: formatI18N('dsp_sbp_history_message_before-dt-err'),
        startDtReqErrMsg: formatI18N('dsp_sbp_history_message_required-start-dt-err'),
        endDtReqErrMsg: formatI18N('dsp_sbp_history_message_required-end-dt-err'),
    };
    componentDidMount() {
        invalidMS = false;
        invalidIM = false;
        invalidModel = false;
        this.executeServiceOperationAdapter('SO_Common_GetDeviceModels', []);
    }

    executeServiceOperationAdapter(jsoName, jsoParams) {
        console.log('Calling JSO - using Servi');
        this.props.executeServiceOperation(jsoName, jsoParams);
        this.setState({
            jsoCalled: jsoName
        });
    }

    static getDerivedStateFromProps(props, state) {
        console.log('Inside getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        console.log('Inside getDerivedStateFromProps call back state >> ', state);
        console.log('Inside getDerivedStateFromProps call back props >> ', props);
        let dataVal = [];
        let newModelList = [];
        if (state.jsoCalled === 'SO_Common_GetDeviceModels') {
            if (props.getResults('SO_Common_GetDeviceModels')) {
                newModelList = props.getResults('SO_Common_GetDeviceModels').results.properties.resultData.items;
                console.log('Get Device Model', newModelList);
                newModelList.map(resultData => {
                    for (var key in resultData) {
                        dataVal.push(key);
                    }
                });
                return { data_auto: dataVal };
            }
        }
    }
    onChangeMSISDN = e => {
        let msisdnValue = e.value;
        if (msisdnValue.length > 0) {
            msisdnValue = parseInt(msisdnValue, 10);
            let msisdnLen = msisdnValue.toString().length;
            this.setState({
                textMSISDN: e.value,
                msisdnError: msisdnLen > 10,
            });
            invalidMS = msisdnLen > 10;
        } else {
            this.setState({
                textMSISDN: e.value,
                msisdnError: false
            });
            invalidMS = false;
        }
    }
    onChangeIMEI = e => {
        this.setState({
            textIMEI: e.value,
            imeiError: e.value.length > 14
        });
        invalidIM = e.value.length > 14;
    }
    handleChange = userInput => {
        this.setState({ modelName: userInput });
    }
    userType = userInput => {
        if (userInput === null || userInput === '') {
            invalidModel = false;
            this.setState({ invalidModel: invalidModel });
        }
        this.setState({ enteredModel: userInput });
    }
    setPickedDate = () => {
        this.setState({
            isStartOpen: false,
            pickedDate: this.state.startDateValue
        });
    }
    resetPickedDate = () => {
        this.setState({
            isStartOpen: false,
            startDateValue: this.state.pickedDate
        });
    }
    setPickedEndDate = () => {
        this.setState({
            isEndOpen: false,
            pickedDate: this.state.endDateValue
        });
    }
    resetPickedEndDate = () => {
        this.setState({
            isEndOpen: false,
            endDateValue: this.state.pickedDate
        });
    }
    onChangeStartDate = data => {
        if (data.type === 'onDateChange') {
            this.setState({
                startDateValue: data.value,
            });
        }
        if (data.type === 'onToggle') {
            this.setState({
                isStartOpen: data.value,
            });
        }
    };
    onChangeEndDate = data => {
        if (data.type === 'onDateChange') {
            this.setState({
                endDateValue: data.value,
            });
        }
        if (data.type === 'onToggle') {
            this.setState({
                isEndOpen: data.value,
            });
        }
    };

    callServiceMethod = queryParam => {
        const url = '/custom-app/rest/sbp/reportSMSDelivery';
        const url_request_param = url + '?startTimestamp=' + queryParam.startTimestamp + '&endTimestamp=' + queryParam.endTimestamp + '&model=' + queryParam.model + '&msisdn=' + queryParam.msisdn + '&imei=' + queryParam.imei;
        window.location.href = url_request_param;
    }
    validateRequiredFields = queryParam => {
        let modelName = this.state.modelName;
        if (queryParam.msisdn === '' && queryParam.imei === '' && queryParam.model === '') {
            this.setState({ isRequired: true });
            invalidMS = false;
            invalidIM = false;
            invalidModel = false;
        } else {
            this.setState({ isRequired: false });
            let excludeZeroMS = queryParam.msisdn.replace(/^0+/, '');
            if (queryParam.msisdn !== '' && (excludeZeroMS.length !== 10 || queryParam.msisdn.length - queryParam.msisdn.replace(/[?]/g, '').length >= 2)) {
                invalidMS = true;
            } else {
                queryParam.msisdn = excludeZeroMS;
                invalidMS = false;
            }
            if (queryParam.imei !== '' && queryParam.imei.length !== 14) {
                invalidIM = true;
            } else {
                invalidIM = false;
            }
            if (queryParam.model !== '' && queryParam.model.toUpperCase() !== modelName.substring(0, 2).toUpperCase()) {
                invalidModel = true;
                this.setState({ invalidModel: invalidModel });
            } else {
                invalidModel = false;
                this.setState({ invalidModel: invalidModel });
            }

        }
        if (queryParam.startTimestamp === '') {
            this.setState({ startDtReq: true });
        } else {
            this.setState({ startDtReq: false });
        }
        if (queryParam.endTimestamp === '') {
            this.setState({ endDtReq: true });
        } else {
            this.setState({ endDtReq: false });
        }
        if (queryParam.startTimestamp !== '' && queryParam.endTimestamp !== '' && !moment(queryParam.startTimestamp).isBefore(queryParam.endTimestamp)) {
            this.setState({ beforeDtError: true });
        } else {
            this.setState({ beforeDtError: false });
        }
    };
    validateSearchCondition = () => {
        let msisdnParam = this.state.textMSISDN;
        let imeiParam = this.state.textIMEI;
        let modelNameParam = this.state.enteredModel;
        let startDateParam = this.state.startDateValue;
        let endDateParam = this.state.endDateValue;

        let queryParam = {
            msisdn: (msisdnParam === '' || msisdnParam === null) ? '' : msisdnParam,
            imei: (imeiParam === '' || imeiParam === null) ? '' : imeiParam,
            model: (modelNameParam === '' || modelNameParam === null || modelNameParam !== 'undefined') ? '' : modelNameParam,
            startTimestamp: (isNaN(startDateParam) || startDateParam === null || startDateParam === '') ? '' : Date.parse(startDateParam),
            endTimestamp: (isNaN(endDateParam) || endDateParam === null || endDateParam === '') ? '' : Date.parse(endDateParam),
        };
        this.validateRequiredFields(queryParam);

        if ((queryParam.msisdn !== '' || queryParam.imei !== '' || queryParam.model !== '') &&
            (queryParam.startTimestamp !== '' && queryParam.endTimestamp !== '')) {
            if (!invalidMS && !invalidIM && !invalidModel && !this.state.isRequired && !this.state.beforeDtError
                && !this.state.endDtReq && !this.state.startDtReq)
                this.callServiceMethod(queryParam);
        } else {
            console.log('Form has validation errors');
        }

    }

    render() {
        const ColoredLine = ({ color }) => (<hr style={{ color: color, backgroundColor: color, height: 1 }} />);
        const { startDateValue, endDateValue, isStartOpen, isEndOpen } = this.state;
        return (
            <div>

                <div className="row">
                    <div className="col-sm-12">
                        <div style={{
                            height: '21px', width: '300px', color: 'rgba(0,0,0,0.87)', fontFamily:
                                'Nokia Pure Text Medium', padding: '10px 0', fontSize: '30px', fontWeight: 500, lineHeight: '21px'
                        }}
                        >{this.state.historyPageHeadingLabel}</div>
                    </div>
                </div>
                <ColoredLine color="black" />
                <FormLayout>
                    <div className="search-condition-headLine">
                        {this.state.searchConditionLabel}
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="msisdnLabel" text={this.state.msisdnLabel} />
                        </div>
                        <div className="col-sm-4">
                            <TextInput
                                text={this.state.textMSISDN}
                                id="TextInputID1" focus
                                onChange={this.onChangeMSISDN}
                                error={this.state.msisdnError}
                                errorMsg={this.state.incorrectDigitMsg}
                                inputPattern={NUMBER_WITH_WILD}
                                maxCharCount={10}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="imeiLabel" text={this.state.imeiLabel} />
                        </div>
                        <div className="col-sm-4">
                            <TextInput
                                text={this.state.textIMEI}
                                id="TextInputID2"
                                onChange={this.onChangeIMEI}
                                error={this.state.imeiError}
                                errorMsg={this.state.incorrectErrMsg}
                                inputPattern={NUMBER}
                                maxCharCount={14}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="modelId" text={this.state.modelIdLabel} />
                        </div>
                        {(this.state.data_auto !== 'undefined') ?
                            <div className="col-sm-3">
                                <AutoComplete suggestionsList={this.state.data_auto} callBackFromParent={this.handleChange} modelName={this.state.modelName} userTypedModelName={this.userType} />
                            </div>
                            :
                            <div className="col-sm-3">
                                <AutoComplete suggestionsList="" callBackFromParent={this.handleChange} modelName={this.state.modelName} userTypedModelName={this.userType} />
                            </div>
                        }
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="startDateLabel" text={this.state.startDateLabel} />
                        </div>
                        <div className="col-sm-6">
                            <CalendarNew id="startDateId" position="top"
                                isTimeFormat24Hr isOpen={isStartOpen} closeOnClickOutside locale="ja"
                                isDayBlocked={month => {
                                    const momentMonth = moment(month);
                                    const momentYear = moment(month);
                                    const isAfter = momentYear.isAfter(fourYearsAfter, 'month');
                                    const isBefore = momentMonth.isBefore(sixMonthsPrev, 'month');
                                    return isAfter || isBefore;
                                }}
                                field={{
                                    isVisible: true, width: 250, hasOutline: true, format: 'YYYY-MM-DD HH:mm:ss',
                                    dateIsBlockedMessage: 'Date is inactive', dateIsRequiredMessage: 'Date is required',
                                    toolTip: true, toolTipText: 'Search Start Date', displayTooltipOnFocus: true,
                                }}
                                timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                                date={startDateValue} onChange={this.onChangeStartDate}
                                modal={{ isModal: false }} required={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="endDateLabel" text={this.state.endDateLabel} />
                        </div>
                        <div className="col-sm-6">
                            <CalendarNew id="endDateId" position="top"
                                isTimeFormat24Hr isOpen={isEndOpen} closeOnClickOutside locale="ja"
                                isDayBlocked={month => {
                                    const momentMonth = moment(month);
                                    const momentYear = moment(month);
                                    const isAfter = momentYear.isAfter(fiveYearsAfter, 'month');
                                    const isBefore = momentMonth.isBefore(sixMonthsPrev, 'month');
                                    return isAfter || isBefore;
                                }}
                                field={{ isVisible: true, width: 250, hasOutline: true, format: 'YYYY-MM-DD HH:mm:ss' }}
                                timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                                date={endDateValue} onChange={this.onChangeEndDate}
                                modal={{ isModal: false }} required={true}
                            />
                        </div>
                    </div>
                    <div id="error-msg-id-1">
                        {this.state.isRequired ?
                            <span id="message-area-id-1" className="required-msg-show">
                                {this.state.mandatoryMsg} <br />
                            </span> : ''
                        }
                        {this.state.startDtReq ?
                            <span id="message-area-id-2" className="required-msg-show">
                                {this.state.startDtReqErrMsg} <br />
                            </span> : ''
                        }
                        {this.state.endDtReq ?
                            <span id="message-area-id-3" className="required-msg-show">
                                {this.state.endDtReqErrMsg} <br />
                            </span> : ''
                        }
                        {
                            this.state.beforeDtError ?
                                <span id="message-area-id-4" className="required-msg-show">
                                    {this.state.beforeDtErrMsg} <br />
                                </span> : ''
                        }
                        {
                            invalidMS ?
                                <span id="message-area-id-5" className="required-msg-show">
                                    {this.state.incorrectMsisdnDigitMsg} <br />
                                </span> : ''
                        }
                        {
                            invalidIM ?
                                <span id="message-area-id-6" className="required-msg-show">
                                    {this.state.incorrectImeiDigitMsg} <br />
                                </span> : ''
                        }
                        {
                            (invalidModel || this.state.invalidModel) ?
                                <span id="message-area-id-7" className="required-msg-show">
                                    {this.state.incorrectModelMsg} <br />
                                </span> : ''
                        }
                    </div>
                    <div className="button-story__column">
                        <Button id="searchBtn" text={this.state.searchExecutionLabel} onClick={this.validateSearchCondition} isCallToAction />
                    </div>
                </FormLayout>
                <ColoredLine color="black" />
            </div>
        );
    }
}
SBPExportResults.propTypes = {
    modelName: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    userRoles: PropTypes.object.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};