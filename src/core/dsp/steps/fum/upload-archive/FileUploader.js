import React from 'react';
import PropTypes from 'prop-types';
import { FileUploader, ToggleButton, TextInput } from '@nokia-csf-uxr/csfWidgets';


const statusErrorList = ['error', 'rejected', 'rejectedtype', 'rejectedmax', 'rejectedmin'];// 'rejecteddup' is special

class FileUploaderWrapper extends React.Component {
  static propTypes = {
    initialData: PropTypes.bool,
  }

  static defaultProps = {
    initialData: true,
  }

  data = (this.props.initialData ? [
    { filename: 'file3.txt', status: 'complete', uploadDate: new Date('6/18/2014 15:00 UTC') },
    { filename: 'file1.txt', status: 'complete', uploadDate: new Date('9/3/2017 17:00 UTC') },
    { filename: 'file2.jpg', status: 'complete', uploadDate: new Date('12/24/2010 17:00 UTC') }
  ] : []);

  state = {
    data: this.data,
    fileUploadProps: {
      // heightMax: number('heightMax', Infinity),
      // denyMultipleFileDrop: boolean('Deny Multiple File Drop', false),
      // fileTypes: 'image/*, text/*',
      // maxFileSizeAllowed: 500000,
      // minFileSizeAllowed: 1000,
      //
      // okResponse: this.okCallBackAction,
      // okDisabled: false,
      // cancelResponse: this.cancelCallBackAction,
      // cancelDisabled: false,

      onFileSelect: (event) => {
        this.onFileSelectCallback(event.value);
      },
      fileDeleteResponse: (event) => {
        this.onFileDeleteCallback(event.value);
      },
      fileDeleteErrorResponse: (eventObj) => {
        this.onFileDeleteErrorCallback(eventObj.value.filename, eventObj.value.status);
      },
      fileCancelResponse: (event) => {
        this.onFileCancelCallback(event.value);
      },
      fileRetryResponse: (event) => {
        this.onFileRetryCallback(event.value);
      },
      fileAbortResponse: (event) => {
        this.onFileAbortCallback(event.value);
      },
      onErrorRetry: true,
      // dropZoneHintText: text('dropZoneHintText', 'This is some instructional hint text'),
    }
  }

  onFileAbortCallback = (filename) => {
    const indexToAbort = this.data.findIndex(item => item.filename === filename);
    if ((indexToAbort > -1) && this.data[indexToAbort].status === 'uploading') {
      this.data[indexToAbort].status = 'pending';
    }
    this.setState({ data: this.data });
  };

  onFileRetryCallback = (filename) => {
    const indexToRetry = this.data.findIndex(item => item.filename === filename);
    if ((indexToRetry > -1) && (this.data[indexToRetry].status === 'error')) {
      this.data[indexToRetry].status = 'pending';
      this.setState({ data: this.data });
      this.simulateUploading();
    } else {
      console.error(`${filename} may not be retried at this time`);
    }
  };

  onFileCancelCallback = (filename) => {
    let indexToCancel = this.data.findIndex(item => item.filename === filename);
    if ((indexToCancel > -1) && (this.data[indexToCancel].status !== 'uploading')) {
      this.data.splice(indexToCancel, 1);
    }
    // remove any other filename with a different status (such as rejectDup)
    indexToCancel = this.data.findIndex(item => item.filename === filename);
    if ((indexToCancel > -1) && (this.data[indexToCancel].status !== 'uploading')) {
      this.data.splice(indexToCancel, 1);
    }
    this.setState({ data: this.data });
  };

  onFileDeleteCallback = (filename) => {
    let indexToDelete = this.data.findIndex(item => item.filename === filename);
    this.data.splice(indexToDelete, 1);
    // is there another entry with this filename hangingaround (status='rejectedDup')
    indexToDelete = this.data.findIndex(item => item.filename === filename);
    if (indexToDelete > -1) {
      this.data.splice(indexToDelete, 1);
    }
    this.setState({ data: this.data });
  };

  onFileDeleteErrorCallback = (filename, status) => {
    const indexToDelete = this.data.findIndex(item => item.filename === filename && item.status.toLowerCase() === status.toLowerCase());
    if (indexToDelete > -1) {
      this.data.splice(indexToDelete, 1);
    }
    this.setState({ data: this.data });
  };

  onFileSelectCallback = (filesSelected) => {
    filesSelected.forEach((line) => {
      if (this.data.findIndex(item => item.filename === line.filename) === -1) {
        this.data.push({ filename: line.filename, status: line.status, uploadDate: line.uploadDate });
        // uploadedFiles.push({ name: line.file.name, size: line.file.size });
        // this would be sent to a server - for the demo, throw it away
      } else {
        // found the filename, check the status, keep rejectedDup
        let foundOne = false;
        let foundError = false;
        let whereFound = -1;
        for (let i = 0; i < this.data.length; i += 1) {
          if (this.data[i].filename === line.filename && this.data[i].status === line.status) {
            foundOne = true;
          }
          if (this.data[i].filename === line.filename && statusErrorList.indexOf(this.data[i].status.toLowerCase()) > -1) {
            foundError = true;
            whereFound = i;
          }
        }
        if (!foundOne) {
          // remove if the exiting entry has an error != rejectedDup
          if (foundError) {
            this.data.splice(whereFound, 1);
          }
          this.data.push({ filename: line.filename, status: line.status, uploadDate: line.uploadDate });
        }
      }
    });

    this.setState({ data: this.data });
    // updateEnteredFilesOnDisplay();

    // kickstart the process to begin uploading files if there are any pending
    this.simulateUploading();
  };

  simulateUploading = () => {
    this.data.forEach((line, index) => {
      if (line.status === 'pending') {
        this.data[index].status = 'uploading';
        this.data[index].uploadedPercent = 0;
        this.setState({ data: this.data });
        setTimeout(() => { this.progress(index); }, Math.floor(Math.random() * 2000));
      }
    });
  };

  progress = (index) => {
    let p = 0;
    let t = 0;
    for (p = 0, t = 0; p < 100; p += Math.floor(Math.random() * 3), t += 50) {
      const percent = p;

      setTimeout(() => {
        if (this.data[index] != null && this.data[index].status === 'uploading') {
          this.data[index].uploadedPercent = percent;
          this.setState({ data: this.data });
        }
      }, t);
    }

    setTimeout(() => {
      if (this.data[index] != null && this.data[index].status === 'uploading') {
        if (index % 3 === 1) {
          this.data[index].status = 'error';
          this.data[index].uploadDate = new Date();
          this.data[index].errorMsg = 'Upload failure. The reason is unknown.';
        } else {
          this.data[index].status = 'complete';
          // data[index].uploadDate = "Today: " + new Date();
          // data[index].uploadDate = "Today";
          this.data[index].uploadDate = new Date();
        }
        this.setState({ data: this.data });
      }
    }, t);
  };


  okCallBackAction = () => {
    console.log('OK Callback action');
  };
  cancelCallBackAction = () => {
    console.log('CANCEL Callback action');
  };

  initialData = [
    { filename: 'file3.txt', status: 'complete', uploadDate: 'Sept 3, 2017' },
    { filename: 'file1.txt', status: 'complete', uploadDate: 'Yesterday' },
    { filename: 'file2.jpg', status: 'complete', uploadDate: 'Dec 25, 2010' }
  ];

  renderOptions() {
    const optionsStyle = {
      textAlign: 'left',
    };
    const defaultFileTypes = (this.state.fileUploadProps.fileTypes ? this.state.fileUploadProps.fileTypes : undefined);
    const defaultMax = (
      this.state.fileUploadProps.maxFileSizeAllowed ? this.state.fileUploadProps.maxFileSizeAllowed.toString() : undefined
    );
    const defaultMin = (
      this.state.fileUploadProps.minFileSizeAllowed ? this.state.fileUploadProps.minFileSizeAllowed.toString() : undefined
    );
    const defaultHintText = (
      this.state.fileUploadProps.dropZoneHintText ? this.state.fileUploadProps.dropZoneHintText : ''
    );
    const defaultAllowOnlyOneFileInUploaderMessage = (
      this.state.fileUploadProps.allowOnlyOneFileInUploaderMessage ? this.state.fileUploadProps.allowOnlyOneFileInUploaderMessage : ''
    );
    const fileRejectedDuplicateMessage = (
      this.state.fileUploadProps.fileRejectedDuplicateMessage ? this.state.fileUploadProps.fileRejectedDuplicateMessage : ''
    );
    const defaultDropZoneText = (
      this.state.fileUploadProps.dropZoneText ? this.state.fileUploadProps.dropZoneText : ''
    );
    const defaultDropZoneButtonText = (
      this.state.fileUploadProps.dropZoneButtonText ? this.state.fileUploadProps.dropZoneButtonText : ''
    );
    const defaultHeightMax = (
      this.state.fileUploadProps.heightMax ? this.state.fileUploadProps.heightMax.toString() : undefined
    );
    const defaultDropZoneNameColumnHeader = (
      this.state.fileUploadProps.dropZoneNameColumnHeader ?
        this.state.fileUploadProps.dropZoneNameColumnHeader :
        'File name'
    );
    const defaultDropZoneDateColumnHeader = (
      this.state.fileUploadProps.dropZoneDateColumnHeader ?
        this.state.fileUploadProps.dropZoneDateColumnHeader :
        'Date added'
    );
    const defaultPendingMessage = (
      this.state.fileUploadProps.filePendingMessage ?
        this.state.fileUploadProps.filePendingMessage :
        'Pending...'
    );
    const defaultInvalidTypeMessage = (
      this.state.fileUploadProps.fileRejectedTypeMessage ?
        this.state.fileUploadProps.fileRejectedTypeMessage :
        'Incorrect file type'
    );
    const defaultMaxSizeMessage = (
      this.state.fileUploadProps.fileRejectedMaxSizeMessage ?
        this.state.fileUploadProps.fileRejectedMaxSizeMessage :
        'File size exceeds maximum allowed file size'
    );
    const defaultMinSizeMessage = (
      this.state.fileUploadProps.fileRejectedMinSizeMessage ?
        this.state.fileUploadProps.fileRejectedMinSizeMessage :
        'File size below minimum allowed file size'
    );
    const defaultRejectMessage = (
      this.state.fileUploadProps.fileRejectedMessage ?
        this.state.fileUploadProps.fileRejectedMessage :
        'File may not be uploaded at this time'
    );

    return (
      <div style={optionsStyle}>
        <h2>Options:</h2>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Setting</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Display/Remove Ok Button</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.okResponse === undefined) {
                      tempProps.okResponse = () => { this.okCallBackAction(); };
                    } else {
                      delete tempProps.okResponse;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Enable/Disable Ok Button</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.okDisabled === undefined) {
                      tempProps.okDisabled = true;
                    } else {
                      tempProps.okDisabled = !tempProps.okDisabled;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Display/Remove Cancel Button</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.cancelResponse === undefined) {
                      tempProps.cancelResponse = () => { this.cancelCallBackAction(); };
                    } else {
                      delete tempProps.cancelResponse;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Enable/Disable Cancel Button</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.cancelDisabled === undefined) {
                      tempProps.cancelDisabled = true;
                    } else {
                      tempProps.cancelDisabled = !tempProps.cancelDisabled;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Allow/Deny Multiple File Upload</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.denyMultipleFileDrop === undefined) {
                      tempProps.denyMultipleFileDrop = true;
                    } else {
                      tempProps.denyMultipleFileDrop = !tempProps.denyMultipleFileDrop;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Allow Only One File In Uploader</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.allowOnlyOneFileInUploader === undefined) {
                      tempProps.allowOnlyOneFileInUploader = true;
                    } else {
                      tempProps.allowOnlyOneFileInUploader = !tempProps.allowOnlyOneFileInUploader;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Message for Allow Only One File In Uploader</td>
              <td>
                <TextInput
                  text={defaultAllowOnlyOneFileInUploaderMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.allowOnlyOneFileInUploaderMessage;
                    } else {
                        tempProps.allowOnlyOneFileInUploaderMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Show Duplicate Errors</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.showDuplicateErrors === undefined) {
                      tempProps.showDuplicateErrors = true;
                    } else {
                      tempProps.showDuplicateErrors = !tempProps.showDuplicateErrors;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Message for Duplicate File Upload error</td>
              <td>
                <TextInput
                  text={fileRejectedDuplicateMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.fileRejectedDuplicateMessage;
                    } else {
                        tempProps.fileRejectedDuplicateMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Retry/Cancel action on Upload Error</td>
              <td>
                <ToggleButton
                  icon="ic_filter"
                  onChange={() => {
                    const tempProps = this.state.fileUploadProps;
                    if (this.state.fileUploadProps.onErrorRetry === undefined) {
                      tempProps.onErrorRetry = true;
                    } else {
                      tempProps.onErrorRetry = !tempProps.onErrorRetry;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Specify Allowed File Types (comma separated)</td>
              <td>
                <TextInput
                  text={defaultFileTypes}
                  value=""
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                      if (tempProps.fileTypes) {
                        delete tempProps.fileTypes;
                      }
                    } else {
                      tempProps.fileTypes = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Maximum File Size Allowed (bytes)</td>
              <td>
                <TextInput
                  placeholder="Infinity"
                  text={defaultMax}
                  inputPattern="^[0-9]+$"
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.maxFileSizeAllowed;
                    } else {
                        tempProps.maxFileSizeAllowed = Number(e.value);
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Minimum File Size Allowed (bytes)</td>
              <td>
                <TextInput
                  placeholder="0"
                  text={defaultMin}
                  inputPattern="^[0-9]+$"
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.minFileSizeAllowed;
                    } else {
                        tempProps.minFileSizeAllowed = Number(e.value);
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Drop Zone Hint Text</td>
              <td>
                <TextInput
                  text={defaultHintText}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.dropZoneHintText;
                    } else {
                        tempProps.dropZoneHintText = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Drop Zone Text</td>
              <td>
                <TextInput
                  text={defaultDropZoneText}
                  onChange={(e) => {
                    console.log(e);
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.dropZoneText;
                    } else {
                        tempProps.dropZoneText = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Drop Zone Button Text</td>
              <td>
                <TextInput
                  text={defaultDropZoneButtonText}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.dropZoneButtonText;
                    } else {
                        tempProps.dropZoneButtonText = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Maximum Component Height (px)</td>
              <td>
                <TextInput
                  placeholder="Infinity"
                  inputPattern="^[0-9]+$"
                  text={defaultHeightMax}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.heightMax;
                    } else {
                        tempProps.heightMax = Number(e.value);
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>File Name Column Header</td>
              <td>
                <TextInput
                  text={defaultDropZoneNameColumnHeader}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.dropZoneNameColumnHeader;
                    } else {
                        tempProps.dropZoneNameColumnHeader = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>File Date Column Header</td>
              <td>
                <TextInput
                  text={defaultDropZoneDateColumnHeader}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.dropZoneDateColumnHeader;
                    } else {
                        tempProps.dropZoneDateColumnHeader = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>File Pending Status Message</td>
              <td>
                <TextInput
                  text={defaultPendingMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.filePendingMessage;
                    } else {
                        tempProps.filePendingMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Error message for invalid file type</td>
              <td>
                <TextInput
                  text={defaultInvalidTypeMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.fileRejectedTypeMessage;
                    } else {
                        tempProps.fileRejectedTypeMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Error message for file too large</td>
              <td>
                <TextInput
                  text={defaultMaxSizeMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.fileRejectedMaxSizeMessage;
                    } else {
                        tempProps.fileRejectedMaxSizeMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Error message for file too small</td>
              <td>
                <TextInput
                  text={defaultMinSizeMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.fileRejectedMinSizeMessage;
                    } else {
                        tempProps.fileRejectedMinSizeMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Error message for rejected file</td>
              <td>
                <TextInput
                  text={defaultRejectMessage}
                  onChange={(e) => {
                    const tempProps = this.state.fileUploadProps;
                    if (e.value === '') {
                        delete tempProps.fileRejectedMessage;
                    } else {
                        tempProps.fileRejectedMessage = e.value;
                    }
                    this.setState({ ...tempProps });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }


  render() {
    return (
      <div>
        <FileUploader
          data={this.state.data}
          {...this.state.fileUploadProps}
          sortOrder={{
          alphabetical: 'Alphabetical',
          uploadDate: 'UploadDate',
        }}
        />
        <hr />
        {this.renderOptions()}
      </div>
    );
  }
}

export default FileUploaderWrapper;