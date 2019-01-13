/* eslint-disable */
import React from 'react';
import { DataGrid, Button, FormLayout, Fieldset, CalendarNew, TextInput, SelectItem, Label, CheckBoxGroup, CheckBox, AlertDialogInfo } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from './../../services/i18n-label-service';
import './fum-hourly-push-layout';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import NumericEditor from '../sbp-hourly-push/numericEditor';

export default class FUMHourlyPushRate extends React.Component {
  constructor(props) {
    super(props);
    this.results = true;
    const NUMBER = /^[0-9]*$/;
    const NUMBER_WITH_WILD = /^[0-9?]*$/;
    this.gridOptions = {
      enableFilter: false,
      enableSorting: false,
      enableColResize: false,
    };

  }
  state = {
    defaultNumber: 0,
    checked: true,
    resultData: [],
    jsoCalled: 'none',
    nextFunctionToCall: 'none',
    isJsoError: false,
    messageOnUI: '',
    isValidationErrorRequired: false,
    validationErrorMessage: formatI18N('dsp_sbp_sms-settings_validation_error_message'),
    columnDefs: [
      {
        headerName: 'Hour', field: 'hour', lockPosition: true, width: 100, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black', backgroundColor: 'white' };
        }
      },
      {
        headerName: 'All resources', field: 'allResources', lockPosition: true, width: 100, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black', backgroundColor: 'white' };
        }
      },
      {
        headerName: 'Before Update',
        marryChildren: true,
        children: [
            { headerName: 'Docomo', field: 'docomoBefore', lockPosition: true, width: 90, suppressSizeToFit: true, cellStyle: function (params) {
              return { border: '.5px solid black', backgroundColor: 'white' };
            } },
            {headerName: 'M2M', field: 'm2mBefore', lockPosition: true, width: 90, minwidth: 75, maxWidth: 100, cellStyle: function (params) {
              return { border: '.5px solid black', backgroundColor: 'white' };
            } },
            {headerName: 'Individual', field: 'individualBefore', lockPosition: true, width: 120, cellStyle: function (params) {
              return { border: '.5px solid black', backgroundColor: 'white' };
            } },
        ],
        field: 'beforeChange1', lockPosition: true, width: 100, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black', backgroundColor: 'white' };
        }
      },
      {
        headerName: 'After Update',
        marryChildren: true,
        children: [
          {headerName: 'Docomo', field: 'docomoAfter', lockPosition: true, width: 90, suppressSizeToFit: true, editable: true, cellStyle: function (params) {
            return { boxSizing: 'border-box', border: '2px solid black', backgroundColor: 'white' };
          },
          cellEditorFramework: NumericEditor },
          {headerName: 'M2M', field: 'm2mAfter', lockPosition: true, width: 90, minwidth: 75, maxWidth: 100, editable: true, cellStyle: function (params) {
            return { boxSizing: 'border-box', border: '2px solid black', backgroundColor: 'white' };
          },
          cellEditorFramework: NumericEditor  },
          {headerName: 'Individual', field: 'individualAfter', lockPosition: true, width: 120, editable: true, cellStyle: function (params) {
            return { boxSizing: 'border-box', border: '2px solid black', backgroundColor: 'white' };
          },
          cellEditorFramework: NumericEditor },
      ],
      },
      {
        headerName: '', field: 'zero1', width: 30, suppressMenu: true, cellStyle: function (params) {
          return { borderRight: '.5px solid black', borderTop: '.5px solid black', borderBottom: '.5px solid black', backgroundColor: 'white' };
        }
      },
      {
        headerName: '', field: 'space', width: 5, suppressMenu: true, cellStyle: function (params) {
          return { border: '.5px solid black', backgroundColor: 'white' };
        }
      },
      
    ],
    
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
    for (let i = 0; i < 24; i++) {
      let rowData = this.gridApi.getRowNode(i);
      if (rowData.data.docomoAfter != 'undefined' && rowData.data.docomoAfter !== '') {
        console.log("show the validation error");
        this.setState({ isValidationErrorRequired: true });
        if (this.state.validationErrorField !== '') {
          this.setState({ validationErrorField: i + 'AM' });
        }
      }
      params.push({ 'name': 'hour_' + ('0' + i).slice(-2) + '_docomo', 'value': rowData.data.docomoBefore.replace(/,/g, '') });
      params.push({ 'name': 'hour_' + ('0' + i).slice(-2) + '_m2m', 'value': rowData.data.m2mBefore.replace(/,/g, '') });
      params.push({ 'name': 'hour_' + ('0' + i).slice(-2) + '_test', 'value': rowData.data.individualBefore.replace(/,/g, '') });
    }
    console.log("SO_UM_SetHourlyPushRate" + JSON.stringify(params));
    this.state.jsoCalled = 'SO_UM_SetHourlyPushRate';
    this.props.executeServiceOperation('SO_UM_SetHourlyPushRate', params);
    this.setState({ nextFunctionToCall: 'getSMSThrottlingConfig' });
    this.gridApi.refreshCells();
  }
  updateNodes(node, index) {
    if (node.group) {
    } else {
      var newValue1 = node.data.docomoAfter;
      if (newValue1 != null && newValue1 != '' && newValue1 != node.columnApi.columnController.allDisplayedColumns[3].colDef.headerName) {
        if (parseInt(newValue1 + '00') < parseInt(node.data.allResources)) {
          node.data.docomoBefore = newValue1 + '00';
          node.data.docomoAfter = '';
        }
      }
      var newValue2 = node.data.m2mAfter;
      if (newValue2 != null && newValue2 != '' && newValue1 != node.columnApi.columnController.allDisplayedColumns[3].colDef.headerName) {
        if (parseInt(newValue2 + '00') < parseInt(node.data.allResources)) {
          node.data.m2mBefore = newValue2 + '00';
          node.data.m2mAfter = '';
        }
      }
      var newValue3 = node.data.individualAfter;
      if (newValue3 != null && newValue3 != '' && newValue1 != node.columnApi.columnController.allDisplayedColumns[3].colDef.headerName) {
        if (parseInt(newValue3 + '00') < parseInt(node.data.allResources)) {
          node.data.individualBefore = newValue2 + '00';
          node.data.individualAfter = '';
        }
      }
    }
  }

  componentDidMount() {
    this.state.jsoCalled = 'SO_UM_GetHourlyPushRate';
    this.props.executeServiceOperation('SO_UM_GetHourlyPushRate', []);
  }

  componentDidUpdate() {
    console.log('Inside componentDidUpdate from hourly push');
    if (this.state.nextFunctionToCall === 'getSMSThrottlingConfig') {
      console.log('componentDidUpdate');
      this.props.executeServiceOperation('SO_UM_GetHourlyPushRate', []);
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
    if (nextProps.pollingResponse['SO_UM_GetHourlyPushRate']) {
      const result = nextProps.getResults('SO_UM_GetHourlyPushRate');
      if(result.results.properties.resultData){
        let resultDataFromJSO = result.results.properties.resultData.items;
        console.log(JSON.stringify(resultDataFromJSO));
        let rowData = [];
        for (let i = 0; i <= 23; i++) {
          let resourceValue = 0;
          let docomoValue = 0;
          let m2mValue = 0;
          let individualValue = 0;
          if (resultDataFromJSO) {
              console.log("parseInt(resultDataFromJSO[j].hour)-->",parseInt(resultDataFromJSO[i].hour));
              if (i === parseInt(resultDataFromJSO[i].hour)) {
                resourceValue = resultDataFromJSO[i].allResources;
                console.log("resourceValue-->",resourceValue);
                docomoValue = resultDataFromJSO[i].docomo;
                m2mValue = resultDataFromJSO[i].m2m;
                individualValue = resultDataFromJSO[i].test;

               /* if (resultDataFromJSO[j].maxLimit)
                  leftMaxValue = resultDataFromJSO[j].maxLimit;

              
              if (i === parseInt(resultDataFromJSO[j].hour - 12)) {
                rightvalue = resultDataFromJSO[j].limit;
                if (resultDataFromJSO[j].maxLimit)
                  rightMaxValue = resultDataFromJSO[j].maxLimit;
              } */
                rowData.push({ id: i, hour: i, allResources: resourceValue, docomoBefore : docomoValue, m2mBefore: m2mValue, individualBefore: individualValue, docomoAfter: '', m2mAfter: '', individualAfter: ''});
              }
          }  
        }
        console.log(rowData);

        return {
          resultData: rowData
        };
      }
    } else if (nextProps.pollingResponse['SO_UM_SetHourlyPushRate']) {
      const result = nextProps.getResults('SO_UM_SetHourlyPushRate');
      let resut = result.results.result;
      if (result === 3) {
        console.log("SO_UM_SetHourlyPushRate is SUCCESS");
      } else {
        console.log("SO_UM_SetHourlyPushRate is FAILED");
      }
    }
    return state;

  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const ColoredLine = ({ color }) => (<hr style={{ color: color, height: 1 }} />);
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
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div style={{
              height: "35px", width: "300px", fontFamily: "Nokia Pure Text Medium", fontSize: "20px", fontWeight: 500, lineHeight: "21px", paddingBottom: "18px", paddingTop: "18px"
            }}>SMS Hourly PUSH Rate</div>
          </div>
        </div>
        <ColoredLine color="black" />
        <div className="row">
          <div className="col-sm-12">
            &nbsp;
          </div>
        </div>
        <div style={{ height: 350, width: 870, padding: 30, overflow: 'hidden' }} >
          <AgGridReact columnDefs={this.state.columnDefs}
            rowData={this.state.resultData} onGridReady={this.onGridReady} gridOptions={this.gridOptions} id="my-datagrid-id" />
        </div>
        <div className="row">
          <div className="col-sm-12">
            &nbsp;
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            &nbsp;
          </div>
        </div>
        <div className="button-story__column">
          &nbsp;&nbsp;&nbsp;&nbsp;<button id="update" text="Renew" onClick={this.updateData}>Renew</button>
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
  updateNodes(node, index) {
    if (node.group) {
    } else {
      var newDocomoValue = node.data.docomoAfter;
      var newM2MValue = node.data.m2mAfter;
      var newIndTestValue = node.data.individualAfter;
      var pattern = /(-?\d+)(\d{3})/;
      if (newDocomoValue != null && newDocomoValue != '') {
        while (pattern.test(newDocomoValue))
          newDocomoValue = newDocomoValue.replace(pattern, "$1,$2");
        node.data.docomoBefore = newDocomoValue;
      }
      if (newM2MValue != null && newM2MValue != '') {
        while (pattern.test(newM2MValue))
          newM2MValue = newM2MValue.replace(pattern, "$1,$2");
        node.data.m2mBefore = newM2MValue;
      }
      if (newIndTestValue != null && newIndTestValue != '') {
        while (pattern.test(newIndTestValue))
          newIndTestValue = newIndTestValue.replace(pattern, "$1,$2");
        node.data.individualBefore = newIndTestValue;
      }
      node.data.docomoAfter = '';
      node.data.m2mAfter = '';
      node.data.individualAfter = '';
    }
  }
}

FUMHourlyPushRate.propTypes = {
  pollingResponse: PropTypes.object.isRequired,
  siteDefinition: PropTypes.object.isRequired,
  getIconUrl: PropTypes.func.isRequired,
  getResults: PropTypes.func.isRequired,
  executeServiceOperation: PropTypes.func.isRequired,
  executeWorkflow: PropTypes.func.isRequired
};
