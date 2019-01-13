import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout, RadioButton, RadioButtonGroup, Button, TextArea, Label } from '@nokia-csf-uxr/csfWidgets';
import './fum-select-mode-modify.styl';

export default class FumSelectModeModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMode: 'Mode Change',
            modechangeLabel: 'Mode Change',
            pubDtChangeLabel: 'Publish Date Change',
            viewTacLabel: 'View TAC'
        }
    }
    onChangeModeSelect = (event) => {
        this.setState({ selectedMode: event.value });
    }

    render() {
        return(
            <div>
                <FormLayout>
                    <Label id="select-update-label-id" text="Select Update" />
                    <div className="radio"> 
                        <RadioButtonGroup id="radio-container-id" name="mode-modify"
                            selectedItem={this.state.selectedMode} onChange = {this.onChangeModeSelect}
                        >
                            <RadioButton id="change-option1" label={this.state.modechangeLabel} name="selectedMode" value="Mode Change" />
                            <RadioButton id="change-option2" label={this.state.pubDtChangeLabel} name="selectedMode" value="Publish Date Change" />
                            <RadioButton id="change-option3" label={this.state.viewTacLabel} name="selectedMode" value="View TAC" />  
                        </RadioButtonGroup>
                    </div>
                    <div className="button-story__column">
                        <Button id="searchBtn" text="Next" onClick={() => {this.props.nextModeChange(this.state.selectedMode)}} isCallToAction />
                    </div>
                </FormLayout>  
            </div>
        );
    }
}

FumSelectModeModify.propTypes = {
    nextModeChange: PropTypes.func.isRequired,
}