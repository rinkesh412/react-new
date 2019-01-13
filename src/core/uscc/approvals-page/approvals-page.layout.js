import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ApprovalsGrid from './approvals-grid.container';
import ApprovalDetails from './approvals-details.container';

import Snackbar from '../snackbar/snackbar.container';

import { ProgressIndicatorCircular } from '@nokia-csf-uxr/csfWidgets';

import './approvals-page.layout.styl';

export class USCCApprovalsPage extends Component {
    constructor(props) {
        super(props);
        this.getInitialApprovalsData = this.getInitialApprovalsData.bind(this);
        this.approvePlan = this.approvePlan.bind(this);
        this.getView = this.getView.bind(this);
        this.switchToDetailsView = this.switchToDetailsView.bind(this);
        this.switchToGridView = this.switchToGridView.bind(this);
        this.executeSO = this.executeSO.bind(this);
        this.state = {
            approvals: this.getInitialApprovalsData(),
            approvedRatePlanName: '',
            snackbarMessage: '',
            approveRatePlanMessageHandled: false,
            handledSnackbarMessage: '',
            view: 'GRID',
            loading: true,
            approvalsData: ''
        };
    }

    /* eslint-disable complexity */
    static getDerivedStateFromProps(nextProps, prevState) {
        let state = {};

        if (nextProps.pollingResponse && nextProps.pollingResponse[ 'MySQLgetApprPendRatePlan' ]) {
            const result = nextProps.getResults('MySQLgetApprPendRatePlan');

            if (result.results.properties.sqlResult) {
                let sqlResultJson = JSON.parse(result.results.properties.sqlResult);
                if (prevState.approvalsData !== result.results.properties.sqlResult) {
                    state.approvalsData = result.results.properties.sqlResult;
                    let approvalsResult = [];
                    sqlResultJson.map(approval => {
                        let cDate = new Date(approval.Inserted);
                        approval.dateCreated = cDate.toLocaleString();
                        approvalsResult.push(approval);
                    });
                    state.approvals = approvalsResult;
                }
                state.loading = false;
            }
        }

        if (nextProps.pollingResponse && nextProps.pollingResponse[ 'MySQLupdateRatePlan' ]) {
            const result = nextProps.getResults('MySQLupdateRatePlan');
            let ratePlanStatus = result.results;

            if (ratePlanStatus.errors.items.length > 0) {
                if (prevState.approveRatePlanMessageHandled === false) {
                    state.snackbarMessage = ratePlanStatus.errors.items[ 0 ].message;
                    state.approveRatePlanMessageHandled = true;
                } else {
                    state.snackbarMessage = '';
                }
            } else {
                if (prevState.approvals) {
                    if (prevState.approveRatePlanMessageHandled === false) {
                        state.snackbarMessage = prevState.handledsnackbarMessage;
                        state.approveRatePlanMessageHandled = true;

                        let approvals = JSON.parse(JSON.stringify(prevState.approvals));
                        const ratePlanIdx = approvals.findIndex(ratePlan => ratePlan.Rate_Plan_Name === prevState.approvedRatePlanName);
                        approvals.splice(ratePlanIdx, 1);
                        state.approvals = approvals;
                    } else {
                        state.snackbarMessage = '';
                        state.handledSnackbarMessage = '';
                    }
                }
            }
        }

        return state;
    }

    componentDidMount() {
        this.setState({
            approveRatePlanMessageHandled: true,
            snackbarMessage: ''
        });
    }

    /* eslint-disable complexity */
    getInitialApprovalsData() {
        let result = this.props.getResults('MySQLgetApprPendRatePlan');
        if (result) {
            let result = (result && result.results.properties.sqlResult) ? JSON.parse(result.results.properties.sqlResult) : [];
            return result;
        } else {
            this.props.executeServiceOperation('MySQLgetApprPendRatePlan');
            return [];
        }
    }

    approvePlan(approvalState, planData) {
        let paramValue = {};
        let handledMessage = '';
        let inProcessMessage = '';
        if (approvalState === 'APPROVED') {
            paramValue.rateplan = planData.selectedRatePlan;
            paramValue.approvalstate = 'APPROVED';
            paramValue.product = planData.selectedProduct;
            paramValue.poolingallowed = planData.selectedPoolingAllowed;
            paramValue.rateplantype = planData.selectedRatePlanType;
            paramValue.description = planData.descriptionText;
            inProcessMessage = 'Approving "' + planData.selectedRatePlan + '" is in process...';
            handledMessage = '"' + planData.selectedRatePlan + '" is approved.';
        } else if (approvalState === 'REJECTED') {
            paramValue.rateplan = planData.selectedRatePlan;
            paramValue.approvalstate = 'REJECTED';
            paramValue.description = planData.descriptionText;
            inProcessMessage = 'Rejecting "' + planData.selectedRatePlan + '" is in process...';
            handledMessage = '"' + planData.selectedRatePlan + '" is rejected.';
        } else {
            return null;
        }
        const params = [
            {
                'name': 'input',
                'value': JSON.stringify(paramValue)
            }
        ];
        this.props.executeServiceOperation('MySQLupdateRatePlan', params);

        this.setState({
            approvedRatePlanName: planData.selectedRatePlan,
            snackbarMessage: inProcessMessage,
            approveRatePlanMessageHandled: false,
            handledsnackbarMessage: handledMessage
        });
    }

    executeSO(params) {
        this.props.executeServiceOperation('MySQLgetApprPendRatePlan', params);
    }

    switchToDetailsView(data) {
        this.setState({
            view: 'DETAILS',
            detailsData: data
        });
    }

    switchToGridView() {
        this.setState({
            view: 'GRID',
            detailsData: undefined
        });
    }

    getView() {
        if (this.state.loading) {
            return (
                <ProgressIndicatorCircular
                    spinner="right"
                    className="" css={{ xxlarge: false, overlay: false, fade: true }}
                />
            );
        }

        if (this.state.view === 'GRID') {
            return (
                <ApprovalsGrid
                    approvals={this.state.approvals}
                    viewDetailsClick={this.switchToDetailsView}
                    getIconUrl={this.props.getIconUrl}
                    approvePlan={this.approvePlan}
                    updateGrid={this.executeSO}
                />
            );
        } else {
            return (
                <ApprovalDetails
                    data={this.state.detailsData}
                    switchToGridView={this.switchToGridView}
                    getIconUrl={this.props.getIconUrl}
                />
            );
        }
    }

    render() {

        return (
            <div className="approvals-page-container" >
                <div className="approvals-page-container__padding" >
                    {this.getView()}
                    <Snackbar
                        message={this.state.snackbarMessage}
                        autoHideDuration={4000}
                        hideActionButton={true}
                    />
                </div>
            </div>
        );
    }
}

USCCApprovalsPage.propTypes = {
    pollingResponse: PropTypes.object,
    siteDefinition: PropTypes.object,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};

export default USCCApprovalsPage;