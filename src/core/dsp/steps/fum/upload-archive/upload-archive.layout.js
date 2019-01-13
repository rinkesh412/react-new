import React, { Component } from 'react';
import { Button, FormLayout, TextInput, Label, FileUploader } from '@nokia-csf-uxr/csfWidgets';
import AutoComplete from '../../../components/model-name-autocomplete/model-name-autocomplete';
import PropTypes from 'prop-types';
import FileUpload from '../../../components/file-upload/file-upload.layout';
import { formatI18N } from '../../../services/i18n-label-service';
import FileUploaderWrapper from '../../../components/multiple-files-upload/uploaded-file-result';
import Upload from './FileUploader';
import './upload-archive.layout.styl';

var data_auto = [ 'SO-02E', 'SO-04E', 'Xperia feat. HATSUNE MIKU SO-04E', 'SO-04G', 'SO-04K', 'SH-07D', 'SH-01E', 'SH-01E Vivienne Westwood', 'SH-01F', 'SH-01F DRAGON QUEST' ];
export default class UploadArchiveStep extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        modelName: '',
        modelNameLabel: formatI18N('dsp_sbp_create-sms-task_label_model-name'),
        files: FileList | null,
        message: 'some initial message'
    }
    getUploadedFileName = (e) => {
        let files = e.target.files,
            value = e.target.value,
            message;
        if( files && files.length > 1 ) 
            message = `${files.length} files selected`;
        else                            
            message = value.split( '\\' ).pop();
     
        if(message) 
            this.setState({...this.state,message});
     }
    onClickUploadBtn = (event) => {
        console.log(event.value);
    };
    onFileSelect = () => {
        console.log('file')
    }
    handleFileUpload(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);

        fetch(this.props.uploadURL, {
            method: 'POST',
            body: data,
        }).then(response => {
            response.json().then(body => {
                this.setState({ responseStatus: body.status });
            });
        });
    }
    handleChange = (userInput) => {
        console.log("handleChange from sbp model", userInput);
        this.setState({ modelName: userInput });
    }
    onChangeText = (oFileInput, sTargetID) => {
        console.log('clicked');
    }
    onClickSettingBtn = () => {
        this.props.nextHandler && this.props.nextHandler({
            data: {
                modelName: this.state.modelName
            }
        }); 
    }
    render() {
        return (
            <div>
                <h4>Please select archive file</h4>
                <FormLayout>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="archiveFileId" text="Archive File" />
                        </div>
                         <div className="col-sm-3 label_width">
                            <input id='file-upload-id' type='file' />
                        </div> 
                    </div>
                    <div>
                        <FileUploaderWrapper />
                    </div>
                    <div className="row">
                        <div className="col-sm-3 label_width">
                            <Label id="modelName" text={this.state.modelNameLabel} />
                        </div>
                        <div className="col-sm-3 label_width">
                            <AutoComplete suggestionsList={data_auto} callBackFromParent={this.handleChange} modelName={this.state.modelName} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 right">
                            <Button id="uploadBtn" text="Upload" isCallToAction onClick={this.handleFileUpload} />
                        </div>
                    </div>  
                </FormLayout>  
            </div>
        );
    }
 /*   render() {
        return (
            <div className="upload-archive">
                <h4>Please select archive file</h4>
                <div className="row">
                    <div className="col-sm-3">
                        <Label text="Archive File" />
                    </div>
                    <div className="col-sm-2">
                        <TextInput text="" />
                    </div>
                    <div className="col-sm-2">
                        <Button text="Browse" isCallToAction onClick={this.onFileSelect} />
                    </div>
                </div>

                <Label text="Model" />
                <div className="row">
                    <div className="col-sm-12">
                        <Button id="uploadBtn" text="Upload" isCallToAction onClick={this.onClickUploadBtn} />
                    </div>
                </div>
            </div>
        );
    } */
}
UploadArchiveStep.propTypes = {
    modelName: PropTypes.string,
    handleChange: PropTypes.func,
    multiple: PropTypes.isRequired
};