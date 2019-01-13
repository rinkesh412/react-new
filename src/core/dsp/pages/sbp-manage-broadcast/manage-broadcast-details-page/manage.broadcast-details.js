import React from 'react';
import { FormLayout, Label, TextArea } from '@nokia-csf-uxr/csfWidgets';
import './manage-broadcast-details.styl';
import FileUploaderWrapper from '../../../components/multiple-files-upload/uploaded-file-result';
import ManageBroadcastDetailsProgressTable from './manage-broadcast-details-table';
import { formatI18N } from '../../../services/i18n-label-service';
import PropTypes from 'prop-types';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';

export default class ManageBroadcastDetailsPage extends React.Component {

    constructor(props) {
        super(props);
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
        selectedFile: null,
        fileName: [],
        listId: '',
        listItems: this.props.listItems,
        listType: this.props.listType,
        ngListValue: '',
        // listType: this.props.detailData.blacklists.length>0?'Blacklist':'Whitelist',
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
        ngListLbl: formatI18N('dsp_sbp_brdcast-psh-tsk_label_ng-list'),
        sendLabel: formatI18N('dsp_sbp_sms-push-test_label_send'),
        doNotSendLabel: formatI18N('dsp_sbp_sms-push-test_label_not-send')
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
        var whiteListId = '';
        var blackListId ='';
        if (this.props.detailData.whitelists) {
            whiteListId= fileDeleted.listId;
            const params = [ {
                'name': 'task_id',
                'value': fileDeleted.taskId.toString()
            }, {
                'name': 'whitelist_id',
                'value': whiteListId.toString()
            } ];
            this.executeServiceOperationAdapter('SO_SBP_RemoveWhitelistFromBulkPushTask', params);
        } else if (this.props.detailData.blacklists) {
            blackListId=fileDeleted.listId;
            const params = [ {
                'name': 'task_id',
                'value': fileDeleted.taskId.toString()
            }, {
                'name': 'blacklist_id',
                'value': blackListId.toString()
            } ];
            this.executeServiceOperationAdapter('SO_SBP_RemoveBlacklistFromBulkPushTask', params);
        } else {
            console.log('No Registration List');
        }

    }
    onNgListValidation = ngListValue => {
        this.setState({ ngListValue: ngListValue });
    }
    downloadFile = fileDownloaded => {

        if (fileDownloaded.listType==='Blacklist') {
            const url = '/custom-app/rest/sbp/downloadBlacklist';
            const url_request_param = url + '?taskId=' + fileDownloaded.taskId + '&blackListId=' + fileDownloaded.listId;
            window.location.href = url_request_param;
        } else if (fileDownloaded.listType==='Whitelist') {
            const url = '/custom-app/rest/sbp/downloadWhitelist';
            const url_request_param = url + '?taskId=' + fileDownloaded.taskId + '&whiteListId=' + fileDownloaded.listId;
            window.location.href = url_request_param;
        } else {
            console.log('No Registration');
        }

    }
     uploadFile = fileUploaded => {
         var listType ='';
         const data = new FormData();
         var invalidArray=[];
         data.append('file', fileUploaded);
         var url ='';
         var fetchProperties = {
             method: 'POST',
             body: data
         };
         if (this.state.listType==='Blacklist') {
             url = '/custom-app/rest/sbp/uploadManageBlacklist?taskId='+this.props.detailData.id;
             listType='Blacklist';
         } else if (this.state.listType==='Whitelist') {
             url = '/custom-app/rest/sbp/uploadManageWhitelist?taskId='+this.props.detailData.id;
             listType='Whitelist';
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
                             if (this.props.detailData.whitelists) {
                                 whiteListId=id;
                             } else if (this.props.detailData.blacklists) {
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
                                 listId: id,
                                 listType: listType
                             });
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

    addBulkListItems = (whiteListId, blackListId) => {
        if (whiteListId !== ''&& whiteListId!=='undefined') {
            const params = [ {
                'name': 'task_id',
                'value': this.props.detailData.id
            },
            {
                'name': 'whitelist_id',
                'value': whiteListId
            } ];
            this.executeServiceOperationAdapter('SO_SBP_AddWhitelistToBulkPushTask', params);
        } else if (blackListId !== ''&& blackListId!=='undefined') {
            const params = [ {
                'name': 'task_id',
                'value': this.props.detailData.id
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
                                <span >{this.props.detailData.modelName}</span>
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelSendCancel" text={this.state.sendCancel} />
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelROUser" text={this.state.roUser} />

                            </div>
                            <div className="col-sm-2">
                                <span>{this.props.detailData.allowInROUser ==='true'?this.state.sendLabel:this.state.doNotSendLabel}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-2" />
                            <div className="col-sm-4" />
                            <div className="col-sm-2" />
                            <div className="col-sm-2">
                                <Label position="left" id="labelROSMS" text={this.state.junkSms} />
                            </div>
                            <div className="col-sm-2">
                                <span style={this.datatext2Style}>{this.props.detailData.allowUsersBlockingSpams ==='true'?this.state.sendLabel:this.state.doNotSendLabel}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-2" />
                            <div className="col-sm-4" />
                            <div className="col-sm-2" />
                            <div className="col-sm-2">
                                <Label position="left" id="labelODBUser" text={this.state.odbUser} />
                            </div>
                            <div className="col-sm-2">
                                <span style={this.datatext2Style}>{this.props.detailData.allowInODBUser ==='true'?this.state.sendLabel:this.state.doNotSendLabel}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelpushPeriod" text={this.state.pushPeriod} />:
                            </div>
                            <div className="col-sm-4">
                                <span style={this.datatext2Style}>{this.props.detailData.startTime} - {this.props.detailData.endTime} </span>
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelWorkRegistration" text={this.state.wrkReg} />
                            </div>
                            <div className="col-sm-2">
                                <span style={this.datatext2Style}>{this.props.detailData.inserted}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelWorkMessageText" text={this.state.msgTitle} />
                            </div>
                            <div className="col-sm-6">
                                <span style={this.datatext2Style}>{this.props.detailData.messageTitle}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelUser" text={this.state.usr} />
                            </div>
                            <div className="col-sm-4">
                                <span style={this.datatext2Style}>{this.props.detailData.username}</span>
                            </div>
                            <div className="col-sm-2">
                                <Label position="left" id="labelUserComment" text={this.state.comment} />
                            </div>
                            <div className="col-sm-3">
                                <span style={this.datatext2Style}>{this.props.detailData.description}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-2">
                                <Label position="left" id="labelWhiteBlackList" text={this.state.whiteBlck} />
                            </div>
                            <div className="col-sm-4 datatext2">
                                <FileUploaderWrapper selectedFile={this.state.selectedFile} listItems={this.props.listItems} fileUploaded={this.uploadFile} ngListValue={this.onNgListValidation} listId={this.state.listId}  fileDeleted={this.deleteFile} listType={this.state.listType} fileDownloaded={this.downloadFile} taskId={this.props.detailData.id} />
                            </div>
                        </div>
                        <ManageBroadcastDetailsProgressTable detailData={this.props.detailData} />

                        <div className="row">
                            <div className="col-sm-6">
                                <TextArea id="notes" label={this.state.ngListLbl} text={this.state.ngListValue} onChange={this.onChangeNgListTextArea}
                                    error={this.state.error} errorMsg="Too much text"
                                    maxCharCount={300}
                                />
                            </div>
                        </div>
                    </div>
                </FormLayout>
            </div>
        );
    }
}

ManageBroadcastDetailsPage.propTypes = {
    detailData: PropTypes.object,
    listItems: PropTypes.array,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    listType: PropTypes.string,
    ngListValue: PropTypes.array
};