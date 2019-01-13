import React, { Component } from "react";
import {
  FormLayout,
  Button,
  TextInput,
  Label
} from "@nokia-csf-uxr/csfWidgets";
import "bootstrap/dist/css/bootstrap.min.css";
import "./delete-result-operator.styl";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

class DeleteResultOperator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Model",
          marryChildren: true,
          width: 100,
          rowSpan: 2,
          children: [
            {
              headerName: "Archive File name",
              field: "archive",
              lockPosition: true,
              width: 300,
              editable: true,
              cellRenderer: this.cellRendererModel_ARCHIVE.bind(this)
            }
          ]
        },
        {
          headerName: "",
          marryChildren: true,
          children: [
            {
              headerName: "TAC",
              lockPosition: true,
              width: 100,
              editable: true,
              cellRenderer: this.cellRendererTAC.bind(this)
            }
          ]
        },
        {
          headerName: "",
          marryChildren: true,
          children: [
            {
              headerName: "CRVer",
              lockPosition: true,
              width: 100,
              editable: true,
              cellRenderer: this.cellRendererCRVER.bind(this)
            }
          ]
        },

        {
          headerName: "Date of start publish",
          marryChildren: true,
          width: 100,
          children: [
            {
              headerName: "Date of end publish",
              lockPosition: true,
              lockPosition: true,
              width: 300,
              editable: true,
              cellRenderer: this.cellRendererSTART_END.bind(this)
            }
          ]
        },
        {
          headerName: "",
          marryChildren: true,
          width: 150,
          children: [
            {
              headerName: "Action",
              lockPosition: true,
              lockPosition: true,
              width: 300,
              editable: true,
              cellRenderer: this.cellRendererACTION.bind(this)
            }
          ]
        }
      ],
      rowData: [
        {
          archive: "Toyota",
          tac: "999",
          crver: 1,
          startDate: "2019/01/21",
          endDate: "2019/01/25"
        },
        {
          archive: "Ford",
          tac: "123",
          crver: 5,
          startDate: "2018/01/20",
          endDate: "2018/02/25"
        }
      ]
    };
  }

  cellRendererModel_ARCHIVE(params) {
    console.log(params);
    var eDiv = document.createElement("div");
    let dataForTable =
      '<div class="ag-cell ag-cell-not-inline-editing ag-cell-with-height ag-cell-no-focus ag-cell-value">NO</div>';
    dataForTable +=
      '<div class="ag-cell ag-cell-not-inline-editing ag-cell-with-height ag-cell-no-focus ag-cell-value" style="margin-left:35%;border-left: 1px solid #ccc;">8 IOS</div>';
    dataForTable +=
      '<div class="ag-cell ag-cell-not-inline-editing ag-cell-with-height ag-cell-no-focus ag-cell-value" style="margin-left:70%;border-left: 1px solid #ccc;">RAO 8</div>';

    dataForTable = dataForTable;
    eDiv.innerHTML = dataForTable;
    return eDiv;
  }
  cellRendererTAC(params) {
    //console.log(params);
    var eDiv = document.createElement("div");
    let dataForTable =
      '<div class="my-css-class">' + params.data.tac + "</div>";
    dataForTable = dataForTable;
    eDiv.innerHTML = dataForTable;
    return eDiv;
  }
  cellRendererCRVER(params) {
    //console.log(params);
    var eDiv = document.createElement("div");
    let dataForTable =
      '<div class="my-css-class">' + params.data.crver + "</div>";
    dataForTable = dataForTable;
    eDiv.innerHTML = dataForTable;
    return eDiv;
  }
  cellRendererSTART_END(params) {
    //console.log(params);
    var eDiv = document.createElement("div");
    let dataForTable =
      '<div class="my-css-class">' +
      params.data.startDate +
      " , " +
      params.data.endDate +
      "</div>";
    dataForTable = dataForTable;
    eDiv.innerHTML = dataForTable;
    return eDiv;
  }
  cellRendererACTION(params) {
    //console.log(params);
    var eDiv = document.createElement("div");
    let dataForTable =
      '<div class="my-css-class"><button class="btn btn-success btn-sm">Delete</button></div>';
    dataForTable = dataForTable;
    eDiv.innerHTML = dataForTable;
    return eDiv;
  }

  render() {
    return (
      <div
        className="ag-theme-balham container"
        style={{
          height: "200px",
          width: "85%"
        }}
      >
        <h3>Delete Modal history</h3>
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
        />
      </div>
    );
  }
}

export default DeleteResultOperator;
