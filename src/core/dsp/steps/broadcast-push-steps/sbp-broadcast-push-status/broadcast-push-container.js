import React from 'react';
import { DataGrid, ExpansionPanel } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from './../../../services/i18n-label-service';
import './broadcast-push-container.styl';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';
import ManageBroadcastDetailsPage from './sbp-broadcast-push-details';
import PropTypes from 'prop-types';
import CommonUtils from '../../../utils/common.utils';
const Item = ({
    isOpen, detailsValue, listItems, ...props
}) => {
    let result;
    console.log('Details Value:', detailsValue);
    if (isOpen) {
        result = (
            <div>
                <div style={{ height: '35px', width: '300px', color: 'rgba(0,0,0,0.87)', fontFamily: 'Nokia Pure Text Medium', fontSize: '20px', fontWeight: 500, lineHeight: '21px', paddingBottom: '18px', paddingTop: '18px' }}>{formatI18N('dsp_sbp_create-sms-task_header_detailed-information')}</div>
                <ManageBroadcastDetailsPage detailPage={detailsValue} listItems={listItems} {...props} />
            </div>
        );
    } else {
        result = (
            <div className="parentPanel">
                <div style={{ height: '35px', width: '300px', color: 'rgba(0,0,0,0.87)', fontFamily: 'Nokia Pure Text Medium', fontSize: '20px', fontWeight: 500, lineHeight: '21px', paddingBottom: '18px', paddingTop: '18px' }}>{formatI18N('dsp_sbp_create-sms-task_header_detailed-information')}</div>
            </div>
        );
    }
    return result;
};
export default class ManageBroadcastMainPage extends React.Component {
  onDelete = event => {
      console.log('Delete clicked' + event);
  }

  componentDidUpdate() {
      console.log('Inside componentDidUpdate');

      if (this.state.nextFunctionToCall ==='getBroadcastData') {
          const params =[
              {
                  'name': 'id',
                  'value': this.state.taskIdList
              }
          ];
          console.log('componentDidUpdate');
          this.executeServiceOperationAdapter('SO_SBP_GetBulkPushTasksById', params);
          setTimeout(() => {
              this.setState({ nextFunctionToCall: 'NA', jsoCalled: 'NA' });
          }, 3000);

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

  componentDidMount() {
      const params =[
          {
              'name': 'id',
              'value': this.state.taskIdList
          }
      ];

      console.log('TaskID called', this.state.taskIdList);
      this.executeServiceOperationAdapter('SO_SBP_GetBulkPushTasksById', params);

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
      if (this.state.localDev) {
          setTimeout(() => {
              console.log('Calling after Settime out >>');
              let soResult = ManageBroadcastMainPage.getDerivedStateFromProps(this.props, this.state);
              console.log('Calling after Settime out soResult>>', soResult);
              this.setState(soResult);
          }, 1000);
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

  cellRendererButtonDetail(params) {
      
      var eDiv = document.createElement('div');
      eDiv.innerHTML = '<span class="my-css-class"><button id="detail_' + params.data.id + '" class="inter-btn-simple">'+this.state.detailBtn+'</button></span>';
      var querySelId = '#detail_' + params.data.id;
      var eButton = eDiv.querySelector(querySelId);
     
      eButton.addEventListener('click', function addListener() {
          document.getElementById('detailedSection').style.display = 'block';
         
          this.setState({ showDetails: true });
      });
      return eDiv;
  }


  cellRendererButtonPause(params) {
      var eDiv = document.createElement('div');
      const statusCheck = (params.data.status === 'SCHEDULED' || params.data.status === 'RUNNING') ? true : false;
      if (statusCheck) {
          eDiv.innerHTML = '<span class="my-css-class"><button id="interrupt_' + params.data.id + '" class="inter-btn-simple">'+this.state.pauseBtn+'</button></span>';
          var querySelId = '#interrupt_' + params.data.id;
          var eButton = eDiv.querySelector(querySelId);
          var that = this;
          eButton.addEventListener('click', this.pauseBroadcast.bind(that, params.data.id));
      }
      return eDiv;
  }

  pauseBroadcast(broadcastId) {
      console.log('Ready to pause ' + broadcastId);
      let paramsForPause = [
          {
              'name': 'id',
              'value': broadcastId
          } ];
      this.executeServiceOperationAdapter('SO_SBP_SuspendBulkPushTask', paramsForPause);
  }
  cellRendererButtonResume(params) {
      var eDiv = document.createElement('div');
      const statusCheck = (params.data.status === 'PAUSED') ? true : false;
      if (statusCheck) {
          eDiv.innerHTML = '<span class="my-css-class" ><button id="' + params.data.id + '" class="restart-btn-simple">'+this.state.resumeBtn+'</button></span>';
          var eButton = eDiv.querySelectorAll('.restart-btn-simple')[0];
          var that = this;
          eButton.addEventListener('click', this.resumeBroadcast.bind(that, params.data.id));
      }
      return eDiv;
  }


  resumeBroadcast(broadcastId) {
      console.log('Ready to resume ' + broadcastId);
      let paramsForResume = [
          {
              'name': 'id',
              'value': broadcastId
          } ];
      this.executeServiceOperationAdapter('SO_SBP_ResumeBulkPushTask', paramsForResume);
  }

  cellRendererButtonCancel(params) {
      var eDiv = document.createElement('div');
      const statusCheck = (params.data.status === 'SCHEDULED'  || params.data.status === 'PAUSED' || params.data.status === 'RUNNING') ? true : false;
      if (statusCheck) {
          eDiv.innerHTML = '<span class="my-css-class"><button id="stop_' + params.data.id + '" class="stop-btn-simple">'+this.state.cancelBtn+'</button></span>';
          var eButton = eDiv.querySelectorAll('.stop-btn-simple')[0];
          var that = this;
          eButton.addEventListener('click', this.cancelBroadcast.bind(that, params.data.id));
      }
      return eDiv;
  }

  cancelBroadcast(broadcastId) {
      console.log('Ready to cancel/stop ' + broadcastId);
      let paramsForCancel = [
          {
              'name': 'id',
              'value': broadcastId
          } ];
      this.executeServiceOperationAdapter('SO_SBP_StopBulkPushTask', paramsForCancel);
  }
  onFileSelect = event => {
      console.log('Delete clicked' + event);
  }
  constructor(props) {
      super(props);
      this.results = null;
      this.state={
          broadcastData: [],
          sourcePage: null,
          showDetails: false,
          messageOnUI: '',
          selectedItemList: this.props.receivedData ? props.receivedData.selectedItemList : '',
          selectedFile: this.props.receivedData ? props.receivedData.selectedFile : null,
          list_id: this.props.receivedData ? props.receivedData.list_id : null,
          modelName: this.props.receivedData ? this.props.receivedData.modelName : '',
          detailPageVal: {},
  	      getBulkTaskList: [],
          localDev: false,
          jsoCalled: 'NA',
          resultsFromFetchJSO: {},
          ngListValue: this.props.ngListValue,
          taskIdList: this.props.taskIdList,
          detailTableHeader: formatI18N('dsp_sbp_create-sms-task_header_detail'),
          pauseTableHeader: formatI18N('dsp_sbp_create-sms-task_header_pause'),
          cancelTableHeader: formatI18N('dsp_sbp_create-sms-task_header_cancel'),
          resumeTableHeader: formatI18N('dsp_sbp_create-sms-task_header_resume'),
          modelNameTableHeader: formatI18N('dsp_sbp_create-sms-task_header_model-name'),
          workRegistrationDateTableHeader: formatI18N('dsp_sbp_create-sms-task_header_work-registration-date'),
          regPersonTableHeader: formatI18N('dsp_sbp_create-sms-task_header_registered-person'),
          commentTableHeader: formatI18N('dsp_sbp_create-sms-task_header_comment'),
          statusTableHeader: formatI18N('dsp_sbp_create-sms-task_header_status'),
          cautionTextTableHeader: formatI18N('dsp_sbp_create-sms-task_header_caution-text'),
          detailBtn: formatI18N('dsp_sbp_create-sms-task_header_detail'),
          pauseBtn: formatI18N('dsp_sbp_create-sms-task_header_pause'),
          cancelBtn: formatI18N('dsp_sbp_create-sms-task_header_cancel'),
          resumeBtn: formatI18N('dsp_sbp_brdcast-psh-task_header_resumeBtn'),
          nextFunctionToCall: 'NA',
          listItems: {},
          isJsoError: false
      };

      var detailBtn = this.state.detailBtn;
      var pauseBtn = this.state.pauseBtn;
      var cancelBtn = this.state.cancelBtn;
      var resumeBtn = this.state.resumeBtn;
      this.onDelete = this.onDelete.bind(this);
      this.onGridReady = this.onGridReady.bind(this);
      let columnDefs = [

          {
              headerName: detailBtn, field: 'detailBtn',
              cellRenderer: this.cellRendererButtonDetail.bind(this),
              width: 60, suppressFilter: true
          },
          {
              headerName: pauseBtn, field: 'interruptButton',
              cellRenderer: this.cellRendererButtonPause.bind(this),
              width: 80, suppressFilter: true
          },
          {
              headerName: cancelBtn, field: 'cancelButton',
              cellRenderer: this.cellRendererButtonCancel.bind(this),
              width: 60, suppressFilter: true
          },
          {
              headerName: resumeBtn, field: 'restartButton',
              cellRenderer: this.cellRendererButtonResume.bind(this),
              width: 80, suppressFilter: true
          },
          { headerName: formatI18N('dsp_sbp_create-sms-task_header_model-name'), field: 'modelName', width: 100, suppressFilter: true },
          { headerName: formatI18N('dsp_sbp_create-sms-task_header_work-registration-date'), field: 'inserted', width: 100, suppressFilter: true },
          { headerName: this.state.regPersonTableHeader, field: 'username', width: 100, suppressFilter: true },
          { headerName: this.state.commentTableHeader, field: 'description', width: 100, suppressFilter: true },
          { headerName: formatI18N('dsp_sbp_create-sms-task_header_status'), field: 'status', width: 100, suppressFilter: true },
          {
              headerName: formatI18N('dsp_sbp_create-sms-task_header_caution-text'), field: 'message',
              width: 100, suppressFilter: true,
              cellRenderer: this.cellRendererCautionText.bind(this)
          }

      ];

      this.gridOptions = {
          columnDefs

      };
  }

  onGridReady = params => {
      this.api = params.value.api;
      // api.setDomLayout();
  }
  cellRendererCautionText(params) {
    let cautionText = params.data.message;
    cautionText = cautionText.substring(0, 16);
    return cautionText;
  }
  static getDerivedStateFromProps(props, state) {
      let getBulkResult='';
      let operationResult ='NA';
      var arrayList = [];
      let model = {};
      var modelItem = {};
      if (state.jsoCalled === 'SO_SBP_GetBulkPushTasksById') {
          if (state.localDev) {
              if (state.resultsFromFetchJSO) {
                  getBulkResult = state.resultsFromFetchJSO[state.jsoCalled].results.properties.resultData.items;
                  console.log('Prad Data from JSO via Fetch');
                  return { getBulkTaskList: getBulkResult, nextFunctionToCall: 'NA' };
              }
          } else  {
              if (props.getResults('SO_SBP_GetBulkPushTasksById')) {
                  console.log('Prad get Results from JSO', props.getResults('SO_SBP_GetBulkPushTasksById'));
                  getBulkResult = props.getResults('SO_SBP_GetBulkPushTasksById').results.properties.resultData.items;
                  getBulkResult.map(bulkData => {
                      model.modelName= bulkData.modelName;
                      model.inserted=bulkData.inserted;
                      model.messageTitle=bulkData.messageTitle;
                      model.userName=bulkData.username;
                      model.description=bulkData.description;
                      model.startTime=bulkData.startTime;
                      model.endTime = bulkData.endTime;
                      model.selectedListItem=state.selectedItemList;
                      model.taskIdList=state.taskIdList;
                      model.selectedFile=state.selectedFile;
                      model.allowUsersBlockingSpams=bulkData.allowUsersBlockingSpams;
                      model.allowInROUser=bulkData.allowInROUser;
                      model.allowInODBUser=bulkData.allowInODBUser;
                      model.list_id=state.list_id;
                      model.totalNumber=bulkData.processState.totalNumber;
                      model.successNumber=bulkData.processState.successNumber;
                      model.failureNumber=bulkData.processState.failureNumber;
                      model.sentNumber=bulkData.processState.sentNumber;
                      model.status=bulkData.status;
                      model.retryCount=bulkData.retryCount;
                      model.updated=bulkData.updated;
                  });
                  modelItem.filename = state.selectedFile.name;
                  modelItem.listId = state.list_id;
                  modelItem.taskId = state.taskIdList;
                  modelItem.status = 'complete';
                  modelItem.listType = state.selectedItemList;
                  modelItem.uploadDate = CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' });
                  arrayList.push(modelItem);
                  return { getBulkTaskList: getBulkResult, nextFunctionToCall: 'NA', detailPageVal: model,listItems: arrayList, messageOnUI: 'An Error has occured. Please contact your Administrator' };
              }
          }
      } else if (state.jsoCalled === 'SO_SBP_DeleteBulkPushTask') {
          if (!state.localDev) {
              if (props.getResults('SO_SBP_DeleteBulkPushTask')) {
                  console.log('Prad get Results from JSO', props.getResults('SO_SBP_DeleteBulkPushTask'));
                  operationResult = props.getResults('SO_SBP_DeleteBulkPushTask').results.resolution.value;
                  if (operationResult === 'SUCCESS') {
                      return { nextFunctionToCall: 'getBroadcastData', messageOnUI: ' Task Deleted Successfully' };
                  } else {
                      return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                  }

              }
          }
      } else if (state.jsoCalled === 'SO_SBP_SuspendBulkPushTask') {
          if (!state.localDev) {
              if (props.getResults('SO_SBP_SuspendBulkPushTask')) {
                  console.log('Prad get Results from JSO', props.getResults('SO_SBP_SuspendBulkPushTask'));
                  operationResult = props.getResults('SO_SBP_SuspendBulkPushTask').results.resolution.value;
                  if (operationResult === 'SUCCESS') {
                      return { nextFunctionToCall: 'getBroadcastData' };
                  } else {
                      return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                  }
              }
          }
      } else if (state.jsoCalled === 'SO_SBP_ResumeBulkPushTask') {
          if (!state.localDev) {
              if (props.getResults('SO_SBP_ResumeBulkPushTask')) {
                  console.log('Prad get Results from JSO', props.getResults('SO_SBP_ResumeBulkPushTask'));
                  operationResult = props.getResults('SO_SBP_ResumeBulkPushTask').results.resolution.value;
                  if (operationResult === 'SUCCESS') {
                      return { nextFunctionToCall: 'getBroadcastData', messageOnUI: 'Task Resumed Successfully' };
                  } else {
                      return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                  }
              }
          }
      }  else if (state.jsoCalled === 'SO_SBP_StopBulkPushTask') {
          if (!state.localDev) {
              if (props.getResults('SO_SBP_StopBulkPushTask')) {
                  console.log('Prad get Results from JSO', props.getResults('SO_SBP_StopBulkPushTask'));
                  operationResult = props.getResults('SO_SBP_StopBulkPushTask').results.resolution.value;
                  if (operationResult === 'SUCCESS') {
                      return { nextFunctionToCall: 'getBroadcastData' };
                  } else {
                      return { isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                  }
              }
          }
      }
      return null;
  }
  render() {
      return (
          <div id="manage-broadcast-container-id" className="container-fluid manage-broadcast-container-page">

              <div style={{ height: 100 }}>
                  <DataGrid columnManagementFilterConfig={{ isEnable: false }} suppressRowClickSelection={true} disableMultiActionToolbar={true} disableRowActions={true} onGridReady={this.onGridReady} gridOptions={this.gridOptions}
                      rowData={this.state.getBulkTaskList} id="manage-broadcast-datagrid-id"
                  />
              </div>
              <div style={{ display: 'none' }} id="detailedSection">
                  <ExpansionPanel id="expansionPanel" height={30} onExpand={e => { console.log(e); }}
                      onCollapse={e => { console.log(e); }}
                  >
                      <Item detailsValue={this.state.detailPageVal} listItems={this.state.listItems} {...this.props} />
                  </ExpansionPanel>
              </div>
          </div>
      );

  }

}

ManageBroadcastMainPage.propTypes = {
    sourcePage: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    receivedData: PropTypes.object,
    selectedItemList: PropTypes.string,
    selectedFile: PropTypes.object,
    taskIdList: PropTypes.object,
    modelName: PropTypes.string,
    startDateValue: PropTypes.string,
    registerPerson: PropTypes.string,
    comment: PropTypes.string,
    cautionText: PropTypes.string,
    detailPage: PropTypes.object
};