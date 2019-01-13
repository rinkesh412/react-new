import React from 'react';
import PropTypes from 'prop-types';
import { FormLayout, Button, CalendarNew, Label, TextInput, TextArea, RadioButtonGroup, RadioButton } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from '../../../services/i18n-label-service';
import './sbp-delivery-settings.styl';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';

const NUMBER = /^[1-5]$/;
export default class SBPDeliverySettingsStep extends React.Component { // eslint-disable-line
    constructor(props) {
        super(props);
        this.state = {
            modelName: props.receivedData ? props.receivedData.modelName : '',
            startDateValue: null,
            endDateValue: null,
            isStartOpen: false,
            isEndOpen: false,
            taskIdList: '',
            resendTimes: '1',
            text: '',
            error: false,
            needUpdate: 'NA',
            title: props.receivedData ? props.receivedData.title : '',
            cautionText: props.receivedData ? props.receivedData.cautionText : '',
            fileName: '',
            registerPerson: '',
            comment: '',
            listId: '',
            regUserLenExceed: false,
            commentLenExceed: false,
            selectedItem: '',
            selectedLTItem: '',
            selectedRoItem: true,
            selectedDeniedItem: true,
            selectedODBItem: false,
            selectedItemRO: 'Send',
            selectedItemDenied: 'Send',
            selectedItemODB: 'Do not Send',
            selectedFile: null,
            responseStatus: '',
            selectedItemList: 'Whitelist',
            localDev: false,
            jsoCalled: 'NA',
            resultsFromFetchJSO: {},
            ngListValue: [],
            smsDeliverySettingsSectionHeader: formatI18N('dsp_sbp_create-sms-task_header_delivery-settings'),
            modelNameLabel: formatI18N('dsp_sbp_create-sms-task_label_model-name'),
            cautionInstructionsGroupHeader: formatI18N('dsp_sbp_create-sms-task_header_caution-instruction'),
            titleLabel: formatI18N('dsp_sbp_create-sms-task_label_title'),
            cautionTextLabel: formatI18N('dsp_sbp_create-sms-task_label_caution-text'),
            startDateTimeLabel: formatI18N('dsp_sbp_create-sms-task_label_start-date-time'),
            endDateTimeLabel: formatI18N('dsp_sbp_create-sms-task_label_end-date-time'),
            resendsNumberLabel: formatI18N('dsp_sbp_create-sms-task_label_no-of-resends'),
            sendPermissionsettingGroupHeader: formatI18N('dsp_sbp_create-sms-task_header_send-permission-setting'),
            userDuringROSubGroupHeader: formatI18N('dsp_sbp_create-sms-task_header_user-ro'),
            deniedUserSubGroupHeader: formatI18N('dsp_sbp_create-sms-task_header_denied-user'),
            userDuringODBSubGroupHeader: formatI18N('dsp_sbp_create-sms-task_header_user-odb'),
            sendLabel: formatI18N('dsp_sbp_create-sms-task_label_send'),
            notSendLabel: formatI18N('dsp_sbp_create-sms-task_label_not-send'),
            listTypeLabel: formatI18N('dsp_sbp_create-sms-task_label_list-type'),
            noListLabel: formatI18N('dsp_sbp_create-sms-task_label_no-list'),
            blacklistLabel: formatI18N('dsp_sbp_create-sms-task_label_blacklist'),
            whitelistLabel: formatI18N('dsp_sbp_create-sms-task_label_whitelist'),
            listLabel: formatI18N('dsp_sbp_create-sms-task_label_list'),
            chooseFileButton: formatI18N('dsp_sbp_create-sms-task_label_choose-file'),
            noFileChosenMessage: formatI18N('dsp_sbp_create-sms-task_message_no-file-chosen'),
            registeredPersonLabel: formatI18N('dsp_sbp_create-sms-task_label_registered-person'),
            commentLabel: formatI18N('dsp_sbp_create-sms-task_label_comment'),
            ngListLabel: formatI18N('dsp_sbp_create-sms-task_label_ng-list'),
            registerButtonLabel: formatI18N('dsp_sbp_create-sms-task_label_register'),
            regUserLenExceedMsg: 'Registered user length can not exceed more than 10 characters',
            commentLenExceedMsg: 'Comment length can not exceed more than 30 characters'
        };
    }
    static defaultProps = {
        isStartOpen: false,
        isEndOpen: false
    };

    static getDerivedStateFromProps(props, state) {
        let createId='';
        if (state.jsoCalled === 'SO_SBP_CreateBulkPushTask') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    createId = state.resultsFromFetchJSO[state.jsoCalled].results.properties.id;
                    console.log('Prad Data from JSO via Fetch');
                    return { taskIdList: createId };
                }

            } else  {
                if (props.getResults('SO_SBP_CreateBulkPushTask')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_CreateBulkPushTask'));
                    createId = props.getResults('SO_SBP_CreateBulkPushTask').results.properties.id;
                    if (createId !== 'undefined' && state.ngListValue.length===0) {
                        props.nextHandler && props.nextHandler({
                            data: {
                                modelName: state.modelName,
                                title: state.title,
                                cautionText: state.cautionText,
                                startDateValue: state.startDateValue,
                                endDateValue: state.endDateValue,
                                registerPerson: state.registerPerson,
                                comment: state.comment,
                                selectedItemList: state.selectedItemList,
                                selectedFile: state.selectedFile,
                                selectedItemRO: state.selectedItemRO,
                                selectedItemDenied: state.selectedItemDenied,
                                selectedItemODB: state.selectedItemODB,
                                list_id: state.listId,
                                taskIdList: createId,
                                ngListValue: state.ngListValue,
                            }
                        });
                    }
                    console.log('Contents available in this:', state.taskIdList);
                    return { taskIdList: createId, jsoCalled: 'NA' };
                }

            }
        }
        return null;
    }
    formatDate = date => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hh = d.getHours(),
            mm = d.getMinutes(),
            ss = d.getSeconds();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        var newDate =  [ year, month, day ].join('-');
        var time = [ hh, mm, ss ].join(':');
        console.log(newDate+' '+time);
        return newDate+' '+time;
    }
    onChangeStartDate = data => {
        if (data.type === 'onDateChange') {
            this.setState({ startDateValue: data.value });
        }
        if (data.type === 'onToggle') {
            this.setState({ isStartOpen: data.value });
        }
    };
    onChangeEndDate = data => {
        if (data.type === 'onDateChange') {
            this.setState({ endDateValue: data.value });
        }
        if (data.type === 'onToggle') {
            this.setState({ isEndOpen: data.value });
        }
    };

    onChangeModelName = newText => {
        this.setState({ modelName: newText.value });
    }
    onChangeTitle = newText => {
        this.setState({ title: newText.value });
    }
    onChangeCautionText = newText => {
        this.setState({ cautionText: newText.value });
    }
    onChangeNoResend = newText => {
        this.setState({ resendTimes: newText.value });
    }
    onChangeNgListTextArea = newText => {
        this.setState({ text: newText.value, charCount: newText.value.length, error: newText.value.length > 300
        });
    }
    onChangeList = newText => {
        this.setState({ fileName: newText.value });
    }
    onChangeListType = event => {
        this.setState({ selectedItemList: event.value });
    };
    onChangeRegisteredPerson = newText => {
        this.setState({
            registerPerson: newText.value,
            regUserLenExceed: newText.value > 10
        });
    }
    onChangeComment = newText => {
        this.setState({
            comment: newText.value,
            commentLenExceed: newText.value.length > 30
        });
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
    getCSVFile = formData => {
        var url ='';
        var invalidArray=[];
        var fetchProperties = {
            method: 'POST',
            body: formData
        };
        console.log('LIST TYPE', this.state.selectedItemList);
        if (this.state.selectedItemList==='Whitelist') {
            url = '/custom-app/rest/sbp/uploadWhitelist';
        } else if (this.state.selectedItemList==='Blacklist') {
            url = '/custom-app/rest/sbp/uploadBlacklist';
        } else {
            console.log('No Registration');
        }
        var whiteListId ='';
        var blackListId ='';
        var id='';
        return fetch(url, fetchProperties)
            .then(
                response => {
                    response.json().then(data => {
                        id = data.id;
                        console.log('ID', data);
                        if (id === 0 && data.invalidDataList) {
                            for (var key in data.invalidDataList) {
                                var errorMsg='';
                                errorMsg= data.invalidDataList[key].input +'--'+data.invalidDataList[key].reason;
                                invalidArray.push(errorMsg);
                            }
                            this.setState({ ngListValue: invalidArray });
                        } else if (id!=='' && id!=='undefined' && id!==null && id!==0) {
                            if (this.state.selectedItemList === 'Whitelist') {
                                whiteListId=id;
                            } else if (this.state.selectedItemList === 'Blacklist') {
                                blackListId=id;
                            } else {
                                console.log('No Registration List');
                            }
                            if (data.invalidDataList) {
                                for (var invalidKey in data.invalidDataList) {
                                    var invalidMsg='';
                                    invalidMsg= data.invalidDataList[invalidKey].input +'--'+data.invalidDataList[invalidKey].reason;
                                    invalidArray.push(invalidMsg);
                                }
                                this.setState({ ngListValue: invalidArray });
                            }
                            this.setState({
                                listId: id
                            });
                            if (data.invalidDataList.length===0) {
                                this.createBulkTask(whiteListId, blackListId, id);
                            }
                        }
                    });
                })
            .catch(
                error => {
                    console.log('Error in Uploading List', error);
                });
    }
    createBulkTask = (whiteListId, blackListId, id) => {
        const params=[
            {
                'name': 'modelName',
                'value': this.state.modelName
            },
            {
                'name': 'messageTitle',
                'value': this.state.title
            },
            {
                'name': 'message',
                'value': this.state.cautionText
            },
            {
                'name': 'startTime',
                'value': this.formatDate(this.state.startDateValue)
            },
            {
                'name': 'endTime',
                'value': this.formatDate(this.state.endDateValue)
            },
            {
                'name': 'retryCount',
                'value': this.state.resendTimes
            },
            {
                'name': 'allowInROUser',
                'value': this.state.selectedRoItem
            },
            {
                'name': 'allowUsersBlockingSpams',
                'value': this.state.selectedDeniedItem
            },
            {
                'name': 'allowInODBUser',
                'value': this.state.selectedODBItem
            },
            {
                'name': 'whitelistFileId',
                'value': whiteListId.toString()
            },
            {
                'name': 'blacklistFileId',
                'value': blackListId.toString()
            },
            {
                'name': 'userName',
                'value': this.state.registerPerson
            },
            {
                'name': 'description',
                'value': this.state.comment
            }
        ];
        console.log('Create', params);
        this.executeServiceOperationAdapter('SO_SBP_CreateBulkPushTask', params);
    }
    handleSelectedFile = event => {
        var validExts = new Array('.csv');
        var fileExt = event.target.files[0].name;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
            this.setState({ ngListValue: 'File Format Incorrect' });
        } else {
            this.setState({ selectedFile: event.target.files[0], ngListValue: '' });
        }
    }
      onChangeRO = event => {
          this.setState({ selectedItemRO: event.value });
          if (event.value==='Do not Send') {
              this.setState({ selectedRoItem: false });
          }
      };
    onChangeDenied = event => {
        this.setState({ selectedItemDenied: event.value });
        if (event.value==='Do not Send') {
            this.setState({ selectedDeniedItem: false });
        }
    };
    onChangeODB = event => {
        this.setState({ selectedItemODB: event.value });
	  if (event.value==='Send') {
            this.setState({ selectedDeniedItem: true });
        }
    }
    executeServiceOperationAdapter(jsoName, jsoParams) {
        this.state.jsoCalled= jsoName;
        if (this.state.localDev) {
            console.log('Calling JSO - using Fetch');
            this.executeLocalDevSOTestMessages(jsoName, jsoParams);
        } else {
            console.log('Calling JSO - using Servi');
            this.props.executeServiceOperation(jsoName, jsoParams);
        }

    }
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName,  jsoParams).then(data => {
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }
    onClickRegisterBtn = () => {
        if (this.state.selectedFile) {
            const data = new FormData();
            data.append('file', this.state.selectedFile);

            /* this.props.nextHandler && this.props.nextHandler({
            data: {
                modelName: this.state.modelName,
                title: this.state.title,
                cautionText: this.state.cautionText,
                startDateValue: this.state.startDateValue,
                endDateValue: this.state.endDateValue,
                registerPerson: this.state.registerPerson,
                comment: this.state.comment,
                selectedItemList: this.state.selectedItemList,
                selectedFile: this.state.selectedFile,
                selectedItemRO: this.state.selectedItemRO,
                selectedItemDenied: this.state.selectedItemDenied,
                selectedItemODB: this.state.selectedItemODB,
                taskIdList: this.state.taskIdList
            }
        });*/
            const formData = new FormData();
            formData.append('file', this.state.selectedFile);
            this.getCSVFile(formData);
        }
    }
    render() {
        return (
            <div>
                <FormLayout>
                    <div className="delivery-item-text__input">
                        <TextInput
                            text={this.state.modelName}
                            id="TextInputID1"
                            label={this.state.modelNameLabel}
                            onChange={this.onChangeModelName} disabled
                        />
                    </div>
                    <div >
                        <div className="delivery-item-text__input">
                            <label> {this.state.cautionInstructionsGroupHeader} </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="titleLabel" text={this.state.titleLabel} />
                        </div>
                        <div className="col-sm-5">
                            <TextInput
                                text={this.state.title}
                                id="TextInputID3"
                                onChange={this.onChangeTitle}
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
                                text={this.state.cautionText}
                                id="TextAreaInputID4"
                                onChange={this.onChangeCautionText}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-2 padding_style">
                            <Label id="date" name="date" text={this.state.startDateTimeLabel} />
                        </div>
                        <div className="col-sm-2">
                            <CalendarNew id="startDateId" position="top"
                                isTimeFormat24Hr isOpen={this.state.isStartOpen} closeOnClickOutside locale="ja"
                                field={{ isVisible: true, width: 200, hasOutline: true,
                                    dateIsBlockedMessage: 'Date is inactive', dateIsRequiredMessage: 'Date is required',
                                    toolTip: true, toolTipText: 'Search Start Date', displayTooltipOnFocus: true }}
                                timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                                date={this.state.startDateValue} onChange={this.onChangeStartDate}
                                modal={{ isModal: false }} required={true}
                            />
                        </div>
                        <div className="col-sm-2 padding_style">
                            <Label id="date" name="date" text={this.state.endDateTimeLabel} />
                        </div>
                        <div className="col-sm-2">
                            <CalendarNew id="endDateId" position="top"
                                isTimeFormat24Hr isOpen={this.state.isEndOpen} closeOnClickOutside locale="ja"
                                field={{ isVisible: true, width: 200, hasOutline: true }}
                                timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                                date={this.state.endDateValue} onChange={this.onChangeEndDate}
                                modal={{ isModal: false }} required={true}
                            />
                        </div>
                        <div className="col-sm-2 padding_style">
                            <Label id="no-of-resend-id" name="resends" text={this.state.resendsNumberLabel} />
                        </div>
                        <div className="col-sm-2">
                            <TextInput
                                text={this.state.resendTimes}  id="TextInputID5"  onChange={this.onChangeNoResend} inputPattern={ NUMBER }
                                focus
                            />
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Label id="permission-set-id" text={this.state.sendPermissionsettingGroupHeader} name="permission-setting" />
                            </div>
                        </div>
                        <div className="row" />
                        <fieldset style={{ width: '250px', float: 'left' }}>
                            <RadioButtonGroup id="user-during-RO-ButtonGroup" name="RO" label={this.state.userDuringROSubGroupHeader}
                                selectedItem={this.state.selectedItemRO} onChange = {this.onChangeRO}
                            >
                                <RadioButton id="ro-option1" label={this.state.sendLabel} name="selectedItemRO" value="Send" />
                                <RadioButton id="ro-option2" label={this.state.notSendLabel} name="selectedItemRO" value="Do not Send" />
                            </RadioButtonGroup>
                        </fieldset>
                        <fieldset style={{ width: '250px', float: 'left' }}>
                            <RadioButtonGroup id="spam-sms-denied-user-ButtonGroup" name="Spam" label={this.state.deniedUserSubGroupHeader}
                                selectedItem={this.state.selectedItemDenied} onChange = {this.onChangeDenied}
                            >
                                <RadioButton id="spam-option1" label={this.state.sendLabel} name="selectedItemDenied" value="Send" />
                                <RadioButton id="spam-option2" label={this.state.notSendLabel} name="selectedItemDenied" value="Do not Send" />
                            </RadioButtonGroup>
                        </fieldset>
                        <fieldset style={{ width: '250px', float: 'left' }}>
                            <RadioButtonGroup id="user-during-ODB-ButtonGroup" name="ODB" label={this.state.userDuringODBSubGroupHeader}
                                selectedItem={this.state.selectedItemODB} onChange = {this.onChangeODB}
                            >
                                <RadioButton id="spam-option1" label={this.state.sendLabel} value="Send" />
                                <RadioButton id="spam-option2" label={this.state.notSendLabel} value="Do not Send" />
                            </RadioButtonGroup>
                        </fieldset>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <Label id="listType" name="listType" text={this.state.listTypeLabel} />
                        </div>
                        <div className="col-sm-4">
                            <RadioButtonGroup
                                id="user-during-LT"
                                disabled={false}
                                selectedItem={this.state.selectedItemList}
                                name="radiocolorgroup"
                                onChange={this.onChangeListType}
                            >
                                <RadioButton id="user-during-LT" label={this.state.noListLabel} name="nolist" value="No List Registration" />
                                <RadioButton id="user-during-LT" label={this.state.blacklistLabel} name="blklist" value="Blacklist" />
                                <RadioButton id="user-during-LT" label={this.state.whitelistLabel} name="whtlist" value="Whitelist" />
                            </RadioButtonGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-2">
                            <Label id="list" name="list" text={this.state.listLabel} />
                        </div>
                        {  this.state.selectedItemList !== 'No List Registration' ?
                            <div className="col-sm-3">
                                <input id="choose-file-id" type="file" name="myFile" onChange={this.handleSelectedFile} />
                            </div>
                            :
                            <div className="col-sm-3">
                                <input id="choose-file-id-disabled" type="file" name="file" disabled />
                            </div> }
                    </div>
                    <div className="row">
                        <div className="col-sm-2 padding_style">
                            <Label id="person" name="person" text={this.state.registeredPersonLabel} />
                        </div>
                        <div className="col-sm-4">
                            <TextInput
                                text={this.state.registerPerson}
                                id="TextInputID5"
                                onChange={this.onChangeRegisteredPerson}
                                error={this.state.regUserLenExceed}
                                errorMsg={this.state.regUserLenExceedMsg}
                            />
                        </div>
                        <div className="col-sm-2 padding_style">
                            <Label id="comment" name="comment" text={this.state.commentLabel} />
                        </div>
                        <div className="col-sm-4">
                            <TextInput
                                text={this.state.comment}
                                id="TextInputID6"
                                onChange={this.onChangeComment}
                                error={this.state.commentLenExceed}
                                errorMsg={this.state.commentLenExceedMsg}
                                width="250"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Button id="registerBtn" text={this.state.registerButtonLabel} isCallToAction onClick={this.onClickRegisterBtn} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 ng_list">
                            <TextArea id="notes" label={this.state.ngListLabel} text={this.state.ngListValue} onChange={this.onChangeNgListTextArea}
                                error={this.state.error} errorMsg="Too much text"
                                charCount={this.state.charCount} maxCharCount={300}
                            />
                        </div>
                    </div>
                </FormLayout>
            </div>

        );

    }
}
SBPDeliverySettingsStep.propTypes = {
    isStartOpen: PropTypes.bool,
    isEndOpen: PropTypes.bool,
    receivedData: PropTypes.object,
    nextHandler: PropTypes.func,
    backHandler: PropTypes.func,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    taskIdList: PropTypes.string
};