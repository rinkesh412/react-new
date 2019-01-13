import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as CSFWidget from '@nokia-csf-uxr/csfWidgets';

class CustomPrompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textValue: ''
        };
        this.continue = this.continue.bind(this);
        this.back = this.back.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    componentDidMount() {
        this.props.setCallback(this.back, this.continue);
    }

    continue() {
        return {
            signal: this.props.nodeData.validSignals[0].name,
            data: { [this.props.nodeData.content.holder]: this.state.textValue }
        };
    }

    back() {
        console.log('going back!');
    }

    inputChange(evt) {
        this.setState({
            textValue: evt.value
        });
    }

    render() {
        return (
            <div>
                Look at me! A custom step rendererererer.
                Ive been created to match the Custom Prompt Node. Its a pretty cool thing. Whatever you type below will output to the holder property thats defined in the workflow.
                The default is userInput, but maybe youve changed it!

                <CSFWidget.TextInput
                    text={this.state.textValue}
                    id="TextInputID"
                    placeholder="Type Something in Here!"
                    label="Input Text"
                    focus
                    onChange={this.inputChange}
                />
            </div>
        );
    }
}

export default CustomPrompt;

CustomPrompt.propTypes = {
    nodeData: PropTypes.object,
    setCallback: PropTypes.func.isRequired
};

CustomPrompt.defaultProps = {

};