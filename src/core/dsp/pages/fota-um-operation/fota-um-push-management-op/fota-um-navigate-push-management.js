import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FumSelectPushMethod from '../../../components/fum-select-push-method/fum-select-push-method';
import FumSelectResultType from '../../../steps/fum-push-management-steps/fum-select-result-type';
import FumViewResult from '../../../steps/fum-view-result-steps/fum-view-result';
import FumExportResult from '../../../steps/fum-export-result-steps/fum-export-result';
import FUMPushSchedule from '../../../steps/fum-push-management-steps/fum-push-select-platform/fum-push-select-platform';
import FUMIndividualSmsPushDpf from '../../../steps/fum-push-management-steps/fum-individual-sms/fum-individual-sms-dpf/fum-individual-sms-dpf';
import FUMIndividualSmsPushM2m from '../../../steps/fum-push-management-steps/fum-individual-sms/fum-individual-sms-m2m/fum-individual-sms-m2m';
import FUMListSmsPushDpf from '../../../steps/fum-push-management-steps/fum-list-sms/fum-list-sms';
import FUMReservedListPushDpf from '../../../steps/fum-push-management-steps/fum-upload-reserved-list/fum-reserved-list';

let selectedPushOption = ''
export default class NavigatePushManagement extends Component {
    constructor(props) {
      super(props);
    };
    state = {
      currentMode: "PUSH",
    };
    nextModeChange = (selectedMode) => {
      this.setState({ currentMode: selectedMode });
    };
    render() {
      switch (this.state.currentMode) {
        case "PUSH":
            return <FumSelectPushMethod nextModeChange={this.nextModeChange} />;
            break;
        case "PULL":
            return <FumSelectResultType nextModeChange={this.nextModeChange} />;
            break;
        case "View":
            return <FumViewResult nextModeChange={this.nextModeChange} />
            break;
        case "Export":
            return <FumExportResult nextModeChange={this.nextModeChange} />
            break;
        case "PUSH Reservation Setting":
        case "Individual SMS Test":
        case "List SMS":
            selectedPushOption = this.state.currentMode;
            return <FUMPushSchedule nextModeChange={this.nextModeChange} />
            break;
        case "Docomo-PF":
          if (selectedPushOption !== null || selectedPushOption !== '') {
              if (selectedPushOption === 'PUSH Reservation Setting') {
                return <FUMReservedListPushDpf nextModeChange={this.nextModeChange} />;
                break;
              }
              if (selectedPushOption === 'Individual SMS Test') {
                return <FUMIndividualSmsPushDpf nextModeChange={this.nextModeChange} />;
                break;
              }
              if (selectedPushOption === 'List SMS') {
                return <FUMListSmsPushDpf nextModeChange={this.nextModeChange} />;
                break;
              }
          }
        case "M2M-PF":
          if (selectedPushOption !== null || selectedPushOption !== '') {
            if (this.selectedPushOption === 'PUSH Reservation Setting') {
              return <FUMReservedListPushDpf nextModeChange={this.nextModeChange} />;
              break;
            }
            if (selectedPushOption === 'Individual SMS Test') {
              return <FUMIndividualSmsPushM2m nextModeChange={this.nextModeChange} />;
              break;
            }
            if (selectedPushOption === 'List SMS') {
              return <FUMListSmsPushDpf nextModeChange={this.nextModeChange} />;
              break;
            }
          }
        case "Skip":
            return <FumSelectResultType nextModeChange={this.nextModeChange} />;
            break;
            
      }
    }
  }
  NavigatePushManagement.propTypes = {
    nextModeChange: PropTypes.func.isRequired,  
  }