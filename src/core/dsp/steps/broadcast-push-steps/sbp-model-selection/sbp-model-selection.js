import React from 'react';
import PropTypes from 'prop-types';
import { Button, Label } from '@nokia-csf-uxr/csfWidgets';
import AutoComplete from '../../../components/model-name-autocomplete/model-name-autocomplete';
import { formatI18N } from '../../../services/i18n-label-service';
import './sbp-model-selection.styl';
import { executeSOMessagesViaFetch } from '../../../services/manage-messages.service';

let isModelRequired = false;
let invalidModel = false;
let isDisabled = true;
 export default class SBPModelSelectionStep extends React.Component { // eslint-disable-line
    constructor(props) {
        super(props);
        console.log('parent', props);
        this.state = {
            modelName: 'test',
            enteredModel: '',
            isOpen: true,
            invalidModel: false,
            modelRequiredMsg: formatI18N('dsp_sbp_create-sms-task-message-model-required'),
            invalidModelMsg: formatI18N('dsp_sbp_create-sms-task-message-invalid-model'),
            modelSelectionHeader: formatI18N('dsp_sbp_create-sms-task_header_model-selection'),
            modelNameLabel: formatI18N('dsp_sbp_create-sms-task_label_model-name'),
            settingButtonLabel: formatI18N('dsp_sbp_create-sms-task_label_settings'),
            data_auto: [],
            resultsFromFetchJSO: {},
            // localDev: false,
            jsoCalled: 'NA'
        };
    }
    componentDidMount() {
        this.executeServiceOperationAdapter('SO_Common_GetDeviceModels', []);
    }

    executeServiceOperationAdapter(jsoName, jsoParams) {
        console.log('Calling JSO - using Servi');
        this.props.executeServiceOperation(jsoName, jsoParams);
        this.setState({
            jsoCalled: jsoName
        });
    }
    executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName,  jsoParams).then(data => {
            console.log('Here');
            // this.props.pollingResponse = data;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }

    static getDerivedStateFromProps(props, state) {
        console.log('Inside getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        console.log('Inside getDerivedStateFromProps call back state >> ', state);
        console.log('Inside getDerivedStateFromProps call back props >> ', props);
        let dataVal =[];
        let newModelList = [];
        if (state.jsoCalled === 'SO_Common_GetDeviceModels') {
            if (props.getResults('SO_Common_GetDeviceModels')) {
                newModelList = props.getResults('SO_Common_GetDeviceModels').results.properties.resultData.items;
                console.log('Get Device Model', newModelList);
                newModelList.map(resultData => {
                    for (var key in resultData) {
                        dataVal.push(key);
                    }
                });
                return { data_auto: dataVal };
            }


        }
    }
  
    handleChange = data => {
        this.setState({ modelName: data });
    }

    userType = userInput => {
        isModelRequired = false;
        isDisabled = false;
        invalidModel = false;
        if (userInput === null || userInput === '') {
            isModelRequired = true;
            isDisabled = true;
            invalidModel = false;
            this.setState({ invalidModel: invalidModel});
        }
        this.setState( {enteredModel: userInput});
    }
    onClickSettingBtn = () => {
        let modelName = this.state.modelName;
        let enteredModel = this.state.enteredModel;
        if (enteredModel !== null || enteredModel !== '' || modelName !== '' || modelName !== null) {
            isModelRequired = false;
           if (enteredModel.toUpperCase() === modelName.substring(0,2).toUpperCase()) {
                invalidModel = false;
                this.props.nextHandler && this.props.nextHandler({
                    data: {
                        modelName: this.state.modelName
                    }
                });
            }
            else {
                invalidModel = true;
                this.setState({ invalidModel: invalidModel});
            }
        } else {
            isModelRequired = true;
            invalidModel = false;
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-3 label_width">
                        <Label id="modelName" text={this.state.modelNameLabel} />
                    </div>
                    { (this.state.data_auto !== 'undefined') ?
                        <div className="col-sm-3">
                            <AutoComplete suggestionsList={this.state.data_auto} callBackFromParent={this.handleChange} modelName={this.state.modelName} userTypedModelName={this.userType} />
                        </div>
                        :
                        <div className="col-sm-3">
                            <AutoComplete suggestionsList="" callBackFromParent={this.handleChange} modelName={this.state.modelName} />
                        </div>
                    }
                </div>
                <div id="error-msg-id" className="row">
                        { isModelRequired ?
                            <span id="message-area-id-1" className="required-msg-show">
                                {this.state.modelRequiredMsg} <br />
                            </span> : ''
                        }
                        { (invalidModel || this.state.invalidModel)  ?
                            <span id="message-area-id-2" className="required-msg-show">
                                {this.state.invalidModelMsg} <br />
                            </span> : ''
                        }
                </div>
                <div className="row">
                    <div className="col-sm-12 right">
                        <Button id="btnExecute" text={this.state.settingButtonLabel} isCallToAction onClick={this.onClickSettingBtn} disabled={isDisabled} />
                    </div>
                </div>
            </div>
        );
    }
}


SBPModelSelectionStep.propTypes = {
    receivedData: PropTypes.object,
    nextHandler: PropTypes.func,
    backHandler: PropTypes.func,
    modelName: PropTypes.string,
    userInput: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    userType: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    pollingResponse: PropTypes.object.isRequired,
    siteDefinition: PropTypes.object.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    getResults: PropTypes.func.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};