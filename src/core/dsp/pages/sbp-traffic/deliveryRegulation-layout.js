/* eslint-disable */
import React from 'react';
import { DataGrid, Button, FormLayout, Fieldset, CalendarNew, TextInput, SelectItem, Label, CheckBoxGroup, CheckBox, AlertDialogInfo } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from './../../services/i18n-label-service';
import PropTypes from 'prop-types';
import './deliveryRegulation-layout.styl';
const hourData = [
    { label: '00', value: '00' },
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' }
];
const minData = [
    { label: '00', value: '00' },
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
    { label: '40', value: '40' },
    { label: '50', value: '50' }
];

class SBPBlackOutWindow extends React.Component {

    cellRendererDeleteButton(params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<span class="my-css-class"><Button id="delete_' + params.data.id + '" class="inter-btn-simple">Delete</Button></span>';
        eDiv.className = "button-story__column";
        var querySelId = '#delete_' + params.data.id;
        var eButton = eDiv.querySelector(querySelId);
        var that = this;
        eButton.addEventListener('click', this.updateDeletedValues.bind(that, params.data.id));
        return eDiv;
    }
    updateDeletedValues(id) {
        console.log('button was clicked!!' + id);
        this.setState({ idTobeDeleted: id });
        this.deleteRowData();
    }

    getDeliveryRegulationData(params) {
        let desc = '';
        let startDate = params.data.startDate;
        let endDate = params.data.endDate;
        let startTime = params.data.startTime;
        let endTime = params.data.endTime;
        if (startDate && startDate != '') {
            desc = desc + startDate.substring(0, 4) + '/' + startDate.substring(5, 7) + '/' + startDate.substring(8, 10) + ' ～ ';
        }
        if (endDate && endDate != '') {
            desc = desc + endDate.substring(0, 4) + '/' + endDate.substring(5, 7) + '/' + endDate.substring(8, 10) + '  ';
        }
        if (startTime && startTime != '') {
            desc = desc + startTime.substring(0, 2) + ':' + startTime.substring(3, 5) + ' ～ ';
        }
        if (endTime && endTime != '') {
            desc = desc + endTime.substring(0, 2) + ':' + endTime.substring(3, 5) + '  ';
        }
        if (params.data.mondayEnabled === 'true') {
            desc = desc + 'Mon' + ',';
        }
        if (params.data.tuesdayEnabled === 'true') {
            desc = desc + 'Tue' + ',';
        }
        if (params.data.wednesdayEnabled === 'true') {
            desc = desc + 'Wed' + ',';
        }
        if (params.data.thursdayEnabled === 'true') {
            desc = desc + 'Thu' + ',';
        }
        if (params.data.fridayEnabled === 'true') {
            desc = desc + 'Fri' + ',';
        }
        if (params.data.saturdayEnabled === 'true') {
            desc = desc + 'Sat' + ',';
        }
        if (params.data.sundayEnabled === 'true') {
            desc = desc + 'Sun';
        }
        desc = desc.slice(0, -1);
        return desc;
    }

    componentDidUpdate() {
        console.log('Inside componentDidUpdate from Blackout window');

        if (this.state.nextFunctionToCall === 'getRegulationPeriod') {
            console.log('componentDidUpdate');
            this.setState({ jsoCalled: 'SO_SBP_GetEmbargoPeriod' });
            this.executeServiceOperationAdapter('SO_SBP_GetEmbargoPeriod', []);
            this.setState({ nextFunctionToCall: 'NA' });
        }

        if (this.state.isJsoError) {
            console.log('An Error has occured. Please contact your Administrator');
            this.setState({ isJsoError: false });
        }

        if (this.state.messageOnUI !== '') {
            setTimeout(() => {
                console.log('Clear Messae on UI');
                this.setState({ messageOnUI: '', jsoCalled: 'NA' });
            }, 3000);
        }
    }
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            localDev: false,
            jsoCalled: 'NA',
            resultsFromFetchJSO: {},
            nextFunctionToCall: 'NA',
            isJsoError: false,
            messageOnUI: '',
            idTobeDeleted: '',
            rowDataNew: this.rowData1,
            checked: true,
            dateRangechecked: true,
            delete: '',
            update: '',
            showAlert: false,
            rowValue: {},
            selectedStartHour: ((Math.round((new Date()).getMinutes()/10)*10) + 10) > 50 ? ('0' + (((new Date()).getHours())+1)).slice(-2) : ('0' + (new Date()).getHours()).slice(-2),
            selectedStartMin: ((Math.round((new Date()).getMinutes()/10)*10) + 10)> 50 ? '00' : (((Math.round((new Date()).getMinutes()/10)*10) + 10) + ''),
            selectedEndHour: ((Math.round((new Date()).getMinutes()/10)*10) + 10)> 50 ? ('0' + (((new Date()).getHours())+1)).slice(-2) : ('0' + (new Date()).getHours()).slice(-2),
            selectedEndMin: ((Math.round((new Date()).getMinutes()/10)*10) + 10)> 50 ? '00' : (((Math.round((new Date()).getMinutes()/10)*10) + 10) + ''),
            monChecked: true,
            tueChecked: true,
            wedChecked: true,
            thuChecked: true,
            friChecked: true,
            satChecked: true,
            sunChecked: true,
            dateChecked: true,
            timeChecked: true,
            weekChecked: true,
            startDateValue: new Date(),
            endDateValue: new Date(),
            getEmbargoPeriod: [],
            isRegister: false,
            deliveryTitle: formatI18N('dsp_sbp_delivery-regulation_page_header_del-reg'),
            deliveryRegNum: formatI18N('dsp_sbp_delivery-regulation_header_del-reg-num'),
            deleteBtn: formatI18N('dsp_sbp_delivery-regulation_header_delete'),
            dateLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-reg-date-label'),
            timeLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-reg-time-label'),
            dayLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-reg-day-label'),
            monLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-mon-label'),
            tueLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-tue-label'),
            wedLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-wed-label'),
            thuLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-thu-label'),
            friLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-fri-label'),
            satLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-sat-label'),
            sunLabel: formatI18N('dsp_sbp_delivery-regulation_label_del-sun-label'),
            startHourLabel: formatI18N('dsp_sbp_delivery-regulation_label_start-hour-label'),
            startMinLabel: formatI18N('dsp_sbp_delivery-regulation_label_start-min-label'),
            endHourLabel: formatI18N('dsp_sbp_delivery-regulation_label_end-hour-label'),
            endMinLabel: formatI18N('dsp_sbp_delivery-regulation_label_end-min-label'),
            registerBtn: formatI18N('dsp_sbp_delivery-regulation_button_register-btn'),
            jsoFailureMsg: formatI18N('dsp_sbp_delivery-regulation_jso_failure_msg'),
            jsoAddSuccessMsg: formatI18N('dsp_sbp_delivery-regulation_jso_add_success_msg'),
            jsoDeleteSuccessMsg: formatI18N('dsp_sbp_delivery-regulation_jso_delete_success_msg'),
            endMinuteDisabled: false,
            startMinuteDisabled: false,
            startHourDisabled: false,
            endHourDisabled: false,
            startDateDisabled: false,
            endDateDisabled: false,
            monDisabled: false,
            tueDisabled: false,
            wedDisabled: false,
            thuDisabled: false,
            friDisabled: false,
            satDisabled: false,
            sunDisabled: false,
        }

        this.results = true;
        const columnDefs = [
            { headerName: formatI18N('dsp_sbp_delivery-regulation_header_del-reg-num'), field: 'id', width: 200, suppressMenu: true },
            {
                headerName: formatI18N('dsp_sbp_delivery-regulation_header_delete'), field: 'deleteButton',
                cellRenderer: this.cellRendererDeleteButton.bind(this)
            },
            {
                headerName: formatI18N('dsp_sbp_delivery-regulation_page_header_del-reg'), field: 'startDate', width: 450,
                cellRenderer: this.getDeliveryRegulationData.bind(this)
            },
        ];
        this.gridOptions = {
            columnDefs,
            enableFilter: false,
            enableSorting: false
        };

    }

    addEmbargoPeriod = () => {
        console.log('Entering executeServiceOperation()123..');

        const params = [{
            'name': 'startDate',
            'value': this.state.startDateValue ? this.formatDate(this.state.startDateValue) : ''
        },
        {
            'name': 'endDate',
            'value': this.state.endDateValue ? this.formatDate(this.state.endDateValue) : ''
        },
        {
            'name': 'startTime',
            'value': this.state.selectedStartHour + ":" + this.state.selectedStartMin
        },
        {
            'name': 'endTime',
            'value': this.state.selectedEndHour + ":" + this.state.selectedEndMin
        },
        {
            'name': 'monday',
            'value': this.state.monChecked
        },
        {
            'name': 'tuesday',
            'value': this.state.tueChecked
        },
        {
            'name': 'wednesday',
            'value': this.state.wedChecked
        },
        {
            'name': 'thursday',
            'value': this.state.thuChecked
        },
        {
            'name': 'friday',
            'value': this.state.friChecked
        },
        {
            'name': 'saturday',
            'value': this.state.satChecked
        },
        {
            'name': 'sunday',
            'value': this.state.sunChecked
        }
        ];
        console.log(params);
        this.setState({ jsoCalled: 'SO_SBP_AddEmbargoPeriod' });
        this.props.executeServiceOperation('SO_SBP_AddEmbargoPeriod', params);
    }

    deleteEmbargoPeriod = () => {
        console.log('Entering executeServiceOperation() value');

        const params = [{
            'name': 'id',
            'value': this.state.idTobeDeleted
        }
        ];
        console.log("Came to Params", params);
        this.setState({ jsoCalled: 'SO_SBP_DeleteEmbargoPeriod' });
        this.props.executeServiceOperation('SO_SBP_DeleteEmbargoPeriod', params);

    }
    /*static getDerivedStateFromProps(props, state) {
        console.log("DerivedState",state);
        console.log("DerivedProps",props);
        const result = props.getResults('SO_SBP_AddEmbargoPeriod');
        console.log("getting the result Value",result)
       console.log("PollingResponse",props);
        if (nextProps.pollingResponse && nextProps.pollingResponse[ 'SO_SBP_AddEmbargoPeriod' ]) {    
            this.props.executeServiceOperation('SO_SBP_GetEmbargoPeriod');
            const result = this.props.getResults('SO_SBP_GetEmbargoPeriod');
            console.log("GetDidMount",result);     
            }
          
 } */

    onGridReady = (params) => {
        this.api = params.value.api;
        this.api.setRowData(this.state.getEmbargoPeriod);
        this.api.sizeColumnsToFit();

    }

    onChange = (dataItem) => {
        this.setState({ checked: dataItem.value });
    };

    onDeleteRowIndexChanged = (params) => {
        console.log("this is called for delete");
        this.setState({ delete: newText.value });
    }

    onUpdateRowIndexChanged = (newText) => {
        this.setState({ update: newText.value });
    }

    setNewRowData = () => {
        this.addEmbargoPeriod();
        console.log("calling setNewRowData");
    }

    deleteRowData = () => {
        console.log("calling deleteRowData");
        this.deleteEmbargoPeriod();
    }
    updateMonState = (e) => {
        console.log(e);
        this.setState({ monChecked: e.value });
    };
    updateTueState = (e) => {
        console.log(e);
        this.setState({ tueChecked: e.value });
    };
    updateWedState = (e) => {
        console.log(e);
        this.setState({ wedChecked: e.value });
    };
    updateThuState = (e) => {
        console.log(e);
        this.setState({ thuChecked: e.value });
    };
    updateFriState = (e) => {
        console.log(e);
        this.setState({ friChecked: e.value });
    };
    updateSatState = (e) => {
        console.log(e);
        this.setState({ satChecked: e.value });
    };
    updateSunState = (e) => {
        console.log(e);
        this.setState({ sunChecked: e.value });
    };
    updateDateState = (e) => {
        console.log(e);
        this.setState({ dateChecked: e.value });
        if (e.value == false) {
            this.setState({ startDateValue: new Date() });
            this.setState({ endDateValue: new Date() });
            this.setState({ startDateDisabled: true });
            this.setState({ endDateDisabled: true });
        } else {
            this.setState({ startDateDisabled: false });
            this.setState({ endDateDisabled: false });
        }
    };
    updateTimeState = (e) => {
        console.log(e);
        this.setState({ timeChecked: e.value });
        if (e.value == false) {
            this.setState({ selectedStartHour: '00' });
            this.setState({ selectedStartMin: '00' });
            this.setState({ selectedEndHour: '00' });
            this.setState({ selectedEndMin: '00' });
            this.setState({ endMinuteDisabled: true });
            this.setState({ startMinuteDisabled: true });
            this.setState({ startHourDisabled: true });
            this.setState({ endHourDisabled: true });
        } else if (e.value == true) {
            this.setState({ endMinuteDisabled: false });
            this.setState({ startMinuteDisabled: false });
            this.setState({ startHourDisabled: false });
            this.setState({ endHourDisabled: false });
        }
    };
    updateWeekState = (e) => {
        console.log(e);
        this.setState({ weekChecked: e.value });
        if (e.value == false) {
            this.setState({ monChecked: false });
            this.setState({ tueChecked: false });
            this.setState({ wedChecked: false });
            this.setState({ thuChecked: false });
            this.setState({ friChecked: false });
            this.setState({ satChecked: false });
            this.setState({ sunChecked: false });
            this.setState({ monDisabled: true });
            this.setState({ tueDisabled: true });
            this.setState({ wedDisabled: true });
            this.setState({ thuDisabled: true });
            this.setState({ friDisabled: true });
            this.setState({ satDisabled: true });
            this.setState({ sunDisabled: true });
        } else if (e.value == true) {
            this.setState({ monDisabled: false });
            this.setState({ tueDisabled: false });
            this.setState({ wedDisabled: false });
            this.setState({ thuDisabled: false });
            this.setState({ friDisabled: false });
            this.setState({ satDisabled: false });
            this.setState({ sunDisabled: false });
        }
    };
    formatDate = date => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('/');
    }


    onChangeStartDate = (e) => {
        this.setState({ startDateValue: e.value });
        console.log(this.state.startDateValue + ":" + e.value);
    };
    onChangeEndDate = (e) => {
        console.log(e);
        this.setState({ endDateValue: e.value });
    };
    onStartHourChange = (e) => {
        console.log(e);
        this.setState({ selectedStartHour: e.value });
    };
    onStartMinChange = (e) => {
        console.log(e);
        this.setState({ selectedStartMin: e.value });
    };
    onEndHourChange = (e) => {
        console.log(e);
        this.setState({ selectedEndHour: e.value });
    };
    onEndMinChange = (e) => {
        console.log(e);
        this.setState({ selectedEndMin: e.value });
    };


    componentDidMount() {
        console.log('Props at componentDidMount ', this.props);
        this.executeServiceOperationAdapter('SO_SBP_GetEmbargoPeriod', []);
    }

    // Step2- Write the Adapter Function
    executeServiceOperationAdapter(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.jsoCalled = jsoName;

        if (this.state.localDev) {
            console.log('Calling JSO - using Fetch');
            this.executeLocalDevSOTestMessages(jsoName, jsoParams);
        } else {
            console.log('Calling JSO - using Servi');
            this.props.executeServiceOperation(jsoName, jsoParams);
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

    // Step 4 - Impelement getDerivedStateFromProps
    static getDerivedStateFromProps(props, state) {
        // let newstate = {};
        console.log('Inside getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        console.log('Inside getDerivedStateFromProps call back state >> ', state);
        console.log('Inside getDerivedStateFromProps call back props >> ', props);
        let embargoData = [];
        let operationResult;

        // If SO_SBP_GetEmbargoPeriod is called
        if (state.jsoCalled === 'SO_SBP_GetEmbargoPeriod') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    embargoData = state.resultsFromFetchJSO[state.jsoCalled].results.properties.resultData;
                    console.log('Data from JSO via Fetch', embargoData);
                    return { getEmbargoPeriod: embargoData };
                }

            } else {
                if (props.getResults('SO_SBP_GetEmbargoPeriod')) {
                    console.log('get Results from JSO', props.getResults('SO_SBP_GetEmbargoPeriod'));
                    if (props.getResults('SO_SBP_GetEmbargoPeriod').results.properties.resultData) {
                        embargoData = props.getResults('SO_SBP_GetEmbargoPeriod').results.properties.resultData.items;
                    }
                    return { getEmbargoPeriod: embargoData };
                }

            }
        } else if (state.jsoCalled === 'SO_SBP_AddEmbargoPeriod') {
            if (state.localDev) {
                return { nextFunctionToCall: 'getRegulationPeriod' };
            } else {
                if (props.getResults('SO_SBP_AddEmbargoPeriod')) {
                    console.log('++++++++++++++++++SO_SBP_AddEmbargoPeriod results++++++', props.getResults('SO_SBP_AddEmbargoPeriod'));
                    operationResult = props.getResults('SO_SBP_AddEmbargoPeriod').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        return { nextFunctionToCall: 'getRegulationPeriod', messageOnUI: 'Delievery Regulation saved Successfully' };
                    } else {
                        return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }
            }
        }

        // If SO_SBP_DeleteEmbargoPeriod is called
        else if (state.jsoCalled === 'SO_SBP_DeleteEmbargoPeriod') {
            if (state.localDev) {
                console.log('To do');
                return null;
            } else {
                if (props.getResults('SO_SBP_DeleteEmbargoPeriod')) {
                    console.log('*******SO_SBP_DeleteEmbargoPeriod results*****', props.getResults('SO_SBP_DeleteEmbargoPeriod'));
                    operationResult = props.getResults('SO_SBP_DeleteEmbargoPeriod').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        return { nextFunctionToCall: 'getRegulationPeriod', messageOnUI: 'Task Deleted Successfully' };
                    } else {
                        return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }
            }

        }

        // newstate.loading = false;
        return null;
    }
    render() {
        const ColoredLine = ({ color }) => (<hr style={{ color: color, backgroundColor: color, height: 1 }} />);
        let toolTipText;
        let label;
        let isOpen;
        let date;
        let labelStyle = {
            padding: '25px 0'
        };
        /* let disabled = false;
         if(this.state.dateChecked) {
             alert(disabled);
             disabled = true;
         } */

        if (this.state.checked) {
            toolTipText = 'Datagrid updates using API';
            label = 'Turn OFF to use API Calls';
            isOpen = false;
            date = null;
        } else {
            toolTipText = 'Datagrid updates using RowData prop';
            label = 'Turn On to use RowData';
            isOpen = false;
            date = null;
        }

        return (

            <div className="deliveryRegulationPage">
                <div className="row">
                    <div className="col-sm-12">
                        <div style={{
                            height: "35px", width: "300px", color: "rgba(0,0,0,0.87)", fontFamily:
                                "Nokia Pure Text Medium", fontSize: "30px", fontWeight: 500, lineHeight: "21px", paddingBottom: "18px", paddingTop: "18px"
                        }}>{this.state.deliveryTitle}</div>
                    </div>
                </div>
                <ColoredLine color="black" />
                <div className="row">
                    <div className="col-sm-12">
                        &nbsp;
                    </div>
                </div>
                <div>
                    <span id="SbpDeliveryRegulationNotifyArea"> {this.state.messageOnUI} </span>
                </div>
                <div style={{ height: 400, overflow: 'hidden' }} >
                    <DataGrid onGridReady={this.onGridReady} columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true} disableRowActions={true} rowData={this.state.getEmbargoPeriod} gridOptions={this.gridOptions} id="my-datagrid-id" />
                </div>
                <div className="row">
                    <div className="col-sm-12">

                    </div>
                </div>
                <div className="fieldset">
                    <FormLayout>
                        <legend>{this.state.deliveryTitle}</legend>
                        <div className="row">
                            <div className="col-sm-2">
                                <CheckBox id="dateLabel" name="dateLabel" label={this.state.dateLabel} value={this.state.dateChecked} onChange={this.updateDateState} />
                            </div>
                            <div className="col-sm-3">
                                <CalendarNew isTimeFormat24Hr={false} closeOnClickOutside date={this.state.startDateValue} timePicker={{
                                    isVisible: false, isSecondPickerVisible:
                                        false
                                }} header={{
                                    yearFormat:
                                        "YYYY", dateFormat: "YYYY-MM-DD"
                                }} locale="ja" firstDayOfWeek={0} field={{
                                    isVisible:
                                        true, format: "YYYY-MM-DD", formatIsInvalidMessage:
                                        "Invalid string, should match YYYY-MM-DD", dateIsBlockedMessage: "Date is inactive", dateIsRequiredMessage: "Date is required", focus: false,
                                    width: 150, disabled: this.state.startDateDisabled, hasOutline: true, toolTip: true, toolTipText: "Start Date",
                                    displayTooltipOnFocus: true, tabIndex: 0,
                                }} modal={{ isModal: false }} required={true} onChange={this.onChangeStartDate} >
                                </CalendarNew>
                            </div>
                            <div className="col-sm-2" style={labelStyle}>
                                <b><Label text="～" /></b>
                            </div>
                            <div className="col-sm-2">
                                <CalendarNew position="top" isTimeFormat24Hr={false} closeOnClickOutside date={this.state.endDateValue} timePicker={{
                                    isVisible: false, isSecondPickerVisible:
                                        false
                                }} header={{
                                    yearFormat:
                                        "YYYY", dateFormat: "YYYY-MM-DD"
                                }} locale="ja" firstDayOfWeek={0} field={{
                                    isVisible:
                                        true, format: "YYYY-MM-DD", formatIsInvalidMessage:
                                        "Invalid string, should match YYYY-MM-DD", dateIsBlockedMessage: "Date is inactive", dateIsRequiredMessage: "Date is required", focus: false,
                                    width: 150, disabled: this.state.endDateDisabled, hasOutline: true, toolTip: true, toolTipText: "End Date",
                                    displayTooltipOnFocus: true, tabIndex: 0
                                }} modal={{ isModal: false }} required={true} onChange={this.onChangeEndDate} Disabled={this.state.startDateDisabled}>
                                </CalendarNew>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">
                                <CheckBox id="time" name="time" label={this.state.timeLabel} value={this.state.timeChecked} onChange={this.updateTimeState} />
                            </div>
                            <div className="col-sm-1">
                                <SelectItem
                                    id="startHour"
                                    label=""
                                    data={hourData}
                                    selectedItem={this.state.selectedStartHour}
                                    onChange={this.onStartHourChange}
                                    maxWidth={20}
                                    disabled={this.state.startHourDisabled}
                                />
                            </div>
                            <div className="col-sm-1" style={labelStyle}>
                                <Label text={this.state.startHourLabel} />
                            </div>
                            <div className="col-sm-1">
                                <SelectItem
                                    id="startMinute"
                                    label=""
                                    data={minData}
                                    selectedItem={this.state.selectedStartMin}
                                    onChange={this.onStartMinChange}
                                    maxWidth={20}
                                    disabled={this.state.startMinuteDisabled}
                                />
                            </div>
                            <div className="col-sm-2" style={labelStyle}>
                                <Label text={this.state.startMinLabel} />
                            </div>
                            <div className="col-sm-1">
                                <SelectItem
                                    id="endHour"
                                    label=""
                                    data={hourData}
                                    selectedItem={this.state.selectedEndHour}
                                    onChange={this.onEndHourChange}
                                    maxWidth={20}
                                    disabled={this.state.endHourDisabled}
                                />
                            </div>
                            <div className="col-sm-1" style={labelStyle}>
                                <Label text={this.state.endHourLabel} />
                            </div>
                            <div className="col-sm-1">
                                <SelectItem
                                    id="endMinute"
                                    label=""
                                    data={minData}
                                    selectedItem={this.state.selectedEndMin}
                                    onChange={this.onEndMinChange}
                                    maxWidth={20}
                                    disabled={this.state.endMinuteDisabled}
                                />
                            </div>
                            <div className="col-sm-2" style={labelStyle}>
                                <Label text={this.state.endMinLabel} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">
                                <CheckBox id="week" name="week" label={this.state.dayLabel} value={this.state.weekChecked} onChange={this.updateWeekState} />
                            </div><div className="col-sm-1">
                                <CheckBox id="mon" name="Mon" label={this.state.monLabel} value={this.state.monChecked} onChange={this.updateMonState} disabled={this.state.monDisabled} />
                            </div><div className="col-sm-1">
                                <CheckBox id="tue" name="Tue" label={this.state.tueLabel} value={this.state.tueChecked} onChange={this.updateTueState} disabled={this.state.tueDisabled} />
                            </div><div className="col-sm-1">
                                <CheckBox id="wed" name="Wed" label={this.state.wedLabel} value={this.state.wedChecked} onChange={this.updateWedState} disabled={this.state.wedDisabled} />
                            </div><div className="col-sm-1">
                                <CheckBox id="thu" name="Thu" label={this.state.thuLabel} value={this.state.thuChecked} onChange={this.updateThuState} disabled={this.state.thuDisabled} />
                            </div><div className="col-sm-1">
                                <CheckBox id="fri" name="Fri" label={this.state.friLabel} value={this.state.friChecked} onChange={this.updateFriState} disabled={this.state.friDisabled} />
                            </div><div className="col-sm-1">
                                <CheckBox id="sat" name="Sat" label={this.state.satLabel} value={this.state.satChecked} onChange={this.updateSatState} disabled={this.state.satDisabled} />
                            </div><div className="col-sm-1">
                                <CheckBox id="sun" name="Sun" label={this.state.sunLabel} value={this.state.sunChecked} onChange={this.updateSunState} disabled={this.state.sunDisabled} />
                            </div>
                        </div>
                    </FormLayout>
                </div>
                <div className="button-story__column">
                    &nbsp;&nbsp;&nbsp;&nbsp;<Button id="register" text={this.state.registerBtn} onClick={this.setNewRowData} isCallToAction>{this.state.registerBtn}</Button>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        &nbsp;
                    </div>
                </div>
                <ColoredLine color="black" />
                <div className="row">
                    <div className="col-sm-12">
                        &nbsp;
                    </div>
                </div>
            </div >
        );
        isDateRequired = (e) => {
            console.log(e);
            if (e.value == "checked") {
                this.setState({ checked: false });
            } else {
                this.setState({ checked: true });
            }
        };
        onTimeChangeChange = (e) => {
            console.log(e);
        };

    }
}
SBPBlackOutWindow.propTypes = {
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};

export default SBPBlackOutWindow;