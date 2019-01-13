import React, { Component } from 'react';
import { SelectItem, Button, CalendarNew, Label, FormLayout } from '@nokia-csf-uxr/csfWidgets';
import './fota-um-backlist.css';
import { getBlacklistSetupData } from './../../services/fota-um-hardcoded-data.service';
import PropTypes from 'prop-types';
import { hourData, minData, weekDay, weekNo  } from '../../constants/constantsData';
import { formatI18N } from './../../services/i18n-label-service';

export default class FotaUmBlacklistSetup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            irRegularDataBlacklist: [],
            regularDataBlacklist: [],
            localDev: false,
            jsoCalled: 'NA',
            resultsFromFetchJSO: {},
            nextFunctionToCall: 'NA',
            messageOnUI: 'NA',
            isJsoError: false,
            labelHour: formatI18N('dsp_fota_um_blacklist_label_hour'),
            labelMinute: formatI18N('dsp_fota_um_blacklist_label_minute'),
            labelEveryMonth: formatI18N('dsp_fota_um_blacklist_label_every_month'),
            labelWeekNo: formatI18N('dsp_fota_um_blacklist_label_week_no'),
            labelSubmitButton: formatI18N('dsp_fota_um_blacklist_label_button_submit'),
            labelDeleteButton: formatI18N('dsp_fota_um_blacklist_label_button_delete'),
            labelWeekDay: formatI18N('dsp_fota_um_blacklist_label_week_day'),
            labelHeaderRegularbasis: formatI18N('dsp_fota_um_blacklist_header_regular_basis'),
            labelHeaderIrrRegularbasis: formatI18N('dsp_fota_um_blacklist_header_irregular_basis')
        };


    }

    onChangeIrrDate = e => {
        const irRegularDataBlacklistNew = this.state.irRegularDataBlacklist.slice();
        irRegularDataBlacklistNew[e.data].dateForIrregular = e.value;
        this.setState({ irRegularDataBlacklist: irRegularDataBlacklistNew });
    };
    onChangeEndDate = e => {
        console.log(e);
        this.setState({ endDateValue: e.value });
    };
    onStartHourChangeIrregular = e => {
        const irRegularDataBlacklistNew = this.state.irRegularDataBlacklist.slice();
        irRegularDataBlacklistNew[e.data].startHour = e.value;
        this.setState({ irRegularDataBlacklist: irRegularDataBlacklistNew });

    };
    onStartMinChangeIrregular = e => {
        const irRegularDataBlacklistNew = this.state.irRegularDataBlacklist.slice();
        irRegularDataBlacklistNew[e.data].startMin = e.value;
        this.setState({ irRegularDataBlacklist: irRegularDataBlacklistNew });
    };
    onEndHourChangeIrregular = e => {
        const irRegularDataBlacklistNew = this.state.irRegularDataBlacklist.slice();
        irRegularDataBlacklistNew[e.data].endHour = e.value;
        this.setState({ irRegularDataBlacklist: irRegularDataBlacklistNew });
    };
    onEndMinChangeIrregular = e => {
        const irRegularDataBlacklistNew = this.state.irRegularDataBlacklist.slice();
        irRegularDataBlacklistNew[e.data].endMin = e.value;
        this.setState({ irRegularDataBlacklist: irRegularDataBlacklistNew });
    };

    onStartHourChangeRegular = e => {
        const regularDataBlacklistNew = this.state.regularDataBlacklist.slice();
        regularDataBlacklistNew[e.data].startHour = e.value;
        this.setState({ regularDataBlacklist: regularDataBlacklistNew });

    };
    onStartMinChangeRegular = e => {
        const regularDataBlacklistNew = this.state.regularDataBlacklist.slice();
        regularDataBlacklistNew[e.data].startMin = e.value;
        this.setState({ regularDataBlacklist: regularDataBlacklistNew });
    };
    onEndHourChangeRegular = e => {
        const regularDataBlacklistNew = this.state.regularDataBlacklist.slice();
        regularDataBlacklistNew[e.data].endHour = e.value;
        this.setState({ regularDataBlacklist: regularDataBlacklistNew });
    };
    onEndMinChangeRegular = e => {
        const regularDataBlacklistNew = this.state.regularDataBlacklist.slice();
        regularDataBlacklistNew[e.data].endMin = e.value;
        this.setState({ regularDataBlacklist: regularDataBlacklistNew });
    };

    onWeekNoChangeRegular = e => {
        const regularDataBlacklistNew = this.state.regularDataBlacklist.slice();
        regularDataBlacklistNew[e.data].weekNoForRegular = e.value;
        this.setState({ regularDataBlacklist: regularDataBlacklistNew });
    };

    onWeekDayChangeRegular = e => {
        const regularDataBlacklistNew = this.state.regularDataBlacklist.slice();
        regularDataBlacklistNew[e.data].weekDayForIrregular = e.value;
        this.setState({ regularDataBlacklist: regularDataBlacklistNew });
    };

    onClickSubmit = data => {
        console.log('Submitted data >> ', data);
        let dateInCurrentFormat = new Date(data.data.dateForIrregular);
        let dateInChangedFormat = null;

        if (dateInCurrentFormat) {
            dateInCurrentFormat = dateInCurrentFormat.toISOString().slice(0, 10);
            dateInChangedFormat =  dateInCurrentFormat.replace('-', '/').replace('-', '/');
            console.log('Submitted data dateInChangedFormat>> ', dateInChangedFormat);
        } else {
            console.log('Submitted data dateInChangedFormat Else>> ');
        }

        let params = [
            {
                'name': 'endHour',
                'value': data.data.endHour
            },
            {
                'name': 'endMin',
                'value': data.data.endMin
            },
            {
                'name': 'isRegular',
                'value': data.data.isRegular
            },
            {
                'name': 'dateForIrregular',
                'value': dateInChangedFormat
            },
            {
                'name': 'startHour',
                'value': data.data.startHour
            },
            {
                'name': 'weekNoForRegular',
                'value': data.data.weekNoForRegular
            },
            {
                'name': 'id',
                'value': data.data.id
            },
            {
                'name': 'startMin',
                'value': data.data.startMin
            },
            {
                'name': 'weekDayForIrregular',
                'value': data.data.weekDayForIrregular
            }
        ];
        console.log('params before submit>>', params);

        this.executeServiceOperationAdapter('SO_UM_UpdateBlackoutWindow', params);

    }

    onClickDelete = data => {
        console.log('Clearing data >> ', data);
        let dateInCurrentFormat = new Date(data.data.dateForIrregular);
        let dateInChangedFormat = null;

        if (dateInCurrentFormat) {
            dateInCurrentFormat = dateInCurrentFormat.toISOString().slice(0, 10);
            dateInChangedFormat =  dateInCurrentFormat.replace('-', '/').replace('-', '/');
            console.log('Delete data dateInChangedFormat>> ', dateInChangedFormat);
        } else {
            console.log('Delete data dateInChangedFormat Else>> ');
        }

        let params = [
            {
                'name': 'endHour',
                'value': 0
            },
            {
                'name': 'endMin',
                'value': 0
            },
            {
                'name': 'isRegular',
                'value': 0
            },
            {
                'name': 'dateForIrregular',
                'value': dateInChangedFormat
            },
            {
                'name': 'startHour',
                'value': 0
            },
            {
                'name': 'weekNoForRegular',
                'value': 1
            },
            {
                'name': 'id',
                'value': data.data.id
            },
            {
                'name': 'startMin',
                'value': 0
            },
            {
                'name': 'weekDayForIrregular',
                'value': 0
            }
        ];
        console.log('params before Delete/Clear >>', params);

        this.executeServiceOperationAdapter('SO_UM_UpdateBlackoutWindow', params);

    }

    componentDidMount() {
        console.log('Props at componentDidMount ', this.props);
        this.executeServiceOperationAdapter('SO_UM_GetBlackoutWindows', []);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('Inside componentDidUpdate');
        if (this.state.nextFunctionToCall ==='getFOTAUMBlackListData') {
            console.log('componentDidUpdate calling next');
            this.executeServiceOperationAdapter('SO_UM_GetBlackoutWindows', []);
            this.setState({ nextFunctionToCall: 'NA' });
        }

        if (prevState && prevState.isJsoError !== this.state.isJsoError) {
            console.log('From componentDidUpdate - An Error has occured. Please contact your Administrator');
            this.setState({ isJsoError: false });
        }

        if (this.state.messageOnUI !== 'NA') {
            setTimeout(() => {
                console.log('Clear Message on UI');
                this.setState({ messageOnUI: 'NA', jsoCalled: 'NA' });
            }, 3000);
        }

    }

    executeServiceOperationAdapter(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.jsoCalled= jsoName;

        if (this.state.localDev) {
            console.log('Calling JSO - using Fetch');
            this.executeLocalDevSOTestMessages(jsoName, jsoParams);
        } else {
            console.log('Calling JSO - using Servi');
            this.props.executeServiceOperation(jsoName, jsoParams);
        }
        //  We call getDerivedStateFromProps. But update state only for local Dev
        if (this.state.localDev) {
            setTimeout(() => {
                console.log('Calling after Settime out >>');
                let soResult = FotaUmBlacklistSetup.getDerivedStateFromProps(this.props, this.state);
                console.log('Calling after Settime out soResult>>', soResult);
                this.setState(soResult);
            }, 1000);
        }

    }

    // Step 3 - LocalDev - Gettin Data and Setting in Polling response
    // eslint-disable-next-line no-unused-vars
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.resultsFromFetchJSO[jsoName] =getBlacklistSetupData();

    }

    // Step 4 - Impelement getDerivedStateFromProps
    // eslint-disable-next-line complexity
    static getDerivedStateFromProps(props, state) {
        // let newstate = {};
        console.log('Inside getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        console.log('Inside getDerivedStateFromProps call back state >> ', state);
        console.log('Inside getDerivedStateFromProps call back props >> ', props);
        let regularDataBlacklistFromJSO = [];
        let irRegularDataBlacklistFromJSO = [];
        let operationResult ='NA';

        // If SO_UM_GetBlackoutWindows is called
        if (state.jsoCalled === 'SO_UM_GetBlackoutWindows') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    irRegularDataBlacklistFromJSO = state.resultsFromFetchJSO[state.jsoCalled]['irregularData'];
                    regularDataBlacklistFromJSO = state.resultsFromFetchJSO[state.jsoCalled]['regularData'];
                    console.log('Prad Data from JSO via Fetch', regularDataBlacklistFromJSO);
                    return { irRegularDataBlacklist: irRegularDataBlacklistFromJSO, regularDataBlacklist: regularDataBlacklistFromJSO,  messageOnUI: 'NA' };
                }

            } else  {
                if (props.getResults('SO_UM_GetBlackoutWindows')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_UM_GetBlackoutWindows'));
                    operationResult = props.getResults('SO_UM_GetBlackoutWindows').results.result.value;
                    if (operationResult === '3') {
                        let resultProperties = props.getResults('SO_UM_GetBlackoutWindows').results.properties;
                        if (resultProperties.irregularData && resultProperties.irregularData.items) {
                            irRegularDataBlacklistFromJSO = resultProperties.irregularData.items;
                        }
                        if (resultProperties.regularData && resultProperties.regularData.items) {
                            regularDataBlacklistFromJSO = resultProperties.regularData.items;
                        }
                        return { isJsoError: false, irRegularDataBlacklist: irRegularDataBlacklistFromJSO, regularDataBlacklist: regularDataBlacklistFromJSO };
                    } else {
                        return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }

                }

            }
        } else if (state.jsoCalled === 'SO_UM_UpdateBlackoutWindow') {
            if (!state.localDev) {
                if (props.getResults('SO_UM_UpdateBlackoutWindow')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_UM_DelteBlackoutWindow'));
                    operationResult = props.getResults('SO_UM_UpdateBlackoutWindow').results.result.value;
                    if (operationResult === '3') {
                        return { nextFunctionToCall: 'getFOTAUMBlackListData', messageOnUI: ' Task Updated Successfully' };
                    } else {
                        return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }

                }
            }
        }
        return null;
    }

    renderRegularBasisData = regularList => {
        if (regularList.length > 0) {
            // eslint-disable-next-line no-unused-vars
            return regularList.map((listData, index) => (
                <div className="row">

                    <div className="col-sm-2 col-md-2 col-lg-2" style={{ margin: '10px' }}>
                        <Label text = {this.state.labelEveryMonth} />
                    </div>
                    <div className="col-sm-1 col-md-1 col-lg-1" style={{ margin: '10px' }}>
                        <SelectItem
                            id="weekNo"
                            label={this.state.labelWeekNo}
                            data={weekNo}
                            selectedItem={listData.weekNoForRegular}
                            onChange={this.onWeekNoChangeRegular}
                            eventData={index}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1" style={{ margin: '10px' }}>
                        <SelectItem
                            id="weekDay"
                            label={this.state.labelWeekDay}
                            data={weekDay}
                            selectedItem={listData.weekDayForIrregular}
                            onChange={this.onWeekDayChangeRegular}
                            eventData={index}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1" style={{ margin: '10px' }}>
                        <SelectItem
                            id="startHour"
                            label={this.state.labelHour}
                            data={hourData}
                            selectedItem={listData.startHour}
                            eventData={index}
                            onChange={this.onStartHourChangeRegular}
                            maxWidth={30}
                        />
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1 " style={{ margin: '10px' }}>
                        <SelectItem
                            id="startMinute"
                            label={this.state.labelMinute}
                            data={minData}
                            selectedItem={listData.startMin}
                            eventData={index}
                            onChange={this.onStartMinChangeRegular}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1 " style={{ margin: '10px' }}>
                        <SelectItem
                            id="endHour"
                            label={this.state.labelHour}
                            data={hourData}
                            selectedItem={listData.endHour}
                            eventData={index}
                            onChange={this.onEndHourChangeRegular}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1" style={{ margin: '10px' }}>
                        <SelectItem
                            id="endMinute"
                            label={this.state.labelMinute}
                            data={minData}
                            selectedItem={listData.endMin}
                            eventData={index}
                            onChange={this.onEndMinChangeRegular}
                            maxWidth={20}
                        />
                    </div>
                    <div className="col-sm-2  col-md-2 col-lg-2" style={{ margin: '10px' }}>
                        <div style={{ height: '10px' }}> &nbsp; </div>
                        <Button id="btnExecute" text={this.state.labelSubmitButton} isCallToAction eventData={listData} onClick={this.onClickSubmit} />
                    </div>
                    <div className="col-sm-2  col-md-2 col-lg-2" style={{ marginTop: '10px', marginLeft: '-60px' }}>
                        <div style={{ height: '10px' }}> &nbsp; </div>
                        <Button id="btnExecute2" text={this.state.labelDeleteButton} isCallToAction eventData={listData} onClick={this.onClickDelete} />
                    </div>
                </div>
            ));

        } else {
            return [];
        }

    }


    renderIrregularList = irrRegularList => {
        let irrListLocal = irrRegularList;
        if (irrListLocal.length > 0) {
            // eslint-disable-next-line no-unused-vars
            return irrListLocal.map((listData, index) => (
                <div className="row">
                    <div className="col-sm-1 col-md-1 col-lg-1" style={{ margin: '10px' }}>&nbsp;</div>
                    <div className="col-sm-1" style={{ margin: '10px' }}>
                        <div> &nbsp; </div>
                        <div><Label text={index + 1} /></div>
                    </div>
                    <div className="col-sm-2" style={{ margin: '10px' }}>
                        <CalendarNew isTimeFormat24Hr={false} closeOnClickOutside date={new Date(listData.dateForIrregular)} timePicker={{
                            isVisible: false, isSecondPickerVisible:
                                        false
                        }} header={{
                            yearFormat:
                                        'YYYY', dateFormat: 'YYYY-MM-DD'
                        }} locale="ja" firstDayOfWeek={0} field={{
                            isVisible:
                                        true, format: 'YYYY-MM-DD', formatIsInvalidMessage:
                                        'Invalid string, should match YYYY-MM-DD', dateIsBlockedMessage: 'Date is inactive', dateIsRequiredMessage: 'Date is required', focus: false,
                            width: 150, disabled: false, hasOutline: true, toolTip: true, toolTipText: 'Start Date',
                            displayTooltipOnFocus: true, tabIndex: 0,
                        }} modal={{ isModal: false }} required={true} eventData={index} onChange={this.onChangeIrrDate}
                        />
                    </div>

                    <div className="col-sm-1" style={{ margin: '10px' }}>
                        <SelectItem
                            id="startHour"
                            label={this.state.labelHour}
                            data={hourData}
                            selectedItem={listData.startHour}
                            onChange={this.onStartHourChangeIrregular}
                            eventData={index}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1 " style={{ margin: '10px' }}>
                        <SelectItem
                            id="startMinute"
                            label={this.state.labelMinute}
                            data={minData}
                            selectedItem={listData.startMin}
                            onChange={this.onStartMinChangeIrregular}
                            eventData={index}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1 " style={{ margin: '10px' }}>
                        <SelectItem
                            id="endHour"
                            label={this.state.labelHour}
                            data={hourData}
                            selectedItem={listData.endHour}
                            onChange={this.onEndHourChangeIrregular}
                            eventData={index}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-1" style={{ margin: '10px' }}>
                        <SelectItem
                            id="endMinute"
                            label={this.state.labelMinute}
                            data={minData}
                            selectedItem={listData.endMin}
                            onChange={this.onEndMinChangeIrregular}
                            eventData={index}
                            maxWidth={20}
                        />
                    </div>

                    <div className="col-sm-2 " style={{ margin: '10px' }}>
                        <div style={{ height: '10px' }}> &nbsp; </div>
                        <Button id="btnExecute" text="Submit" isCallToAction eventData={listData} onClick={this.onClickSubmit} />
                    </div>
                    <div className="col-sm-2 " style={{ marginTop: '10px', marginLeft: '-60px' }}>
                        <div style={{ height: '10px' }}> &nbsp; </div>
                        <Button id="btnExecute2" text="Delete" isCallToAction eventData={listData} onClick={this.onClickDelete} />
                    </div>
                </div>
            ));
        } else {
            return [];
        }

    };

    render() {
        const ColoredLine = ({ color }) => (<hr style={{ color: color, backgroundColor: color, height: 1 }} />);
        let regularListTable = this.renderRegularBasisData(this.state.regularDataBlacklist);
        let irrListTable = this.renderIrregularList(this.state.irRegularDataBlacklist);

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div style={{ height: '21px', color: 'rgba(0,0,0,0.87)', fontFamily:
                                    'Nokia Pure Text Medium', padding: '10px 0', fontSize: '30px', fontWeight: 500, lineHeight: '21px' }}
                        >FOTA UM Blacklist Page</div>
                    </div>
                </div>
                <div>
                    <span id="fota-um-blacklist-notify-Area"> {this.state.messageOnUI !== 'NA'? this.state.messageOnUI : ''} </span>
                </div>
                <ColoredLine color="black" />
                <FormLayout>
                    <div className="row">
                        <div className = "col-sm-w12">
                            {this.state.labelHeaderRegularbasis}
                        </div>
                    </div>

                    {regularListTable}

                    <div className="row">
                        <div className = "col-sm-w12">
                            {this.state.labelHeaderIrrRegularbasis}
                        </div>

                    </div>

                    {irrListTable}

                </FormLayout>
            </div>
        );
    }

}


FotaUmBlacklistSetup.propTypes = {
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired
};