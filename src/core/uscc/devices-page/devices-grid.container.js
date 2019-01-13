import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    DataGrid,
    FloatingActionButton,
    AlertDialogConfirm,
    SelectItem
} from '@nokia-csf-uxr/csfWidgets';

import './devices-grid.container.styl';

export class DevicesGrid extends Component {
    constructor(props) {
        super(props);
        this.getGridOptions = this.getGridOptions.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.getDeleteConfirmView = this.getDeleteConfirmView.bind(this);
        this.getDeletedDevice = this.getDeletedDevice.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onSelectAccountChange = this.onSelectAccountChange.bind(this);
        this.state = {
            showConfirm: false,
            devices: []
        };
    }

    /* eslint-disable complexity */
    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.devices) === JSON.stringify(this.props.devices) && nextState.showConfirm === this.state.showConfirm) {
            return false;
        }

        if (this.api && JSON.stringify(nextProps.devices) !== JSON.stringify(this.props.devices)) {
            this.api.setRowData(nextProps.devices);
        }
        return true;
    }

    onGridReady(params) {
        this.api = params.value.api;
        this.api.sizeColumnsToFit();

        if (this.props.devices.length > 0) {
            this.api.setRowData(this.props.devices);
        }
    }

    getGridOptions() {
        return {
            columnDefs: [
                { headerName: 'ID', field: 'id', hide: true },
                { headerName: 'ICCID', field: 'iccid', width: 200 },
                { headerName: 'MEID', field: 'meid', width: 200 },
                { headerName: 'MDN', field: 'mdn', width: 200 },
                { headerName: 'Rate Plan Name', field: 'ratePlanName', width: 150 },
                { headerName: 'Label', field: 'label', width: 150 },
                { headerName: 'Data Used (KB)', field: 'dataUsed', width: 150 },
                { headerName: 'Date Created', field: 'dateCreated', width: 150 },
                { headerName: 'Updated Date', field: 'dateUpdated', width: 150 }
            ],
            rowAction: {
                types: [
                    {
                        name: 'Detail',
                        icon: this.props.getIconUrl('info')
                    },
                    {
                        name: 'Delete',
                        icon: this.props.getIconUrl('delete')
                    }
                ],
                callback: params => this.rowClick(params),
                disable() {
                    return false;
                },
            },
            deltaRowDataMode: true,
            getRowNodeId: devices => devices.id
        };
    }

    rowClick(params) {
        switch (params.value.name) {
            case 'Delete':
                this.deleteClick(params.value.items[ 0 ].data);
                break;

            default:
                // Detail
                this.props.viewDetailsClick(params.value.items[ 0 ].data);
                break;
        }
    }

    deleteClick() {
        this.setState(state => ({
            showConfirm: !state.showConfirm
        }));
    }

    getDeletedDevice() {
        if(this.api) {
            const device = this.api.getSelectedRows();
            return device.length > 0 ? device[0] : {};
        }
        return {};
    }

    getDeleteConfirmView() {
        if(this.state.showConfirm) {
            let device = this.getDeletedDevice();
            return (
                <AlertDialogConfirm
                    id={device.id}
                    title="Do you want to delete this device?"
                    confirmationText1="This device will disappear permanently from the system."
                    confirmationText2={device.id}
                    confirmationButtonLabel="DELETE"
                    onClose={this.onClose}
                    onConfirm={() => this.onConfirm(device.id)}
                    trapFocus={true}
                />
            );
        }
        return null;
    }

    onClose() {
        this.setState(() => ({
            showConfirm: false
        }));
    }

    onConfirm(deviceId) {
        this.setState(() => ({
            showConfirm: false
        }));
    }

    onSelectAccountChange(selected) {
        this.props.filterAccount(selected.value);
    }

    render() {
        const fobStyle = {
            'z-index': '10',
            'position': 'fixed',
            'right': '33px',
            'top': '70px',
            'background': 'rgb(37, 156, 250)'
        };
        return (
            <div className="devices-grid-container">
                <div className="devices-grid-header">
                    <div className="devices-grid-header__label">Devices</div>
                    <FloatingActionButton
                        style={fobStyle}
                        icon={this.props.getIconUrl('plus')}
                        onClick={this.props.addNew}
                    />
                </div>
                <SelectItem
                    id="deviceAccount"
                    label="Select an Account"
                    data={this.props.accounts}
                    selectedItem={this.props.selectedAccount}
                    onChange={this.onSelectAccountChange}
                />
                <div className="devices-grid-container__grid">
                    <DataGrid
                        onGridReady={this.onGridReady}
                        gridOptions={this.getGridOptions()}
                        rowData={[]}
                    />
                </div>

                {this.getDeleteConfirmView()}
            </div>
        );
    }
}

export default DevicesGrid;

DevicesGrid.propTypes = {
    accounts: PropTypes.array,
    devices: PropTypes.array,
    viewDetailsClick: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    addNew: PropTypes.func.isRequired,
    filterAccount: PropTypes.func.isRequired,
    selectedAccount: PropTypes.string
};

DevicesGrid.defaultProps = {
    devices: []
};