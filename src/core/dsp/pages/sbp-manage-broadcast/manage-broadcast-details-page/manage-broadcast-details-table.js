import React from 'react';
import './manage-broadcast-details.styl';
import { formatI18N } from '../../../services/i18n-label-service';
import PropTypes from 'prop-types';

export default class ManageBroadcastDetailsProgressTable extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            progressStatus: formatI18N('dsp_sbp_brdcast-psh-tsk_header_prgrs-status'),
            estimatedEnd: formatI18N('dsp_sbp_brdcast-psh-tsk_header_estmd-end'),
            numOfRetries: formatI18N('dsp_sbp_brdcast-psh-tsk_header_num-retries'),
            startDate: formatI18N('dsp_sbp_brdcast-psh-tsk_header_strt-date'),
            stopDate: formatI18N('dsp_sbp_brdcast-psh-tsk_header_end-date'),
            totNum: formatI18N('dsp_sbp_brdcast-psh-tsk_header_total-num'),
            sentNum: formatI18N('dsp_sbp_brdcast-psh-tsk_header_sent-num'),
            readySend: formatI18N('dsp_sbp_brdcast-psh-tsk_header_ready-send'),
            failNum: formatI18N('dsp_sbp_brdcast-psh-tsk_header_failure-num'),
            complDate: formatI18N('dsp_sbp_brdcast-psh-tsk_header_cmpltn-date'),
            succNum: formatI18N('dsp_sbp_brdcast-psh-tsk_header_succesd-num')
        };
    }

    render() {
        return (
            <div className="manage-broadcast-detail-table-container">
                <div className="manage-broadcast-detail-table-column">
                    <div className="manage-broadcast-detail-table-rowFlex row-header rowspan">
                        {this.state.progressStatus}
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex  row-data rowspan">
                        {this.props.detailData.status}
                    </div>
                </div>

                <div className="manage-broadcast-detail-table-column">
                    <div className="manage-broadcast-detail-table-rowFlex row-header">
                        {this.state.estimatedEnd}
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.numOfRetries}
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex row-data" >
                        <b>JSO change*</b>
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        {this.props.detailData.retryCount}
                    </div>
                </div>

                <div className="manage-broadcast-detail-table-column">
                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.startDate}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.stopDate}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        {this.props.detailData.startTime}
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        {this.props.detailData.endTime}
                    </div>
                </div>

                <div className="manage-broadcast-detail-table-column">
                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.totNum}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.sentNum}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        <b>{this.props.detailData.processStatus.totalNumber}</b>
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        <b>{this.props.detailData.processStatus.sentNumber}</b>
                    </div>
                </div>

                <div className="manage-broadcast-detail-table-column">
                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.readySend}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.failNum}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        <b>JSO change*</b>
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        <b>{this.props.detailData.processStatus.failureNumber}</b>
                    </div>
                </div>

                <div className="manage-broadcast-detail-table-column">
                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.complDate}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-header" >
                        {this.state.succNum}
                    </div>

                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        <b>{this.props.detailData.updated}</b>
                    </div>
                    <div className="manage-broadcast-detail-table-rowFlex row-data">
                        <b>{this.props.detailData.processStatus.successNumber}</b>
                    </div>
                </div>
            </div>
        );
    }
}

ManageBroadcastDetailsProgressTable.propTypes = {
    detailData: PropTypes.object
};