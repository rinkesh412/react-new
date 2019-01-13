import React from 'react';
import PropTypes from 'prop-types';
import { formatI18N } from '../../../services/i18n-label-service';
import ManageBroadcastMainPage from './broadcast-push-container';
const manageBroadcastMainPage = <ManageBroadcastMainPage />;

export default class SBPBroadcastStatusStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItemList: this.props.receivedData ? props.receivedData.selectedItemList : '',
            selectedFile: this.props.receivedData ? props.receivedData.selectedFile : null,
            modelName: this.props.receivedData ? this.props.receivedData.modelName : '',
            title: this.props.receivedData ?  this.props.receivedData.title : '',
            cautionText: this.props.receivedData ? this.props.receivedData.cautionText : '',
            startDateValue: this.props.receivedData ?  this.props.receivedData.startDateValue : '',
            endDateValue: this.props.receivedData ?  this.props.receivedData.endDateValue : '',
            selectedItemRO: this.props.receivedData ? this.props.receivedData.selectedItemRO : '',
            selectedItemDenied: this.props.receivedData ? this.props.receivedData.selectedItemDenied : '',
            selectedItemODB: this.props.receivedData ? this.props.receivedData.selectedItemODB : '',
            registerPerson: this.props.receivedData ? this.props.receivedData.registerPerson : '',
            comment: this.props.receivedData ? this.props.receivedData.comment : '',
            taskIdList: this.props.receivedData ? this.props.receivedData.taskIdList:'',
            list_id: this.props.receivedData ? this.props.receivedData.list_id:'',
            ngListValue: this.props.ngListValue?this.props.ngListValue:'',
            // taskIdList: this.props.taskIdList,
            panels: [ manageBroadcastMainPage ],
            headings: [ 'Broadcast PUSH Status' ],
            broadcastPushStatusSectionHeader: formatI18N('dsp_sbp_create-sms-task_header_broadcast-push-status'),
        };
    }

    render() {
        console.log('File from Push Status PG: ', this.state.selectedFile);
        return (
            <div>
                <div>
                    <ManageBroadcastMainPage sourcePage="broadCastPushStatusPage" statusTableShow={true}
                        modelName={this.state.modelName} startDateValue={this.state.startDateValue}
                        registerPerson={this.state.registerPerson} comment={this.state.comment}
                        cautionText={this.state.cautionText} taskIdList={this.state.taskIdList} {...this.props}
                    />
                </div>
            </div>
        );
    }
}
SBPBroadcastStatusStep.propTypes = {
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    receivedData: PropTypes.object,
    selectedItemList: PropTypes.string,
    selectedFile: PropTypes.object,
    modelName: PropTypes.string,
    startDateValue: PropTypes.string,
    registerPerson: PropTypes.string,
    comment: PropTypes.string,
    cautionText: PropTypes.string,
    taskIdList: PropTypes.string

};