import React from 'react';
import { DataGrid } from '@nokia-csf-uxr/csfWidgets';
import { getBroadcastItems } from '../../../services/manage-broadcast-datagrid.service';
import './manage-broadcast-container.styl';
import ManageBroadcastDetailsPage from '../manage-broadcast-details-page/manage.broadcast-details';
import PropTypes from 'prop-types';
import { formatI18N } from '../../../services/i18n-label-service';
import { ExpansionPanel } from '@nokia-csf-uxr/csfWidgets';
import CommonUtils from '../../../utils/common.utils';

let Item = ({
    isOpen, selectedData, listItems, listType, ...props
}) => {
    let result;
    console.log('LIST Type', listItems);
    if (isOpen) {
        result = (
            <div>
                <div style={{
                    height: '35px', width: '300px', color: 'rgba(0,0,0,0.87)', fontFamily: 'Nokia Pure Text Medium',
                    fontSize: '20px', fontWeight: 500, lineHeight: '21px', paddingBottom: '18px', paddingTop: '18px'
                }}
                >{formatI18N('dsp_sbp_create-sms-task_header_detailed-information')}</div>
                <ManageBroadcastDetailsPage detailData={selectedData} listItems={listItems} listType={listType} {...props} />
            </div>
        );
    } else {
        result = (
            <div className="parentPanel">
                <div style={{
                    height: '35px', width: '300px', color: 'rgba(0,0,0,0.87)', fontFamily: 'Nokia Pure Text Medium',
                    fontSize: '20px', fontWeight: 500, lineHeight: '21px', paddingBottom: '18px', paddingTop: '18px'
                }}
                >{formatI18N('dsp_sbp_create-sms-task_header_detailed-information')}</div>
            </div>
        );
    }
    return result;
};
export default class ManageBroadcastMainPage extends React.Component {

    state = {
        localDev: false,
        jsoCalled: 'NA',
        resultsFromFetchJSO: {},
        nextFunctionToCall: 'NA',
        messageOnUI: 'NA',
        isJsoError: false,
        broadcastData: [],
        selectedBroadCastData: {},
        listItems: [],
        listType: '',
        sourcePage: this.props.sourcePage,
        itemOpen: false,
        modelName: formatI18N('dsp_sbp_brdcast-psh-tsk_header_model-name'),
        wrkRegDate: formatI18N('dsp_sbp_brdcast-psh-tsk_header_wrk-reg-date'),
        regPerson: formatI18N('dsp_sbp_brdcast-psh-tsk_header_reg-person'),
        comment: formatI18N('dsp_sbp_brdcast-psh-tsk_header_comment'),
        status: formatI18N('dsp_sbp_brdcast-psh-tsk_header_sms-brdcast-push-status'),
        pushSituation: formatI18N('dsp_sbp_brdcast-psh-tsk_header_sms-brdcast-push-situatn'),
        cautionText: formatI18N('dsp_sbp_brdcast-psh-tsk_header_caution-text'),
        deleteBtn: formatI18N('dsp_sbp_delivery-regulation_header_delete'),
        pauseBtn: formatI18N('dsp_sbp_create-sms-task_header_pause'),
        cancelBtn: formatI18N('dsp_sbp_create-sms-task_header_cancel'),
        resumeBtn: formatI18N('dsp_sbp_brdcast-psh-task_header_resumeBtn'),
        brdcastTtle: formatI18N('dsp_sbp_brdcast-psh-tsk_header_sms-brdcast-push-situatn'),
        brdcastTitle: formatI18N('dsp_sbp_brdcast-psh-tsk_sub_header_brdcast-psh-tsk'),
        selectTitle: formatI18N('dsp_sbp_brdcast-psh-tsk_header_select')
    }

    onDelete = event => {
        console.log('Delete clicked' + event);
    }

    componentDidMount() {
        console.log('Props at componentDidMount ', this.props);
        this.executeServiceOperationAdapter('SO_SBP_GetBulkPushTasks', []);
    }

    componentDidUpdate() {
        console.log('Inside componentDidUpdate');
        if (this.state.nextFunctionToCall === 'getBroadcastData') {
            console.log('componentDidUpdate');
            this.executeServiceOperationAdapter('SO_SBP_GetBulkPushTasks', []);
            setTimeout(() => {
                this.setState({ nextFunctionToCall: 'NA', jsoCalled: 'NA' });
            }, 3000);

        }

        if (this.state.isJsoError) {
            console.log('An Error has occured. Please contact your Administrator');
            this.setState({ isJsoError: false });
        }

        if (this.state.messageOnUI !== 'NA') {
            setTimeout(() => {
                console.log('MB Container Clear Messae on UI');
                this.setState({ messageOnUI: 'NA', jsoCalled: 'NA' });
            }, 3000);
        }

    }

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
        //  We call getDerivedStateFromProps. But update state only for local Dev
        if (this.state.localDev) {
            setTimeout(() => {
                console.log('Calling after Settime out >>');
                let soResult = ManageBroadcastMainPage.getDerivedStateFromProps(this.props, this.state);
                console.log('Calling after Settime out soResult>>', soResult);
                this.setState(soResult);
            }, 1000);
        }

    }

    // Step 3 - LocalDev - Gettin Data and Setting in Polling response
    // eslint-disable-next-line no-unused-vars
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.resultsFromFetchJSO[jsoName] = getBroadcastItems(this.props.sourcePage);

    }

    // Step 4 - Impelement getDerivedStateFromProps
    // eslint-disable-next-line complexity
    static getDerivedStateFromProps(props, state) {
        // let newstate = {};
        console.log('Inside getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        console.log('Inside getDerivedStateFromProps call back state >> ', state);
        console.log('Inside getDerivedStateFromProps call back props >> ', props);
        let broadcastDataFromJSO = [];
        let operationResult = 'NA';

        // If SO_SBP_GetBulkPushTasks is called
        if (state.jsoCalled === 'SO_SBP_GetBulkPushTasks') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    broadcastDataFromJSO = state.resultsFromFetchJSO[state.jsoCalled];
                    console.log('Prad Data from JSO via Fetch', broadcastDataFromJSO);
                    return { broadcastData: broadcastDataFromJSO, messageOnUI: 'Loaded sucessfullyu' };
                }

            } else {
                if (props.getResults('SO_SBP_GetBulkPushTasks')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_GetBulkPushTasks'));
                    operationResult = props.getResults('SO_SBP_GetBulkPushTasks').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        let resultProperties = props.getResults('SO_SBP_GetBulkPushTasks').results.properties;
                        if (resultProperties.resultData && resultProperties.resultData.items) {
                            broadcastDataFromJSO = resultProperties.resultData.items;
                        }
                        return { broadcastData: broadcastDataFromJSO, messageOnUI: 'NA', jsoCalled: 'NA' };
                    } else {
                        return {
                            isJsoError: true, jsoCalled: 'NA',
                            messageOnUI: 'An Error has occured. Please contact your Administrator'
                        };
                    }

                }

            }
        } else if (state.jsoCalled === 'SO_SBP_DeleteBulkPushTask') {
            if (!state.localDev) {
                if (props.getResults('SO_SBP_DeleteBulkPushTask')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_DeleteBulkPushTask'));
                    operationResult = props.getResults('SO_SBP_DeleteBulkPushTask').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        return {
                            nextFunctionToCall: 'getBroadcastData',
                            jsoCalled: 'NA', messageOnUI: ' Task Deleted Successfully'
                        };
                    } else {
                        return {
                            isJsoError: true,
                            jsoCalled: 'NA', messageOnUI: 'An Error has occured. Please contact your Administrator'
                        };
                    }

                }
            }
        } else if (state.jsoCalled === 'SO_SBP_SuspendBulkPushTask') {
            if (!state.localDev) {
                if (props.getResults('SO_SBP_SuspendBulkPushTask')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_SuspendBulkPushTask'));
                    operationResult = props.getResults('SO_SBP_SuspendBulkPushTask').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        return {
                            nextFunctionToCall: 'getBroadcastData', jsoCalled: 'NA',
                            messageOnUI: 'Task Paused Successfully'
                        };
                    } else {
                        return {
                            isJsoError: true, jsoCalled: 'NA',
                            messageOnUI: 'An Error has occured. Please contact your Administrator'
                        };
                    }
                }
            }
        } else if (state.jsoCalled === 'SO_SBP_ResumeBulkPushTask') {
            if (!state.localDev) {
                if (props.getResults('SO_SBP_ResumeBulkPushTask')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_ResumeBulkPushTask'));
                    operationResult = props.getResults('SO_SBP_ResumeBulkPushTask').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        return {
                            nextFunctionToCall: 'getBroadcastData', jsoCalled: 'NA',
                            messageOnUI: 'Task Resumed Successfully'
                        };
                    } else {
                        return {
                            isJsoError: true,
                            jsoCalled: 'NA', messageOnUI: 'An Error has occured. Please contact your Administrator'
                        };
                    }
                }
            }
        } else if (state.jsoCalled === 'SO_SBP_StopBulkPushTask') {
            if (!state.localDev) {
                if (props.getResults('SO_SBP_StopBulkPushTask')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_StopBulkPushTask'));
                    operationResult = props.getResults('SO_SBP_StopBulkPushTask').results.resolution.value;
                    if (operationResult === 'SUCCESS') {
                        return {
                            nextFunctionToCall: 'getBroadcastData',
                            jsoCalled: 'NA', messageOnUI: 'Task Stopped Successfully'
                        };
                    } else {
                        return { isJsoError: true, jsoCalled: 'NA', messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }
            }
        }
        return null;
    }

    selectBroadcast(broadcastData) {
        // var broadcastDataValue = JSON.stringify(broadcastData);
        console.log('Selected Broadcast data ', broadcastData);
        // console.log('Broadcast WhiteList'+broadcastData.whitelists+'BlackList'+broadcastData.blacklists);
        var modelItem = {};
        var arrayList = [];
        var typeList ='';
        this.props.selectedBroadCastData = broadcastData;
        if (broadcastData.whitelists) {
            for (var key in broadcastData.whitelists) {
                modelItem = {};
                modelItem.filename = broadcastData.whitelists[key];
                modelItem.listId = key;
                modelItem.taskId = broadcastData.id;
                modelItem.status = 'complete';
                modelItem.listType = 'Whitelist';
                typeList='Whitelist',
                modelItem.uploadDate = CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' });
                arrayList.push(modelItem);
            }
        } else if (broadcastData.blacklists) {
            for (var blackKey in broadcastData.blacklists) {
                modelItem = {};
                modelItem.filename = broadcastData.blacklists[blackKey];
                modelItem.listId = blackKey;
                modelItem.status = 'complete';
                modelItem.taskId = broadcastData.id;
                modelItem.listType = 'Blacklist';
                typeList='Blacklist',
                modelItem.uploadDate = CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' });
                arrayList.push(modelItem);
            }
        } else {
            console.log('No list available');
        }
        this.setState({ selectedBroadCastData: broadcastData, listItems: arrayList, listType: typeList, itemOpen: false});
        document.getElementById('detailedSection').style.display = 'block';
    }

    deleteBroadcast(broadcastId) {
        console.log('Ready to delete ' + broadcastId);
        let paramsForDelete = [
            {
                'name': 'id',
                'value': broadcastId
            }];
        this.executeServiceOperationAdapter('SO_SBP_DeleteBulkPushTask', paramsForDelete);
    }
    pauseBroadcast(broadcastId) {
        console.log('Ready to pause ' + broadcastId);
        let paramsForPause = [
            {
                'name': 'id',
                'value': broadcastId
            }];
        this.executeServiceOperationAdapter('SO_SBP_SuspendBulkPushTask', paramsForPause);
    }
    cancelBroadcast(broadcastId) {
        console.log('Ready to cancel/stop ' + broadcastId);
        let paramsForCancel = [
            {
                'name': 'id',
                'value': broadcastId
            }];
        this.executeServiceOperationAdapter('SO_SBP_StopBulkPushTask', paramsForCancel);
    }
    resumeBroadcast(broadcastId) {
        console.log('Ready to resume ' + broadcastId);
        let paramsForResume = [
            {
                'name': 'id',
                'value': broadcastId
            }];
        this.executeServiceOperationAdapter('SO_SBP_ResumeBulkPushTask', paramsForResume);
    }

    cellRendererRadioButtonSelect(params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<span class="my-css-class"> <input class="radio-simple" type="radio" id="' + params.data.id + '" name="radio-btn" value="" >';
        var eradioButton = eDiv.querySelectorAll('.radio-simple')[0];
        var that = this;
        eradioButton.addEventListener('click', this.selectBroadcast.bind(that, params.data));
        return eDiv;
    }

    cellRendererButtonDelete(params) {
        var eDiv = document.createElement('div');
        const statusCheck = (params.data.status === 'CANCELED' || params.data.status === 'DONE') ? true : false;
        if (statusCheck) {
            eDiv.innerHTML = '<span class="my-css-class"><button id="delete_' + params.data.id + '" class="inter-btn-simple">' + this.state.deleteBtn + '</button></span>';
            var querySelId = '#delete_' + params.data.id;
            var eButton = eDiv.querySelector(querySelId);
            var that = this;
            eButton.addEventListener('click', this.deleteBroadcast.bind(that, params.data.id));
        }
        return eDiv;
    }


    cellRendererButtonPause(params) {
        var eDiv = document.createElement('div');
        const statusCheck = (params.data.status === 'SCHEDULED' || params.data.status === 'RUNNING') ? true : false;
        if (statusCheck) {
            eDiv.innerHTML = '<span class="my-css-class"><button id="interrupt_' + params.data.id + '" class="inter-btn-simple">' + this.state.pauseBtn + '</button></span>';
            var querySelId = '#interrupt_' + params.data.id;
            var eButton = eDiv.querySelector(querySelId);
            var that = this;
            eButton.addEventListener('click', this.pauseBroadcast.bind(that, params.data.id));
        }
        return eDiv;
    }

    cellRendererButtonCancel(params) {
        var eDiv = document.createElement('div');
        const statusCheck = (params.data.status === 'SCHEDULED' || params.data.status === 'PAUSED' || params.data.status === 'RUNNING') ? true : false;
        if (statusCheck) {
            eDiv.innerHTML = '<span class="my-css-class"><button id="stop_' + params.data.id + '" class="stop-btn-simple">' + this.state.cancelBtn + '</button></span>';
            var eButton = eDiv.querySelectorAll('.stop-btn-simple')[0];
            var that = this;
            eButton.addEventListener('click', this.cancelBroadcast.bind(that, params.data.id));
        }
        return eDiv;
    }

    cellRendererButtonResume(params) {
        var eDiv = document.createElement('div');
        const statusCheck = (params.data.status === 'PAUSED') ? true : false;
        if (statusCheck) {
            eDiv.innerHTML = '<span class="my-css-class" ><button id="' + params.data.id + '" class="restart-btn-simple">' + this.state.resumeBtn + '</button></span>';
            var eButton = eDiv.querySelectorAll('.restart-btn-simple')[0];
            var that = this;
            eButton.addEventListener('click', this.resumeBroadcast.bind(that, params.data.id));
        }
        return eDiv;
    }

    constructor(props) {
        super(props);
        this.results = null;
        this.onDelete = this.onDelete.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        // var regPersonLabel = this.state.regPerson;
        /*  var showPause = this.state.showPause;
        if (showPause) {
            console.log('Show pause button');
            this.state.setState({ showPause: true });
        } */
        // var comment = this.state.comment;

        let columnDefs = [
            {
                headerName: this.state.selectTitle, field: 'select',
                cellRenderer: this.cellRendererRadioButtonSelect.bind(this),
                width: 60, suppressFilter: true
            },
            {
                headerName: this.state.deleteBtn, field: 'deleteButton',
                cellRenderer: this.cellRendererButtonDelete.bind(this),
                width: 80, suppressFilter: true
            },
            {
                headerName: this.state.pauseBtn, field: 'interruptButton',
                cellRenderer: this.cellRendererButtonPause.bind(this),
                width: 80, suppressFilter: true
            },
            {
                headerName: this.state.cancelBtn, field: 'cancelButton',
                cellRenderer: this.cellRendererButtonCancel.bind(this),
                width: 60, suppressFilter: true
            },
            {
                headerName: this.state.resumeBtn, field: 'restartButton',
                cellRenderer: this.cellRendererButtonResume.bind(this),
                width: 80, suppressFilter: true
            },
            { headerName: this.state.regPerson, field: 'username', width: 120, suppressFilter: true },
            { headerName: this.state.comment, field: 'description', width: 90, suppressFilter: true },
            { headerName: this.state.pushSituation, field: 'status', width: 180, suppressFilter: true },
            {
                headerName: this.state.cautionText, field: 'message',
                width: 90, suppressFilter: true
            }

        ];
        if (this.props.sourcePage !== 'manageBroadcast') {
            columnDefs = columnDefs.splice(1);
        }
        this.gridOptions = {
            columnDefs

        };

    }

    onGridReady = params => {
        this.api = params.value.api;
        this.api.sizeColumnsToFit();
    }
    showDetailSection = () => {
        this.setState({ showDetails: !this.state.showDetails });
    }
    showDetailsRow = e => {
        console.log('showDetailsRow-->>>>', e);
        const id = parseInt(e.target.id);
        var showRow = null;
        for (var i = 0; i < this.rowData.length; i++) {
            var row = this.rowData[i];
            if (row.id === id) {
                showRow = row;
                break;
            }
        }
        this.setState({
            selectedRowNum: id
        });
        this.setState({ titleValue: showRow.title });
        this.setState({ cautionText: showRow.cautionText });
    }
    render() {
        return (
            <div id="manage-broadcast-container-id" className="container-fluid manage-broadcast-container-page">
                <div>
                    <span id="manageBroadcastNotifyArea"> {this.state.messageOnUI !== 'NA' ? this.state.messageOnUI : ''} </span>
                </div>
                <div>
                    <div className="col-sm-12">
                        <div style={{
                            height: '35px', width: '400px', color: 'rgba(0,0,0,0.87)', fontFamily:
                                'Nokia Pure Text Medium', fontSize: '30px', fontWeight: 500, lineHeight: '21px', paddingBottom: '18px', paddingTop: '18px'
                        }}
                        >{this.state.brdcastTitle}</div>
                    </div>
                </div>

                <div style={{ height: 300 }}>
                    <DataGrid columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true}
                        disableRowActions={true} onGridReady={this.onGridReady} gridOptions={this.gridOptions}
                        rowData={this.state.broadcastData} id="manage-broadcast-datagrid-id"
                    />
                </div>
                <div style={{ display: 'none' }} id="detailedSection">
                    <ExpansionPanel id="expansionPanel" height={30} onExpand={e => { console.log(e); }}
                        onCollapse={e => { console.log(e); }}
                    >
                        <Item selectedData={this.state.selectedBroadCastData} listItems={this.state.listItems} listType={this.state.listType}  isOpen={this.state.itemOpen} {...this.props} />
                    </ExpansionPanel>
                </div>
            </div>
        );

    }
}

ManageBroadcastMainPage.propTypes = {
    sourcePage: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    selectedBroadCastData: PropTypes.object,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired
};