import React from 'react';
import PropTypes from 'prop-types';
import { FormLayout, Label, TextArea } from '@nokia-csf-uxr/csfWidgets';
import './manage-broadcast-details.styl';
import ManageBroadcastDetailsProgressTable from './manage-broadcast-details-table';
import FileUploaderWrapper from '../../../components/multiple-files-upload/uploaded-file-result';
import { formatI18N } from '../../../services/i18n-label-service';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';

export default class ManageBroadcastDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        // console.log("Props from Parent",itemPropsFromParent);
        console.log('Props Element', props);
    }

    mainDivElementStyle = {
        border: 'solid',
        backgroundColor: '#ccffcc'
    }

    datatext2Style = {
        fontSize: '12px',
        marginLeft: '0px',
        marginRight: '0px'
    }

    state = {
        text: '',
        charCount: 3000,
        error: false,
        selectedFile: this.props.detailPage.selectedFile,
        modelName: this.props.modelName,
        title: this.props.title,
        cautionText: this.props.cautionText,
        startDateValue: this.props.startDateValue,
        endDateValue: this.props.endDateValue,
        registerPerson: this.props.registerPerson,
        comment: this.props.comment,
        selectedItemList: this.props.detailPage.selectedListItem,
        selectedItemRO: this.props.detailPage.allowInROUser,
        selectedItemDenied: this.props.detailPage.allowUsersBlockingSpams,
        selectedItemODB: this.props.detailPage.allowInODBUser,
        detailList: this.props.detailPage,
        localDev: false,
        jsoCalled: 'NA',
        listId: '',
        listType: '',
        listItems: this.props.listItems,
        resultsFromFetchJSO: {},
        ngListValue: this.props.ngListValue,
        modelName: formatI18N('dsp_sbp_brdcast-psh-tsk_header_model-name'),
        pushPeriod: formatI18N('dsp_sbp_brdcast-psh-tsk_label_psh-period'),
        msgTitle: formatI18N('dsp_sbp_brdcast-psh-tsk_label_msg-title'),
        usr: formatI18N('dsp_sbp_brdcast-psh-tsk_label_usr'),
        whiteBlck: formatI18N('dsp_sbp_brdcast-psh-tsk_label_whte-blck-lst'),
        addList: formatI18N('dsp_sbp_brdcast-psh-tsk_label_add-lst'),
        sendCancel: formatI18N('dsp_sbp_brdcast-psh-tsk_label_snd-cncl'),
        roUser: formatI18N('dsp_sbp_brdcast-psh-tsk_label_ro-usr'),
        junkSms: formatI18N('dsp_sbp_brdcast-psh-tsk_label_junk-sms'),
        odbUser: formatI18N('dsp_sbp_brdcast-psh-tsk_label_odb-usr'),
        comment: formatI18N('dsp_sbp_brdcast-psh-tsk_header_comment'),
        addBtn: formatI18N('dsp_sbp_brdcast-psh-tsk_button_add-btn'),
        browseBtn: formatI18N('dsp_sbp_brdcast-psh-tsk_button_browse-btn'),
        wrkReg: formatI18N('dsp_sbp_brdcast-psh-tsk_label_wrk-reg-date'),
        deleteBtn: formatI18N('dsp_sbp_delivery-regulation_header_delete'),
        ngListLbl: formatI18N('dsp_sbp_brdcast-psh-tsk_label_ng-list')
    }
    onChangeNgListTextArea = newText => {
        this.setState({
            text: newText.value,
            charCount: newText.value.length,
            error: newText.value.length > 300
        });
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

    }
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName,  jsoParams).then(data => {
            console.log('Here');
            // this.props.pollingResponse = data;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }

    deleteFile = fileDeleted => {
        console.log('File that is deleted :', fileDeleted);
        var whiteListId = '';
        var blackListId ='';
        if (this.state.selectedItemList === 'Whitelist') {
            whiteListId= fileDeleted.taskId;
            const params = [ {
                'name': 'task_id',
                'value': this.state.detailList.taskIdList
            }, {
                'name': 'whitelist_id',
                'value': whiteListId.toString()
            } ];
            this.executeServiceOperationAdapter('SO_SBP_RemoveWhitelistFromBulkPushTask', params);
        } else if (this.state.selectedItemList === 'Blacklist') {
            blackListId=fileDeleted.taskId;
            const params = [ {
                'name': 'task_id',
                'value': this.state.detailList.taskIdList
            }, {
                'name': 'blacklist_id',
                'value': blackListId.toString()
            } ];
            this.executeServiceOperationAdapter('SO_SBP_RemoveBlacklistFromBulkPushTask', params);
        } else {
            console.log('No Registration List');
        }

    }
   downloadFile = fileDownloaded => {

       if (fileDownloaded.listType==='Blacklist') {
           const url = '/custom-app/rest/sbp/downloadBlacklist';
           const url_request_param = url + '?taskId=' + fileDownloaded.taskId + '&blackListId=' + fileDownloaded.listId;
           //  console.log('Came to loop of black', url_request_param);
           //  var newUrl = encodeURIComponent(url_request_param);
           //  console.log('downloaded', newUrl);
           window.location.href = url_request_param;
       } else if (fileDownloaded.listType==='Whitelist') {
           const url = '/custom-app/rest/sbp/downloadWhitelist';
           const url_request_param = url + '?taskId=' + fileDownloaded.taskId + '&whiteListId=' + fileDownloaded.listId;
           console.log('Came to loop of black', url_request_param);

           window.location.href = url_request_param;
       } else {
           console.log('No Registration');
       }

   }

    uploadFile = fileUploaded => {
        console.log('Value for File Uploaded', fileUploaded);
        console.log('List Type for broadcast', this.state.selectedItemList);
        const data = new FormData();
        var listType ='';
        var invalidArray=[];
        data.append('file', fileUploaded);
        var url ='';
        var fetchProperties = {
            method: 'POST',
            body: data
        };
        if (this.state.selectedItemList==='Blacklist') {
            url = '/custom-app/rest/sbp/uploadBlacklist';
            listType = this.state.selectedItemList;
        } else if (this.state.selectedItemList==='Whitelist') {
            url = '/custom-app/rest/sbp/uploadWhitelist';
            listType = this.state.selectedItemList;
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
                        if (id === 0 && data.invalidDataList) {
                            for (var key in data.invalidDataList) {
                                var errorMsg='';
                                errorMsg= data.invalidDataList[key].input +'--'+data.invalidDataList[key].reason;
                                invalidArray.push(errorMsg);
                            }
                            this.setState({ ngListValue: invalidArray });
                        } else if (id!=='' && id!=='undefined' && id!==null) {
                            if (this.state.selectedItemList === 'Whitelist') {
                                whiteListId=id;
                            } else if (this.state.selectedItemList === 'Blacklist') {
                                blackListId=id;
                            } else {
                                console.log('No Registration List');
                            }
                            console.log('InvalidList:', data.invalidDataList);
                            if (data.invalidDataList) {
                                for (var invalidKey in data.invalidDataList) {
                                    var invalidMsg='';
                                    invalidMsg= data.invalidDataList[invalidKey].input +'--'+data.invalidDataList[invalidKey].reason;
                                    invalidArray.push(invalidMsg);
                                }
                                this.setState({ ngListValue: invalidArray });
                            }
                            this.setState({
                                listId: id,
                                listType: listType
                            });
                            console.log('Came to loop', id);
                            if (data.invalidDataList.length===0) {
                                this.addBulkListItems(whiteListId, blackListId);
                            }
                        }
                    });
                })
            .catch(
                error => {
                    console.log('Error in Uploading List', error);
                });
    }
    onNgListValidation = ngListValue => {
        this.setState({ ngListValue: ngListValue });
    }
    addBulkListItems = (whiteListId, blackListId) => {
        if (whiteListId !== ''&& whiteListId!=='undefined') {
            const params = [ {
                'name': 'task_id',
                'value': this.state.detailList.taskIdList
            },
            {
                'name': 'whitelist_id',
                'value': whiteListId
            } ];
            this.executeServiceOperationAdapter('SO_SBP_AddWhitelistToBulkPushTask', params);
        } else if (blackListId !== ''&& blackListId!=='undefined') {
            const params = [ {
                'name': 'task_id',
                'value': this.state.detailList.taskIdList
            },
            {
                'name': 'blacklist_id',
                'value': blackListId
            } ];
            this.executeServiceOperationAdapter('SO_SBP_AddBlacklistToBulkPushTask', params);
        } else {
            console.log('NO file upload');
        }
    }
    render() {
        return (
            <div>
                <FormLayout>
                    <div className="container-fluid" id="detailedSection">
                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelModelName" text={this.state.modelName} />
                            </div>
                            <div className="col-sm-4">
                                <span>{this.state.detailList.modelName}</span>
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelSendCancel" text={this.state.sendCancel} />
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelROUser" text={this.state.roUser} />

                            </div>
                            { this.state.selectedItemRO === 'true'?
                                <div className="col-sm-2">
                                    <span>Send</span>
                                </div> :
                                <div className="col-sm-2">
                                    <span>Do not Send</span>
                                </div>}
                        </div>

                        <div className="row">
                            <div className="col-sm-2" />
                            <div className="col-sm-4" />
                            <div className="col-sm-2" />
                            <div className="col-sm-2">
                                <Label position="left" id="labelROSMS" text={this.state.junkSms} />
                            </div>
                            { this.state.selectedItemDenied === 'true'?
                                <div className="col-sm-2">
                                    <span>Send</span>
                                </div> :
                                <div className="col-sm-2">
                                    <span>Do not Send</span>
                                </div>
                            }
                        </div>

                        <div className="row">
                            <div className="col-sm-2" />
                            <div className="col-sm-4" />
                            <div className="col-sm-2" />
                            <div className="col-sm-2">
                                <Label position="left" id="labelODBUser" text={this.state.odbUser} />
                            </div>
                            { this.state.selectedItemODB === 'true'?
                                <div className="col-sm-2">
                                    <span>Send</span>
                                </div> :
                                <div className="col-sm-2">
                                    <span>Do not Send</span>
                                </div>}
                        </div>

                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelpushPeriod" text={this.state.pushPeriod} />:
                            </div>
                            <div className="col-sm-4">
                                <span style={this.datatext2Style}> {this.state.detailList.startTime} {this.state.detailList.endTime}  </span>
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelWorkRegistration" text={this.state.wrkReg} />
                            </div>
                            <div className="col-sm-2">
                                <span style={this.datatext2Style}>{this.state.detailList.inserted}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelWorkMessageText" text={this.state.msgTitle} />
                            </div>
                            <div className="col-sm-6">
                                <span style={this.datatext2Style}>{this.state.detailList.messageTitle}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelUser" text={this.state.usr} />
                            </div>
                            <div className="col-sm-4">
                                <span style={this.datatext2Style}>{this.state.detailList.userName}</span>
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelUserComment" text={this.state.comment} />
                            </div>
                            <div className="col-sm-3">
                                <span style={this.datatext2Style}>{this.state.detailList.description}</span>
                            </div>
                        </div>
                        { this.state.selectedItemList !== 'No List Registration' ?
                            <div className="row">
                                <div className="col-sm-2">
                                    <Label position="left" id="labelWhiteList" text={this.state.selectedItemList} />
                                </div>
                                <div className="col-sm-4 datatext2">
                                    <FileUploaderWrapper listItems={this.state.listItems} fileUploaded={this.uploadFile} listId={this.state.listId} ngListValue={this.onNgListValidation} fileDeleted={this.deleteFile} initialList={this.props.detailPage.list_id} taskId={this.props.detailPage.taskIdList} fileDownloaded={this.downloadFile} listType={this.state.selectedItemList} />
                                </div>
                            </div>
                            : null }
                        <ManageBroadcastDetailsProgressTable detailsList={this.state.detailList} />

                        <div className="row">
                            <div className="col-sm-6">
                                <TextArea id="notes" label={this.state.ngListLbl} text={this.state.ngListValue} onChange={this.onChangeNgListTextArea} />
                            </div>
                        </div>
                    </div>
                </FormLayout>
            </div>
        );
    }
}
ManageBroadcastDetailsPage.propTypes = {
    receivedData: PropTypes.object,
    selectedItemList: PropTypes.string,
    selectedFile: PropTypes.object,
    modelName: PropTypes.string,
    title: PropTypes.string,
    cautionText: PropTypes.string,
    startDateValue: PropTypes.string,
    endDateValue: PropTypes.string,
    registerPerson: PropTypes.string,
    comment: PropTypes.string,
    selectedItemRO: PropTypes.string,
    selectedItemDenied: PropTypes.string,
    selectedItemODB: PropTypes.string,
    detailPage: PropTypes.object,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    detailsList: PropTypes.object,
    listItems: PropTypes.string,
    ngListValue: PropTypes.array

};