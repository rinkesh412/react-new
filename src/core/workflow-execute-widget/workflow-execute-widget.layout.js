import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as CSFWidget from '@nokia-csf-uxr/csfWidgets';

import './workflow-execute-widget.layout.styl';

export class WorkFlowExecuteWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.iframeButtonClick = this.iframeButtonClick.bind(this);
        this.workflowExecuteView = this.workflowExecuteView.bind(this);
    }

    iframeButtonClick() {
        const execution = {
            name: this.props.componentData.properties[ 0 ].data.value,
            renderer: 'iframe'
        };
        this.props.executeWorkflow(execution);
    }

    workflowExecuteView() {
        return this.props.componentData.properties.map(wf => {
            let execution = {
                name: wf.data.value
            };
            let label = 'Execute ' + execution.name + ' workflow';
            return <CSFWidget.Button text={label} key={execution.name} onClick={() => this.props.executeWorkflow(execution)} />;
        });
    }

    render() {
        return (
            <div className="workflow-execute-widget-container">
                Click below to execute a workflow
                <CSFWidget.Button text="Execute Startup in an iframe" onClick={this.iframeButtonClick} />
            </div>
        );
    }

}

export default WorkFlowExecuteWidget;

WorkFlowExecuteWidget.propTypes = {
    executeWorkflow: PropTypes.func.isRequired,
    componentData: PropTypes.object.isRequired
};

WorkFlowExecuteWidget.defaultProps = {

};