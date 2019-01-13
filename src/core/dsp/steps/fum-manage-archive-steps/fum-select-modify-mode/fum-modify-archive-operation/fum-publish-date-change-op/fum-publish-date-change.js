/* eslint-disable */
import React from 'react';
import { DataGrid, Button, FormLayout, Fieldset, CalendarNew, TextInput, SelectItem, Label, CheckBoxGroup, CheckBox, AlertDialogInfo } from '@nokia-csf-uxr/csfWidgets';

export default class FUMPublishDateUpdate extends React.Component {
  state = {
    defaultNumber: 0,
    checked: true,
    smsTitle: formatI18N('dsp_sbp_sms-settings_page_header_sms-num-setting'),
    timeLbl: formatI18N('dsp_sbp_sms-settings_header_sms-num-time'),
    allResrcLbl: formatI18N('dsp_sbp_sms-settings_header_sms-num-all-resrc'),
    beforeChngLbl: formatI18N('dsp_sbp_sms-settings_header_sms-num-before-chng'),
    aftrChngLbl: formatI18N('dsp_sbp_sms-settings_header_sms-num-aftr-chng'),
    updateBtn: formatI18N('dsp_sbp_sms-settings_button_update-btn'),
    resultData: [],
    jsoCalled: 'none',
    nextFunctionToCall: 'none',
    isJsoError: false,
    messageOnUI: '',
    isValidationErrorRequired: false,
    validationErrorMessage: formatI18N('dsp_sbp_sms-settings_validation_error_message')
  }


  constructor(props) {
    super(props);
    this.results = true;
    const NUMBER = /^[0-9]*$/;
    const NUMBER_WITH_WILD = /^[0-9?]*$/;

    let columnDefs = [
      {
        headerName: '', field: 'publishDateHeader', width: 120, lockPosition: true, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black' };
        }
      },
      {
        headerName: this.state.beforeUpdateLbl, field: 'beforeUpdate', width: 120, lockPosition: true, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black' };
        }
      },
      {
        headerName: this.state.afterUpdateLbl, field: 'afterUpdate', width: 120, lockPosition: true, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black' };
        }
      },
    ]
    this.gridOptions = {
      columnDefs,
      enableFilter: false,
      enableSorting: false,
    };
    this.gridOptions.getRowStyle = function (params) {
      return { backgroundColor: 'white' }
    };
  }

  onChange = newText => this.setState({ text: newText.value });
  onCellClicked = (params) => {
    console.log("this is called");
  }
  updateData = () => {
    this.gridApi.forEachLeafNode(this.updateNodes);
    let params = [];
    this.setState({ validationErrorField: '' });
    this.setState({ isValidationErrorRequired: false });
    for (let i = 0; i < 12; i++) {
      let rowData = this.gridApi.getRowNode(i);
      if (rowData.data.afterChange1 != 'undefined' && rowData.data.afterChange1 !== '') {
        console.log("show the validation error");
        this.setState({ isValidationErrorRequired: true });
        if (this.state.validationErrorField !== '') {
          this.setState({ validationErrorField: i + 'AM' });
        }
      }
      if (rowData.data.afterChange2 && rowData.data.afterChange2 !== '') {
        console.log("show the validation error");
        this.setState({ isValidationErrorRequired: true });
        if (this.state.validationErrorField !== '') {
          this.setState({ validationErrorField:  (i == 0 ? 12 : i) + 'PM' });
        }
      }
      params.push({ 'name': 'hour_' + ('0' + i).slice(-2), 'value': rowData.data.beforeChange1.replace(/,/g, '') });
      params.push({ 'name': 'hour_' + (12 + i), 'value': rowData.data.beforeChange2.replace(/,/g, '') });
    }
    console.log("SO_SBP_SetSMSThrottlingConfig" + JSON.stringify(params));
    this.state.jsoCalled = 'SO_SBP_SetSMSThrottlingConfig';
    this.props.executeServiceOperation('SO_SBP_SetSMSThrottlingConfig', params);
    this.setState({ nextFunctionToCall: 'getSMSThrottlingConfig' });
    this.gridApi.refreshCells();
  }
  updateNodes(node, index) {
    if (node.group) {
    } else {
      var newValue1 = node.data.afterChange1;
      if (newValue1 != null && newValue1 != '' && newValue1 != node.columnApi.columnController.allDisplayedColumns[3].colDef.headerName) {
        if (parseInt(newValue1 + '00') < parseInt(node.data.allResources1)) {
          node.data.beforeChange1 = newValue1 + '00';
          node.data.afterChange1 = '';
        }
      }
      var newValue2 = node.data.afterChange2;
      if (newValue2 != null && newValue2 != '' && newValue1 != node.columnApi.columnController.allDisplayedColumns[3].colDef.headerName) {
        if (parseInt(newValue2 + '00') < parseInt(node.data.allResources2)) {
          node.data.beforeChange2 = newValue2 + '00';
          node.data.afterChange2 = '';
        }
      }
    }
  }

  componentDidMount() {
    this.state.jsoCalled = 'SO_SBP_GetSMSThrottlingConfig';
    this.props.executeServiceOperation('SO_SBP_GetSMSThrottlingConfig', []);
  }

  componentDidUpdate() {
    console.log('Inside componentDidUpdate from hourly push');
    if (this.state.nextFunctionToCall === 'getSMSThrottlingConfig') {
      console.log('componentDidUpdate');
      this.props.executeServiceOperation('SO_SBP_GetSMSThrottlingConfig', []);
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

  static getDerivedStateFromProps(nextProps, state) {
    console.log("getDerivedStateFromProps::nextProps::", nextProps + "::" + state);
    if (nextProps.pollingResponse['SO_SBP_GetSMSThrottlingConfig']) {
      const result = nextProps.getResults('SO_SBP_GetSMSThrottlingConfig');
      if(result.results.properties.resultData){
        let resultDataFromJSO = result.results.properties.resultData.items;
        console.log(JSON.stringify(resultDataFromJSO));
        let rowData = [];
        for (let i = 0; i <= 11; i++) {
          let leftvalue = 0;
          let rightvalue = 0;
          let leftMaxValue = 0;
          let rightMaxValue = 0;
          if (resultDataFromJSO) {
            for (var j = 0; j < resultDataFromJSO.length; j++) {
              if (i === parseInt(resultDataFromJSO[j].hour)) {
                leftvalue = resultDataFromJSO[j].limit;
                if (resultDataFromJSO[j].maxLimit)
                  leftMaxValue = resultDataFromJSO[j].maxLimit;
              }
              if (i === parseInt(resultDataFromJSO[j].hour - 12)) {
                rightvalue = resultDataFromJSO[j].limit;
                if (resultDataFromJSO[j].maxLimit)
                  rightMaxValue = resultDataFromJSO[j].maxLimit;
              }
            }
          }
          let j = i;
          if (i === 0) {
            j = 12;
          }
          rowData.push({ id: i, zero1: '00', zero2: '00', time1: i + ' AM', time2: j + ' PM', allResources1: leftMaxValue, allResources2: rightMaxValue, beforeChange1: leftvalue, beforeChange2: rightvalue, afterChange2: '', afterChange1: ''});
        }
      
        console.log(rowData);

        return {
          resultData: rowData
        };
      }
    } else if (nextProps.pollingResponse['SO_SBP_SetSMSThrottlingConfig']) {
      const result = nextProps.getResults('SO_SBP_SetSMSThrottlingConfig');
      let resut = result.results.result;
      if (result === 3) {
        console.log("SO_SBP_SetSMSThrottlingConfig is SUCCESS");
      } else {
        console.log("SO_SBP_SetSMSThrottlingConfig is FAILED");
      }
    }
    return state;

  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const ColoredLine = ({ color }) => (<hr style={{ color: color, backgroundColor: color, height: 1 }} />);
    let toolTipText;
    let label;
    let isOpen;
    let date;
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
              height: "30px", width: "300px", color: "rgba(0,0,0,0.87)", fontFamily:
                "Nokia Pure Text Medium", fontSize: "30px", fontWeight: 500, lineHeight: "21px", paddingBottom: "18px", paddingTop: "18px"
            }}>{this.state.smsTitle}</div>
          </div>
        </div>
        <ColoredLine color="black" />
        <div className="row">
          <div className="col-sm-12">
            &nbsp;
          </div>
        </div>
        <div>
          <span id="SbpHourlyPushNotifyArea"> {this.state.messageOnUI} </span>
        </div>
        <div style={{ height: 330, width: 800, padding: 10, overflow: 'hidden' }} >
          <AgGridReact onGridReady={this.onGridReady.bind(this)} rowData={this.state.resultData} gridOptions={this.gridOptions} id="my-datagrid-id" />
        </div>
        <div id="error-msg-id-1">
          {this.state.isValidationErrorRequired ?
            <span id="message-area-id-1" className="required-msg-show">
              {this.state.validationErrorField} {this.state.validationErrorMessage} <br />
            </span> : ''
          }
        </div>
        <div className="button-story__column">
          &nbsp;&nbsp;&nbsp;&nbsp;<Button id="update" text={this.state.updateBtn} onClick={this.updateData} isCallToAction>{this.state.updateBtn}</Button>
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
  }
}