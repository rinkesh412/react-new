import React from "react";
import PropTypes from "prop-types";
import {
  FormLayout,
  Button,
  DataGrid,
  Label,
  TextInput,
  TextArea,
  SelectItem
} from "@nokia-csf-uxr/csfWidgets";
import { formatI18N } from "../../../services/i18n-label-service";
import CommonUtils from "../../../utils/common.utils";
import { executeSOMessagesViaFetch } from "../../../services/manage-messages.service";
import "./sbp-test-caution-text-selection.styl";

const operations = [
  {
    label: CommonUtils.getLocaleText({ en: "Clear", ja: "クリア" }),
    value: "Clear"
  },
  {
    label: CommonUtils.getLocaleText({
      en: "New Registration",
      ja: "新規登録"
    }),
    value: "New Registration"
  },
  {
    label: CommonUtils.getLocaleText({ en: "Change", ja: "変更" }),
    value: "Change"
  },
  {
    label: CommonUtils.getLocaleText({ en: "Delete", ja: "削除" }),
    value: "Delete"
  }
];
let invalidTitle = false;
let invalidCaution = false;
let requiredFields = false;
let isDisabled = true;
let isExecuteDisabled = true;
export default class SBPTestCautionTextSelectionStep extends React.Component {
  updateSelectedValues(subject, message, id) {
    invalidTitle = false;
    invalidCaution = false;
    requiredFields = false;
    isDisabled = false;
    console.log("button was clicked!!" + subject);
    this.setState({
      titleValue: subject,
      cautionText: message,
      messageTemplateId: id
    });
  }

  cellRendererRadioButton(params) {
    var eDiv = document.createElement("div");
    eDiv.innerHTML =
      '<span class="my-css-class"> <input class="radio-simple" type="radio" id="caution_item_radio_' +
      params.data.id +
      '" name="gender" value="' +
      params.data.id +
      '">';
    var querySelId = "#caution_item_radio_" + params.data.id;
    var eradioButton = eDiv.querySelector(querySelId);
    var that = this;
    eradioButton.addEventListener(
      "click",
      this.updateSelectedValues.bind(
        that,
        params.data.subject,
        params.data.message,
        params.data.id
      )
    );
    return eDiv;
  }

  cellRendererCautionText(params) {
    let cautionText = params.data.message;
    cautionText = cautionText.substring(0, 16);
    return cautionText;
  }

  componentDidUpdate() {
    console.log("Inside componentDidUpdate");
    if (this.state.nextFunctionToCall === "getTemplate") {
      console.log("componentDidUpdate - Get Template Going to call");
      this.setState({
        nextFunctionToCall: "NA",
        jsoCalled: "SO_SBP_GetMessageTemplate"
      });
      this.executeServiceOperationAdapter("SO_SBP_GetMessageTemplate", []);
      // this.setState({ nextFunctionToCall: 'NA' });
    }

    if (this.state.messageOnUI !== "") {
      setTimeout(() => {
        console.log("Clear Messae on UI");
        this.setState({ messageOnUI: "" });
      }, 3000);
    }
  }
  constructor(props) {
    super(props);
    console.log("Props inside constructor", props);
    this.state = {
      localDev: false,
      jsoCalled: "NA",
      resultsFromFetchJSO: {},
      nextFunctionToCall: "NA",
      messageOnUI: "",
      modelName: props.receivedData ? props.receivedData.modelName : "",
      title: "",
      cautionText: "",
      titleValue: "",
      cautionTextDataList: [],
      selectedItem: "",
      currentRowNum: 4,
      selectedRowNum: 0,
      isOpen: true,
      isTitleReq: false,
      isCautioTxtReq: false,
      cautionTextSectionHeader: formatI18N(
        "dsp_sbp_create-sms-task_header_caution-text-selectEditRegister"
      ),
      cautionTextNumberTableHeader: formatI18N(
        "dsp_sbp_create-sms-task_header_caution-text-number"
      ),
      titleTableHeader: formatI18N("dsp_sbp_create-sms-task_header_title"),
      cautionTextTableHeader: formatI18N(
        "dsp_sbp_create-sms-task_header_caution-text"
      ),
      lastEditDateTableHeader: formatI18N(
        "dsp_sbp_create-sms-task_header_last-edit-date"
      ),
      titleLabel: formatI18N("dsp_sbp_create-sms-task_label_title"),
      cautionTextLabel: formatI18N(
        "dsp_sbp_create-sms-task_label_caution-text"
      ),
      executionButtonLabel: formatI18N(
        "dsp_sbp_create-sms-task_label_execution"
      ),
      selectionComplete: formatI18N(
        "dsp_sbp_create-sms-task_label_selection-complete"
      ),
      titleReqMsg: formatI18N("dsp_sbp_create-sms-task-message-title-required"),
      cautionTxtReqMsg: formatI18N(
        "dsp_sbp_create-sms-task-message-caution-txt-required"
      ),
      message1: formatI18N("dsp_sbp_create-sms-task-ui-message-1"),
      message2: formatI18N("dsp_sbp_create-sms-task-ui-message-2"),
      message3: formatI18N("dsp_sbp_create-sms-task-ui-message-3")
    };
    this.results = null;
    const columnDefs = [
      {
        headerName: "",
        field: "select",
        cellRenderer: this.cellRendererRadioButton.bind(this),
        width: 60
      },
      {
        headerName: this.state.cautionTextNumberTableHeader,
        field: "id",
        width: 90
      },
      { headerName: this.state.titleTableHeader, field: "subject", width: 90 },
      {
        headerName: this.state.cautionTextTableHeader,
        field: "message",
        width: 90,
        cellRenderer: this.cellRendererCautionText.bind(this)
      },
      {
        headerName: this.state.lastEditDateTableHeader,
        field: "last_edited",
        width: 90
      }
    ];

    this.gridOptions = {
      columnDefs,
      domLayout: "autoHeight",
      enableFilter: false,
      enableSorting: false
    };
  }

  executionHanlder = params => {
    this.validateRegistration();
    if (!invalidTitle && !invalidCaution && !requiredFields) {
      switch (this.state.selectedItem) {
        case "Clear":
          this.setState({ titleValue: "" });
          this.setState({ cautionText: "" });
          break;
        // eslint-disable-next-line no-case-declarations
        case "New Registration": {
          console.log("New Registration data Title", this.state.titleValue);
          console.log(
            "New Registration data caution Text",
            this.state.cautionText
          );
          let paramsNewRegister = [
            {
              name: "messageTemplateId",
              value: ""
            },
            {
              name: "subject",
              value: this.state.titleValue
            },
            {
              name: "body",
              value: this.state.cautionText
            }
          ];
          this.executeServiceOperationAdapter(
            "SO_SBP_SaveMessageTemplate",
            paramsNewRegister
          );
          break;
        }
        case "Delete": {
          console.log("To be deleted ID", this.state.messageTemplateId);
          let paramsForDelete = [
            {
              name: "messageTemplateId",
              value: this.state.messageTemplateId
            }
          ];
          this.executeServiceOperationAdapter(
            "SO_SBP_DeleteMessageTemplate",
            paramsForDelete
          );
          this.setState({ titleValue: "" });
          this.setState({ cautionText: "" });
          break;
        }
        case "Change": {
          console.log("New Registration data Title", this.state.titleValue);
          console.log(
            "New Registration data caution Text",
            this.state.cautionText
          );
          let paramsUpdated = [
            {
              name: "messageTemplateId",
              value: this.state.messageTemplateId
            },
            {
              name: "subject",
              value: this.state.titleValue
            },
            {
              name: "body",
              value: this.state.cautionText
            }
          ];
          this.executeServiceOperationAdapter(
            "SO_SBP_SaveMessageTemplate",
            paramsUpdated
          );
          break;
        }
        default:
          break;
      }
    } else {
      console.log("Caution Validation Fails");
    }
    console.log(params);
  };

  /*  executionHanlder = params => {
        console.log(params);
        // let rowData = this.state.cautionTextDataList;
        switch (this.state.selectedItem) {
            case 'Clear':
                this.setState({ title: '' });
                this.setState({ cautionText: '' });
                break;
            case 'New Registration': {
                const newRow = {};
                var currentRowNum = this.state.currentRowNum + 1;
                newRow.id = currentRowNum;
                newRow.cautionNumber = currentRowNum;
                newRow.cautionText = this.state.cautionText;
                newRow.title = this.state.titleValue;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                today = yyyy + '/' + mm + '/' + dd;
                newRow.lastDate = today;
                newRow.that = this;
                this.state.cautionTextDataList.push(newRow);
                this.api.setRowData(this.cautionTextDataList);
                // this.state.currentRowNum = currentRowNum;
                break;
            }
            case 'Delete': {
                var deleteRow = null;
                for (var i = 0; i < this.rowData.length; i++) {
                    var row = this.rowData[i];
                    if (row.id === this.state.selectedRowNum) {
                        deleteRow = row;
                        break;
                    }
                }
                this.rowData = this.rowData.filter(item => item !== deleteRow);
                this.api.setRowData(this.rowData);
                break;
            }
            case 'Change': {
                // var currentRow = null;
                for (var i2 = 0; i2 < this.rowData.length; i2++) {
                    var row2 = this.rowData[i2];
                    if (row2.id === this.state.selectedRowNum) {
                        this.rowData[i2].title = this.state.titleValue;
                        this.rowData[i2].cautionText = this.state.cautionText;
                        break;
                    }
                }
                this.api.setRowData(this.rowData);
                break;
            }
            default: {
                break;
            }

        }
        console.log(params);
    } */
  showDetails = e => {
    console.log(e);
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
  };
  onChangeTitle = newText => {
    requiredFields = false;
    invalidTitle = false;
    isDisabled = false;
    this.setState({
      titleValue: newText.value,
      titleValueError: newText > 16
    });
    invalidTitle = newText > 16;
  };

  onChangeCautionText = newText => {
    requiredFields = false;
    invalidCaution = false;
    isDisabled = false;
    this.setState({
      cautionText: newText.value,
      cautionTextValueError: newText > 660
    });
    invalidCaution = newText > 660;
  };

  validateRegistration = () => {
    let titleValue = this.state.titleValue;
    let cautionTextValue = this.state.cautionText;
    if (
      (titleValue === null || titleValue === "") &&
      (cautionTextValue === null || cautionTextValue === "")
    ) {
      requiredFields = true;
      this.setState({ isTitleReq: true, isCautioTxtReq: true });
    } else {
      console.log("both title,caution present");
      if (titleValue === null || titleValue === "" || titleValue.length > 16) {
        invalidTitle = true;
        this.setState({ isTitleReq: true });
      } else {
        invalidTitle = false;
        this.setState({ isTitleReq: false });
      }
      if (
        cautionTextValue === null ||
        cautionTextValue === "" ||
        cautionTextValue.length > 660
      ) {
        invalidCaution = true;
        this.setState({ isCautioTxtReq: true });
      } else {
        invalidCaution = false;
        this.setState({ isCautioTxtReq: false });
      }
    }
  };

  onClickSelectCompleteBtn = () => {
    this.validateRegistration();
    if (!invalidTitle && !invalidCaution && !requiredFields) {
      this.props.nextHandler &&
        this.props.nextHandler({
          data: {
            modelName: this.state.modelName,
            title: this.state.titleValue,
            cautionText: this.state.cautionText
          }
        });
    } else {
      console.log("Caution Text Registration page has validation errors");
    }
  };

  onChangeSelectedItem = newText => {
    isExecuteDisabled = false;
    this.setState({
      selectedItem: newText.value
    });
  };

  onGridReady = params => {
    this.api = params.value.api;
    this.api.sizeColumnsToFit();
  };

  componentDidMount() {
    invalidTitle = false;
    invalidCaution = false;
    requiredFields = false;
    isDisabled = true;
    isExecuteDisabled = true;

    /* getAllMessages().then(data => {
            this.setState({
                cautionTextDataList: data
            });
        }); */
    console.log("Props at componentDidMount Test Caution Text", this.props);
    // Step 1- Call the Adapter function - Where you need to call SO
    this.executeServiceOperationAdapter("SO_SBP_GetMessageTemplate", []);
  }

  // Step2- Write the Adapter Function
  executeServiceOperationAdapter(jsoName, jsoParams) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.jsoCalled = jsoName;

    if (this.state.localDev) {
      console.log("Calling JSO - using Fetch");
      this.executeLocalDevSOTestMessages(jsoName, jsoParams);
    } else {
      console.log("Calling JSO - using Servi", jsoName);
      this.props.executeServiceOperation(jsoName, jsoParams);
    }
    //  We call getDerivedStateFromProps. But update state only for local Dev
    /*  setTimeout(() => {
            console.log('Calling after Settime out >>');
            let soResult = SBPTestCautionTextSelectionStep.getDerivedStateFromProps(this.props, this.state);
            console.log('Calling after Settime out soResult>>', soResult);
            this.setState(soResult);
        }, 1000); */
  }

  // Step 3 - LocalDev - Gettin Data and Setting in Polling response
  executeLocalDevSOTestMessages(jsoName, jsoParams) {
    executeSOMessagesViaFetch(jsoName, jsoParams).then(data => {
      console.log("Here");
      // this.props.pollingResponse = data;
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.resultsFromFetchJSO[jsoName] = data;
    });
  }

  // Step 4 - Impelement getDerivedStateFromProps
  // eslint-disable-next-line complexity
  static getDerivedStateFromProps(props, state) {
    // let newstate = {};
    console.log(
      "Test Caution Text getDerivedStateFromProps call back poll reponse",
      props.pollingResponse
    );
    console.log("Test Caution Text state.jsoCalled >> ", state.jsoCalled);

    /* console.log('Test Caution Text getDerivedStateFromProps call back state >> ', state);
        console.log('Test Caution Text getDerivedStateFromProps call back props >> ', props);
        console.log('Jso Action ', state.jsoCalled); */

    let cautionListData = [];
    let operationResult;

    // If SO_SBP_GetMessageTemplate is called
    if (state.jsoCalled === "SO_SBP_GetMessageTemplate") {
      if (state.localDev) {
        if (state.resultsFromFetchJSO) {
          cautionListData =
            state.resultsFromFetchJSO[state.jsoCalled].results.properties
              .resultData;
          console.log("Prad Data from JSO via Fetch", cautionListData);
          return { cautionTextDataList: cautionListData };
        }
      } else {
        if (props.getResults("SO_SBP_GetMessageTemplate")) {
          console.log(
            "Prad SO_SBP_GetMessageTemplate Results from JSO",
            props.getResults("SO_SBP_GetMessageTemplate")
          );
          operationResult = props.getResults("SO_SBP_GetMessageTemplate")
            .results.result.value;
          if (operationResult === "3") {
            let resultProperties = props.getResults("SO_SBP_GetMessageTemplate")
              .results.properties;
            if (
              resultProperties.resultData &&
              resultProperties.resultData.items
            ) {
              cautionListData = resultProperties.resultData.items;
              console.log("Updated latest data");
            }
            return { cautionTextDataList: cautionListData };
          } else {
            console.log("Op result not 3 for SO_SBP_GetMessageTemplate");
            return {
              jsoCalled: "",
              isJsoError: true,
              messageOnUI:
                "An Error has occured. Please contact your Administrator"
            };
          }
        }
      }
    } else if (state.jsoCalled === "SO_SBP_SaveMessageTemplate") {
      if (state.localDev) {
        console.log("To do");
        return { nextFunctionToCall: "getTemplate" };
      } else {
        if (props.getResults("SO_SBP_SaveMessageTemplate")) {
          operationResult = props.getResults("SO_SBP_SaveMessageTemplate")
            .results.result.value;
          if (operationResult === "3") {
            return {
              jsoCalled: "SO_SBP_GetMessageTemplate",
              nextFunctionToCall: "getTemplate",
              messageOnUI: " Message Saved Successfully"
            };
          } else {
            return {
              jsoCalled: "",
              isJsoError: true,
              messageOnUI:
                "An Error has occured. Please contact your Administrator"
            };
          }
        }
      }
    } else if (state.jsoCalled === "SO_SBP_DeleteMessageTemplate") {
      if (state.localDev) {
        console.log("To do");
        return null;
      } else {
        if (props.getResults("SO_SBP_DeleteMessageTemplate")) {
          operationResult = props.getResults("SO_SBP_DeleteMessageTemplate")
            .results.result.value;
          if (operationResult === "3") {
            return {
              jsoCalled: "SO_SBP_GetMessageTemplate",
              nextFunctionToCall: "getTemplate",
              messageOnUI: " Message Deeleted Successfully"
            };
          } else {
            return {
              jsoCalled: "",
              isJsoError: true,
              messageOnUI:
                "An Error has occured. Please contact your Administrator"
            };
          }
        }
      }
    }

    // newstate.loading = false;
    return null;
  }

  render() {
    return (
      <div className="caution-item">
        <FormLayout>
          <div>
            <span id="SbpTestCautionTextNotifyArea">
              {" "}
              {this.state.messageOnUI}{" "}
            </span>
          </div>
          <div className="caution-item-text__input">
            <DataGrid
              onGridReady={this.onGridReady}
              gridOptions={this.gridOptions}
              rowData={this.state.cautionTextDataList}
              columnManagementFilterConfig={{ isEnable: false }}
              suppressRowClickSelection={true}
              disableMultiActionToolbar={true}
              disableRowActions={true}
              id="my-datagrid-id"
            />
          </div>

          <div className="row">
            <div className="col-sm-3 label-text-align">
              <Label id="titleLabel" text={this.state.titleLabel} />
            </div>
            <div className="col-sm-5">
              <TextInput
                text={this.state.titleValue}
                id="TextInputID3"
                onChange={this.onChangeTitle}
                error={this.state.titleValueError}
                errorMsg={this.state.titleValueErrorMsg}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3 label-text-align">
              <Label id="cautionTextLabel" text={this.state.cautionTextLabel} />
            </div>
            <div className="col-sm-6">
              <TextArea
                text={this.state.cautionText}
                id="TextAreaInputID4"
                onChange={this.onChangeCautionText}
                error={this.state.cautionTextValueError}
                errorMsg={this.state.cautionTextValueErrorMsg}
              />
            </div>
          </div>
          <div id="error-msg-id">
            {requiredFields || invalidTitle || this.state.isTitleReq ? (
              <span id="message-area-id-1" className="required-msg-show">
                {this.state.titleReqMsg} <br />
              </span>
            ) : (
              ""
            )}
            {requiredFields || invalidCaution || this.state.isCautioTxtReq ? (
              <span id="message-area-id-2" className="required-msg-show">
                {this.state.cautionTxtReqMsg} <br />
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="row">
            <div className="col-sm-5">
              <Button
                id="btnSelectComplete"
                text={this.state.selectionComplete}
                isCallToAction
                onClick={this.onClickSelectCompleteBtn}
                disabled={isDisabled}
              />
            </div>
            <div className="row">
              <div className="col-sm-3">
                <SelectItem
                  id="selection"
                  data={operations}
                  maxWidth={200}
                  selectedItem={this.state.selectedItem}
                  onChange={this.onChangeSelectedItem}
                  placeholder="Select"
                />
              </div>
              <div className="col-sm-3">
                <Button
                  id="execution"
                  text={this.state.executionButtonLabel}
                  isCallToAction
                  onClick={this.executionHanlder}
                  disabled={isExecuteDisabled}
                />
              </div>
            </div>
          </div>
        </FormLayout>
      </div>
    );
  }
}

SBPTestCautionTextSelectionStep.propTypes = {
  receivedData: PropTypes.object,
  nextHandler: PropTypes.func,
  backHandler: PropTypes.func,
  isOpen: PropTypes.bool,
  pollingResponse: PropTypes.object.isRequired,
  siteDefinition: PropTypes.object.isRequired,
  getIconUrl: PropTypes.func.isRequired,
  getResults: PropTypes.func.isRequired,
  executeServiceOperation: PropTypes.func.isRequired
};
