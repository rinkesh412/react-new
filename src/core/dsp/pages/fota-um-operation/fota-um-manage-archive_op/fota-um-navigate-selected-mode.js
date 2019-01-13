import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FumSearchArchive from '../../../steps/fum-manage-archive-steps/fota-um-search-archive-op/fota-um-search-archive-op';
import FumSelectModeModify from '../../../steps/fum-manage-archive-steps/fum-select-modify-mode/fum-select-mode-modify';
import FumModeChange from '../../../steps/fum-manage-archive-steps/fum-select-modify-mode/fum-modify-archive-operation/fum-mode-change-op/fum-mode-change';
import FumPublishDtChange from '../../../steps/fum-manage-archive-steps/fum-select-modify-mode/fum-modify-archive-operation/fum-publish-date-change-op/fum-publish-date-change';
import FumViewTac from '../../../steps/fum-manage-archive-steps/fum-select-modify-mode/fum-modify-archive-operation/fum-view-tac/fum-view-tac-status'; 
export default class NavigateSelectedMode extends Component {
    constructor(props) {
      super(props);
      this.state = {
        currentMode: "detail",
      };
    }
    nextModeChange = (selectedMode) => {
      console.log("selectedMode-->", selectedMode);
      this.setState({ currentMode: selectedMode });
    };
    render() {
      console.log(this.state.currentMode);
      switch (this.state.currentMode) {
        case "detail":
            return <FumSearchArchive nextModeChange={this.nextModeChange} />;
            break;
        case "mode-select":
            return <FumSelectModeModify nextModeChange={this.nextModeChange} />;
            break;
        case "Mode Change":
            return <FumModeChange nextModeChange={this.nextModeChange} />
            break;
        case "Publish Date Change":
            return <FumPublishDtChange nextModeChange={this.nextModeChange} />
            break;
        case "View TAC":
            return <FumViewTac nextModeChange={this.nextModeChange} />
            break;
      }
    }
  }
  NavigateSelectedMode.propTypes = {
    nextModeChange: PropTypes.func.isRequired,  
  }