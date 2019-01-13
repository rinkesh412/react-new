import React from 'react';
import AutoComplete from '../../../components/model-name-autocomplete/model-name-autocomplete';
import { Button, Label } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from '../../../services/i18n-label-service';
import PropTypes from 'prop-types';
//import { executeSOMessagesViaFetch } from '../../services/manage-messages.service';

//import './fota-um-upload-archive-test.styl';

//var data_auto = [ 'SO-02E', 'SO-04E', 'Xperia feat. HATSUNE MIKU SO-04E', 'SO-04G', 'SO-04K', 'SH-07D', 'SH-01E', 'SH-01E Vivienne Westwood', 'SH-01F', 'SH-01F DRAGON QUEST' ];
export default class FUMUploadArchiveTest extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            selectArchiveFile: formatI18N('dsp_sbp_upld-archv-tsk_header_select-archive-file'),
            archiveFile: formatI18N('dsp_sbp_upld-archv-tsk_Label_archive-file'),
            browseBtn: formatI18N('dsp_sbp_upld-archv-tsk_button_browse-Btn'),
            uploadBtn: formatI18N('dsp_sbp_upld-archv-tsk_button_upload-Btn'),
            model: formatI18N('dsp_sbp_upld-archv-tsk_Label-model'),
            errorMessage: formatI18N('dsp_sbp_upld-archv-tsk_message_error-message'),
            data_auto: [],
            modelName: '',
            resultsFromFetchJSO: {},
            localDev: false,
            jsoCalled: 'NA'
        };
    }
    handleChange = (userInput) => {
        this.setState({ modelName: userInput });
    }
    componentDidMount() {
        this.executeServiceOperationAdapter('SO_Common_GetDeviceModels', []);
    }
    executeServiceOperationAdapter(jsoName, jsoParams) {
        this.setState({ jsoCalled: jsoName });
        if (this.state.localDev) {
            console.log('Calling JSO - using Fetch');
            // this.executeLocalDevSOTestMessages(jsoName, jsoParams);
        } else {
            console.log('Calling JSO - using Servi', jsoName);
            //this.props.executeServiceOperation(jsoName, jsoParams);
        }
    }


    static getDerivedStateFromProps(props, state) {
        console.log('Test Caution Text getDerivedStateFromProps call back poll reponse', props.pollingResponse);
        console.log('Test Caution Text getDerivedStateFromProps call back state >> ', state);
        console.log('Test Caution Text getDerivedStateFromProps call back props >> ', props);
        console.log('Jso Action ', state.jsoCalled);
        let cautionListData;
        let operationResult;
        if (state.jsoCalled === 'SO_SBP_GetMessageTemplate') {
            if (state.localDev) {
                if (state.resultsFromFetchJSO) {
                    cautionListData = state.resultsFromFetchJSO[state.jsoCalled].results.properties.resultData;
                    console.log('Prad Data from JSO via Fetch', cautionListData);
                    return { cautionTextDataList: cautionListData };
                }

            } else  {
                if (props.getResults('SO_SBP_GetMessageTemplate')) {
                    console.log('Prad get Results from JSO', props.getResults('SO_SBP_GetMessageTemplate'));
                    operationResult = props.getResults('SO_SBP_GetMessageTemplate').results.result.value;
                    if (operationResult === '3') {
                        cautionListData = props.getResults('SO_SBP_GetMessageTemplate').results.properties.resultData.items;
                        return { jsoCalled: '', cautionTextDataList: cautionListData };
                    } else {
                        return { jsoCalled: '', isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }
            }
        } else if (state.jsoCalled === 'SO_SBP_SaveMessageTemplate') {
            if (state.localDev) {
                console.log('To do');
                return { nextFunctionToCall: 'getTemplate' };
            } else {
                if (props.getResults('SO_SBP_SaveMessageTemplate')) {
                    operationResult = props.getResults('SO_SBP_SaveMessageTemplate').results.result.value;
                    if (operationResult === '3') {
                        return { jsoCalled: '', nextFunctionToCall: 'getTemplate', messageOnUI: ' Message Saved Successfully' };
                    } else {
                        return { jsoCalled: '', isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }
            }
        } else if (state.jsoCalled === 'SO_SBP_DeleteMessageTemplate') {
            if (state.localDev) {
                console.log('To do');
                return null;
            } else {
                if (props.getResults('SO_SBP_DeleteMessageTemplate')) {
                    operationResult = props.getResults('SO_SBP_DeleteMessageTemplate').results.result.value;
                    if (operationResult === '3') {
                        return { jsoCalled: '', nextFunctionToCall: 'getTemplate', messageOnUI: ' Message Deeleted Successfully' };
                    } else {
                        return { jsoCalled: '', isJsoError: true, messageOnUI: 'An Error has occured. Please contact your Administrator' };
                    }
                }
            }

        }
        return null;
    }
    /*executeLocalDevSOTestMessages(jsoName, jsoParams) {
        executeSOMessagesViaFetch(jsoName,  jsoParams).then(data => {
            console.log('Here');
            // this.props.pollingResponse = data;
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.resultsFromFetchJSO[jsoName] = data;
        });
    }*/
    validateFields(){
        if(document.getElementById('fileNameInput').value === "" || document.getElementsByTagName('input')[2].value === "") {
            document.getElementById('errorText').classList.remove('hideErrorMsg');
            document.getElementById('errorText').classList.add('showErrorMsg');
        }
        else{
            document.getElementById('errorText').classList.remove('showErrorMsg');
            document.getElementById('errorText').classList.add('hideErrorMsg');
        }
    }
    onFileUpload(event) {
        var uploadedFileName = event.target.files[0].name;
        console.log(event.target.files);
        document.getElementById('fileNameInput').value = uploadedFileName;
    }
    render() {
        return (
            <div className="uploadArchieve">
                <p>{this.state.selectArchiveFile}</p>
                <div className="flexWrap top2">
                    <form>
                        <div className="form-group">
                            <label htmlFor="file" className="sr-only archiveLabel">{this.state.archiveFile}</label>
                            <div className="input-group customUploadInput">
                                <input type="text" name="filename" id="fileNameInput" className="form-control" placeholder="No file selected" readOnly />
                                <span className="input-group-btn">
                                    <div id="browseBtn" className="btn btn-default  custom-file-uploader">
                                        <input type="file" name="file" class="fotaUMArchivefileUpload" onChange={this.onFileUpload.bind(this)} />
                                        {this.state.browseBtn}
                                    </div>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flexWrap top2 modelSection">
                    <Label text={this.state.model} />
                    <AutoComplete suggestionsList={data_auto} callBackFromParent={this.handleChange} modelName={this.state.modelName} class="uploadArchiveModel"/>
                </div>          
                <Button text={this.state.uploadBtn}  type="file" id="uploadBtn" onClick={this.validateFields} />               
                <p id="errorText" className="errorText hideErrorMsg top2">{this.state.errorMessage}</p>
            </div>
        );
    }

}
FUMUploadArchiveTest.propTypes = {
    handleChange: PropTypes.func.isRequired,
    modelName: PropTypes.string.isRequired,
    getResults: PropTypes.func.isRequired,
    pollingResponse: PropTypes.object.isRequired,
    executeServiceOperation: PropTypes.func.isRequired,
    getIconUrl: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired
};