/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormLayout, Button, TextInput, Label, CalendarNew, CheckBox } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from '../../../services/i18n-label-service';
import './fota-um-view-results.styl';
import { AgGridReact } from 'ag-grid-react';
import { getViewResultsData } from  '../../../services/fota-um-hardcoded-data.service';

const fourYearsAfter = moment().add(48, 'month');
const fiveYearsAfter = moment().add(60, 'month');
const sixMonthsPrev = moment().subtract(6, 'month');
const NUMBER = /^[0-9]*$/;
const NUMBER_WITH_WILD = /^[0-9?]*$/;
let invalidMS = false;
let invalidIM = false;

export default class FotaUmViewResults extends Component { //eslint-disable-line
    constructor(props) {
        super(props);

        let columnDefs= [
            {
                headerName: 'Corporate code', field: 'corporateCode', lockPosition: true, width: 50, suppressMenu: true, cellStyle: () => ({ border: '.5px solid black', backgroundColor: 'white' })
            },
            {
                headerName: 'Model', lockPosition: true, width: 50, suppressMenu: true,  
                cellStyle: () => ({ border: '.5px solid black', backgroundColor: 'white' }),
                cellRenderer: this.cellRendererModelData.bind(this)
  
            },
            {
                headerName: 'CR Version',
                marryChildren: true, width: 100,
                children: [
                    { headerName: 'Session ID', lockPosition: true, width: 100, suppressSizeToFit: true, cellStyle: function (params) {
                        return { border: '.5px solid black', backgroundColor: 'white' };
                    },
                    cellRenderer: this.cellRendererCRVersionSessionId.bind(this)
                },
  
  
                ],
                lockPosition: true, width: 100, suppressMenu: true, cellStyle: function (params) {
                    return { border: '.5px solid black', backgroundColor: 'white' };
                },
                
            },
            {
                headerName: 'MSISDN',
                marryChildren: true, width: 60,
                children: [
                    { headerName: 'IMEI',  lockPosition: true, width: 60, editable: true, 
                    cellStyle: function (params) {
                        return { boxSizing: 'border-box', border: '.5px solid black', backgroundColor: 'white' };
                    },  
                    cellRenderer: this.cellRendererIMEI_MSISDN.bind(this)
                    
                },
  
                ],
            },
            {
                headerName: 'Result Date', field: 'resultDate', width: 50, suppressMenu: true, cellStyle: function (params) {
                    return { borderRight: '.5px solid black', borderTop: '.5px solid black', borderBottom: '.5px solid black', backgroundColor: 'white' };
                }
            },
            {
                headerName: 'Result Type', field: 'resultType', width: 50, suppressMenu: true, cellStyle: function (params) {
                    return { border: '.5px solid black', backgroundColor: 'white' };
                }
            },
            {
                headerName: 'Result', field: 'result', width: 50, suppressMenu: true, cellStyle: function (params) {
                    return { border: '.5px solid black', backgroundColor: 'white' };
                }
            },
  
        ];

        this.gridOptions = {
            columnDefs,
            rowHeight:50

        };
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
      rowData: [],

      isRequired: false,
      startDtReq: false,
      endDtReq: false,
      beforeDtError: false,
      showResults: false,

      fotaUmPageHeadingLabel: formatI18N('dsp_fota_um.viewResults.pageHeading'),
      msisdnLabel: formatI18N('docomo.common.msisdnLabel'),
      imeiLabel: formatI18N('docomo.common.imeiLabel'),
      startDateLabel: formatI18N('dsp_fota_um.viewResults.startDateLabel'),
      endDateLabel: formatI18N('dsp_fota_um.viewResults.endDateLabel'),
      searchButtonLabel: formatI18N('dsp_fota_um.viewResults.searchButton'),
      searchConditionLabel: formatI18N('dsp_fota_um.viewResults.searchConditionLabel'),

      
      incorrectMsisdnDigitMsg: formatI18N('dsp_fota_um_viewResults_message_incorrect-msisdn-digits-err'),
      incorrectImeiDigitMsg: formatI18N('dsp_fota_um_viewResults_message_incorrect-imei-digits-err'),
      mandatoryMsg: formatI18N('dsp_fota_um_viewResults_message_mandatory-fields-err'),
      beforeDtErrMsg: formatI18N('dsp_fota_um_viewResults_message_before-dt-err'),
      startDtReqErrMsg: formatI18N('dsp_fota_um_viewResults_message_required-start-dt-err'),
      endDtReqErrMsg: formatI18N('dsp_fota_um_viewResults_message_required-end-dt-err'),

      outputInfo:formatI18N('dsp_fota_um.viewResults.outputInfo'),
      msisdnUserHasPermission:formatI18N('dsp_fota_um.viewResults.msisdnUserHasPermission'),
      imeiUserHasPermission:formatI18N('dsp_fota_um.viewResults.imeiUserHasPermission')

     
  };
  componentDidMount() {

  }
  
  cellRendererCRVersionSessionId(params) {
    var eDiv = document.createElement('div');
    let dataForTable = '<div class="my-css-class">' + params.data.sessionId + '</div>';
    dataForTable = dataForTable +  '<div class="inter-btn-simple">' + params.data.crversion + '</div>';
    eDiv.innerHTML = dataForTable;
    return eDiv;
    }

    cellRendererIMEI_MSISDN(params) {
        var eDiv = document.createElement('div');
        let dataForTable = '<div class="my-css-class">' + params.data.msisdn + '</div>';
        dataForTable = dataForTable +  '<div class="inter-btn-simple">' + params.data.imei + '</div>';
        eDiv.innerHTML = dataForTable;
        return eDiv;
        }

        cellRendererModelData(params) {
        var eDiv = document.createElement('div');
        let dataForTable = '<span>' + params.data.model + '</span>';
        dataForTable = dataForTable +  '<span class="inter-btn-simple">' + params.data.modelName + '</span>';
        dataForTable = dataForTable +  '<span class="inter-btn-simple">' + params.data.subModel + '</span>';
        eDiv.innerHTML = dataForTable;
        return eDiv;
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

  }

    onChangeMSISDN = e => {
        // const re = /^[0-9?\b]+$/;
        let msisdnValue = e.value;
        msisdnValue = msisdnValue.replace(/^0+/, '');
        this.setState({
            textMSISDN: e.value,
            msisdnError: msisdnValue.length > 10,
        });
        // if value is not blank, then test the regex
    /*    if (e.value !== '' || re.test(e.value)) {
            this.setState({
                textMSISDN: e.value,
                msisdnError: msisdnValue.length > 10,
                msisdnErrorMsg: 'Incorrect Digits'
            });
        } */
    }
    onChangeIMEI = e => {
        this.setState({
            textIMEI: e.value,
            imeiError: e.value.length > 14
        });
    }

    
    onChangeStartDate = data => {
        if (data.type === 'onDateChange') {
            this.setState({
                startDateValue: data.value
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


    // eslint-disable-next-line complexity
    validateRequiredFields = queryParam => {
        if (queryParam.msisdn === '' && queryParam.imei === '') {
            this.setState({ isRequired: true });
            invalidMS = false;
            invalidIM = false;
        }  else {
            this.setState({ isRequired: false });
            if (queryParam.msisdn !== '' && (queryParam.msisdn.length !== 10 || queryParam.msisdn.length-queryParam.msisdn.replace(/[?]/g, '').length >= 2)) {
                invalidMS = true;
            } else {
                invalidMS = false;
            }
            if (queryParam.imei !== '' && queryParam.imei.length !== 14) {
                invalidIM = true;
            } else {
                invalidIM = false;
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

        let startDateParam = this.state.startDateValue;
        let endDateParam = this.state.endDateValue;

        let queryParam = {
            msisdn: (msisdnParam === '' || msisdnParam === null) ? '' : msisdnParam,
            imei: (imeiParam === '' || imeiParam === null) ? '' : imeiParam,
            startTimestamp: (isNaN(startDateParam) || startDateParam === null || startDateParam === '') ? '' : Date.parse(startDateParam),
            endTimestamp: (isNaN(endDateParam) || endDateParam === null || endDateParam === '') ? '' : Date.parse(endDateParam),
        };
        this.validateRequiredFields(queryParam);

        if ((queryParam.msisdn !== '' || queryParam.imei !== '') &&
        (queryParam.startTimestamp !== '' && queryParam.endTimestamp !== '')) {
        if (!invalidMS && !invalidIM
        && !this.state.endDtReq && !this.state.startDtReq)
        this.setState({rowData: getViewResultsData(), showResults: true});
        } else {
        console.log('Form has validation errors');
        this.setState({ showResults: false});
        }

      

    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridApi.sizeColumnsToFit();
    }



    render() {
        const ColoredLine = ({ color }) => (<hr style={{ color: color, backgroundColor: color, height: 1 }} />);
        const { startDateValue, endDateValue, isStartOpen, isEndOpen } = this.state;
        return (
            <div>

                <div className="row">
                    <div className="col-sm-12">
                        <div style={{ height: '21px', width: '300px', color: 'rgba(0,0,0,0.87)', fontFamily:
                                    'Nokia Pure Text Medium', padding: '10px 0', fontSize: '30px', fontWeight: 500, lineHeight: '21px' }}
                        >{this.state.fotaUmPageHeadingLabel}</div>
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
                                inputPattern={ NUMBER_WITH_WILD }
                                maxLength={10}
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
                                inputPattern={ NUMBER }
                                maxLength={14}
                            />
                        </div>
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
                                field={{ isVisible: true, width: 250, hasOutline: true, format: 'YYYY-MM-DD HH:mm:ss',
                                    dateIsBlockedMessage: 'Date is inactive', dateIsRequiredMessage: 'Date is required',
                                    toolTip: true, toolTipText: 'Search Start Date', displayTooltipOnFocus: true, }}
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
                    
                    <div className="row">
                    <div className="col-sm-3 label_width">
                            <Label id="outputInfoLabel" text={this.state.outputInfo} />
                        </div>
                        <div className="col-sm-3 label_width">
                        <CheckBox label={this.state.msisdnUserHasPermission} />
                        </div>
                        <div className="col-sm-3 label_width">
                        <CheckBox label={this.state.imeiUserHasPermission} />
                        </div>
                     
                     
                    </div>

                    <div id="error-msg-id-1">
                        { this.state.isRequired ?
                            <span id="message-area-id-1" className="required-msg-show">
                                {this.state.mandatoryMsg} <br />
                            </span> : ''
                        }
                        { this.state.startDtReq ?
                            <span id="message-area-id-2" className="required-msg-show">
                                {this.state.startDtReqErrMsg} <br />
                            </span> : ''
                        }
                        { this.state.endDtReq ?
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

                    </div>
                    <div className="row">
                        <Button id="searchBtn" text={this.state.searchButtonLabel}  onClick={this.validateSearchCondition} isCallToAction />
                    </div>
                </FormLayout>
                {this.state.showResults?  <div style={{ height: 350, padding: 30, overflow: 'hidden' }} >
                    This is Hardcoded Data - JSO  - To be Developed and Integrated.<br></br>
                    <AgGridReact 
                        rowData={this.state.rowData} onGridReady={this.onGridReady} gridOptions={this.gridOptions} id="my-datagrid-id"
                    />
                </div>: ''}
               
            </div>
        );
    }
}
FotaUmViewResults.propTypes = {
    handleChange: PropTypes.func.isRequired,
    userRoles: PropTypes.object.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};