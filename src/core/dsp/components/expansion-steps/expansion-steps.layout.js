import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { ExpansionPanel } from '@nokia-csf-uxr/csfWidgets';

const PanelItem = props => (
    <div id={props.id}>
        <h2 style={{ fontFamily: 'Nokia Pure Text Regular, Arial, sans-serif', marginTop: '10px', fontSize: '15px' }}> {props.title} </h2>
        <div style={{ display: props.isOpen ? 'block' : 'none' }}>
            {props.children}
        </div>
    </div>
);

PanelItem.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    defaultOpen: PropTypes.bool,
    isOpen: PropTypes.bool,
    onDelete: PropTypes.func,
    children: PropTypes.object
};

class ExpansionSteps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPanels: [ {
                id: uniqueId('csfWidgets-expansionsteps-step-'),
                isOpen: true,
                defaultOpen: true,
                title: this.props.stepsMap[0].title,
                step: this.props.stepsMap[0].step,
                receivedData: null
            } ]
        };
    }

    nextHandler = (nextInfo, triggerStepIndex) => {
        console.log("current panel title", triggerStepIndex);
        if (this.state.currentPanels.length > triggerStepIndex + 1) {
            this.deleteStep(this.state.currentPanels.length - 1);
            for (let i = this.state.currentPanels.length - 1; i>triggerStepIndex; i--) {
                this.deleteStep(i);
            }
        }

        // Get next step
        let nextStep = this.props.stepsMap[triggerStepIndex + 1];
        if (!nextStep) {
            console.log('Next step not found!');
            return;
        }
        this.state.currentPanels[triggerStepIndex].isOpen = false;
        
        console.log('Found nextStep :: ', nextStep);
        this.setState({
            currentPanels: this.state.currentPanels.concat([ {
                title: nextStep.title,
                step: nextStep.step,
                isOpen: true,
                receivedData: nextInfo.data,
                id: uniqueId('csfWidgets-expansionsteps-step-')
            } ])
        });
        this.props.pageDataHandler && this.props.pageDataHandler(nextInfo.data);
    }

    backHandler = panelIdx => {
        this.deleteStep(panelIdx);
    }

    deleteStep(stepIndex) {
         // make a separate copy of the array
        const array = [ ...this.state.currentPanels ];
        array.splice(stepIndex);
        this.setState({ currentPanels: array });
    } 

    setPanelState(panelIndex, stateName, value) {
        const copycurrentPanels = this.state.currentPanels.slice();
        copycurrentPanels[panelIndex][stateName] = value;
        this.setState({
            currentPanels: copycurrentPanels
        });
        if(this.state.currentPanels.length != 1)
            this.deleteStep(panelIndex+1);
    }

    toggle = event => {
        console.log(event);
        if(this.state.currentPanels.length === 1 && this.state.currentPanels[event]) {
            this.setPanelState(event.value, 'isOpen', event.type !== 'onExpand');
        } else {
        this.setPanelState(event.value, 'isOpen', event.type === 'onExpand');
        }
    }

    render() {
        return (
            <ExpansionPanel onExpand={this.toggle} onCollapse={this.toggle}>
                {this.state.currentPanels.map((m, i) => (
                    <PanelItem className={"item-background"} id={m.id} title={m.title} key={m.id} isOpen={m.isOpen} defaultOpen={m.defaultOpen}>
                        <m.step nextHandler={data => this.nextHandler(data, i)} backHandler={() => this.backHandler(i)}
			    receivedData={m.receivedData} {...this.props}
                        />
                    </PanelItem>
                ))}
            </ExpansionPanel>
        );
    }
}
export default ExpansionSteps;
ExpansionSteps.propTypes = {
    stepsMap: PropTypes.array.isRequired,
    pageDataHandler: PropTypes.func,
    executeServiceOperation: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    nextHandler: PropTypes.func
};