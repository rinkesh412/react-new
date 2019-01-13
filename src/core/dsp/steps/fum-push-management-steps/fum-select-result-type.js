import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout, RadioButton, RadioButtonGroup, Button, TextArea, Label } from '@nokia-csf-uxr/csfWidgets';
import './fum-select-result-type.styl';

export default class FumSelectResultType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedResultType: 'View',
            viewLabel: 'View',
            exportLabel: 'Export',
        }
    }
    onChangeSelectPf = (event) => {
        this.setState({ selectedResultType: event.value });
    }

    render() {
        return(
            <div>
                <FormLayout>
                    <Label id="select-result-label-id" text="Select " />
                    <div className="radio"> 
                        <RadioButtonGroup id="radio-container-id" name="platform-select"
                            selectedItem={this.state.selectedResultType} onChange = {this.onChangeSelectPf}
                        >
                            <RadioButton id="change-option1" label={this.state.viewLabel} name="selectedResultType" value="View" />
                            <RadioButton id="change-option2" label={this.state.exportLabel} name="selectedResultType" value="Export" />
                        </RadioButtonGroup>
                    </div>
                    <div className="button-story__column">
                        <Button id="nextPFBtn" text="Next" onClick={() => {this.props.nextModeChange(this.state.selectedResultType)}} isCallToAction />
                    </div>
                </FormLayout>  
            </div>
        );
    }
}

FumSelectResultType.propTypes = {
    nextModeChange: PropTypes.func.isRequired,
}