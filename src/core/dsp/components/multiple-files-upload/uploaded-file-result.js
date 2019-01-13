import React from 'react';
import PropTypes from 'prop-types';
import { FileUploader } from '@nokia-csf-uxr/csfWidgets';
import { formatI18N } from '../../services/i18n-label-service';
import CommonUtils from '../../utils/common.utils';

const statusErrorList = [ 'error', 'rejected', 'rejectedtype', 'rejectedmax', 'rejectedmin' ];// 'rejecteddup' is special

class FileUploaderWrapper extends React.Component {
    constructor(props) {
        super(props);

    }
  static propTypes = {
      initialData: PropTypes.bool,
  }

  static defaultProps = {
      initialData: true,
  }

    // data = (this.props.initialData ? this.props.listItems : [ { filename: (this.props.selectedFile!== null) ? this.props.selectedFile.name : '',
   //   status: 'complete', uploadDate: CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' }), taskId: this.props.initialList }]);

   data = this.props.listItems;

    /* onListItemsUpdate = () => {
      var data = {};
      var dataArray=[];
      if (this.props.initialData && this.state.listItems!=='') {
          for (var key in this.state.listItems) {
              data.filename= this.state.listItems[key].fileName;
              data.taskId=this.state.listItems[key].taskId;
              data.status= 'complete';
              data.uploadDate=CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' });
              dataArray.push(data);
          }
      } else  {
          dataArray.push({ filename: (this.props.selectedFile!== null) ? this.props.selectedFile.name : '',
              status: 'complete', uploadDate: CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' }), taskId: this.props.initialList });
      }
      return dataArray;
  };*/

  state = {
      data: this.data,
      fileUploadProps: {
          onFileSelect: event => {
              this.onFileSelectCallback(event.value);
          },
          fileDeleteResponse: event => {
              this.onFileDeleteCallback(event.value);
          },
          fileDeleteErrorResponse: eventObj => {
              this.onFileDeleteErrorCallback(eventObj.value.filename, eventObj.value.status);
          },
          fileDownloadResponse: eventObj => {
              this.onFileDownloadCallback(eventObj);
          },
          fileCancelResponse: event => {
              this.onFileCancelCallback(event.value);
          },
          fileRetryResponse: event => {
              this.onFileRetryCallback(event.value);
          },
          fileAbortResponse: event => {
              this.onFileAbortCallback(event.value);
          },
          onErrorRetry: true,
      },
      browseAndAddLabel: formatI18N('dsp_sbp-brdcast-psh-tsk_button_label_browse-add'),
      fileNameHeader: formatI18N(''),
      addList: formatI18N('dsp_sbp_brdcast-psh-tsk_label_add-lst'),
      deleteHeader: formatI18N('dsp_sbp_delivery-regulation_header_delete'),
      fileUploaded: '',
      ngListValue: ''
  }

  onFileAbortCallback = filename => {
      const indexToAbort = this.data.findIndex(item => item.filename === filename);
      if ((indexToAbort > -1) && this.data[indexToAbort].status === 'uploading') {
          this.data[indexToAbort].status = 'pending';
      }
      this.setState({ data: this.data });
  };

  onFileRetryCallback = filename => {
      const indexToRetry = this.data.findIndex(item => item.filename === filename);
      if ((indexToRetry > -1) && (this.data[indexToRetry].status === 'error')) {
          this.data[indexToRetry].status = 'pending';
          this.setState({ data: this.data });
          this.simulateUploading();
      } else {
          console.error(`${filename} may not be retried at this time`);
      }
  };

  onFileCancelCallback = filename => {
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

  onFileDeleteCallback = filename => {
      console.log('Getting the Deleted File', filename);
      var newFileDeleted ='';
      var fileDeleted ='';
      let indexToDelete = this.data.findIndex(item => item.filename === filename);
      fileDeleted = this.data[indexToDelete];
      this.data.splice(indexToDelete, 1);
      // is there another entry with this filename hangingaround (status='rejectedDup')
      indexToDelete = this.data.findIndex(item => item.filename === filename);
      if (indexToDelete > -1) {
          this.data.splice(indexToDelete, 1);
      }
      this.setState({ data: this.data });
      console.log('File to delete', fileDeleted);
      newFileDeleted=fileDeleted.listId;
      console.log('New File Deleted', newFileDeleted);
      this.setState({ fileDeleted: newFileDeleted });
      this.props.fileDeleted(fileDeleted);
  };

  onFileDeleteErrorCallback = (filename, status) => {
      const indexToDelete = this.data.findIndex(item => item.filename === filename && item.status.toLowerCase() === status.toLowerCase());
      if (indexToDelete > -1) {
          this.data.splice(indexToDelete, 1);
      }
      this.setState({ data: this.data });
  };


  onFileDownloadCallback = fileDownload => {
      console.log('file******', fileDownload);

      /* var indexClicked = this.data.findIndex(function(obj) {
          return obj.id = filesSelected;
      });*/
      let fileDownloaded = '';
      let indexToDownload = this.data.findIndex(item => item.filename === fileDownload.value);
      fileDownloaded = this.data[indexToDownload];
      console.log('FILE Downloaded', fileDownloaded);
      this.props.fileDownloaded(fileDownloaded);

      /*  var element = document.createElement('a');
      element.setAttribute('href', 'data: '+fileDownloaded.type+';charset=utf-8,'+ '\ufeff' + encodeURIComponent(filesSelected.value));
      element.setAttribute('download', fileDownloaded.name);

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();

      document.body.removeChild(element);*/
  }

  onFileSelectCallback = filesSelected => {
      var validExts = new Array('.csv');
      const rowLen = filesSelected.length;
      var ngListValue;
      var fileExt = filesSelected[rowLen-1].filename;
      fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
          ngListValue = 'File Format Incorrect';
          this.props.ngListValue(ngListValue);
      } else {
          if (filesSelected) {

              var fileUploaded ='';
              filesSelected.map((items, i) => {
                  if (i===rowLen-1) {
                      fileUploaded = items.file;
                  }
              });
              this.setState({ fileUploaded: fileUploaded });
              this.props.fileUploaded(fileUploaded);

              setTimeout(() => {
                  filesSelected.forEach(line => {
                      if (this.data.findIndex(item => item.filename === line.filename) === -1) {
                          console.log('Uploaded File Task ID', this.props.listId);
                          this.data.push({ filename: line.filename, status: line.status, uploadDate: CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' }) , listId: this.props.listId, taskId: this.props.taskId, listType: this.props.listType });


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
                              this.data.push({ filename: line.filename, status: line.status, uploadDate: CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' }) });
                          }
                      }
                  });
                  this.setState({ data: this.data });
                  // updateEnteredFilesOnDisplay();

                  // kickstart the process to begin uploading files if there are any pending
                  this.simulateUploading();
              }, 1000);
          }
      }
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

  progress = index => {
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

              this.data[index].status = 'complete';
              this.data[index].uploadDate = CommonUtils.getLocaleText({ en: 'Delete', ja: '削除' });

              this.setState({ data: this.data });
          }
      }, t);
  };

  deleteSelectedFile = () => {
      console.log('file clicked');
  }
  okCallBackAction = () => {
      console.log('OK Callback action');
  };
  cancelCallBackAction = () => {
      console.log('CANCEL Callback action');
  };

  initialData = [
      { filename: 'file3.txt', status: 'complete', uploadDate: 'Delete' },
      { filename: 'file1.txt', status: 'complete', uploadDate: 'Delete' },
      { filename: 'file2.jpg', status: 'complete', uploadDate: 'Delete' }
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
          this.state.fileUploadProps.dropZoneButtonText ? this.state.fileUploadProps.dropZoneButtonText : this.state.browseAndAddLabel
      );
      const defaultHeightMax = (
          this.state.fileUploadProps.heightMax ? this.state.fileUploadProps.heightMax.toString() : undefined
      );
      const defaultDropZoneNameColumnHeader = (
          this.state.fileUploadProps.dropZoneNameColumnHeader ?
              this.state.fileUploadProps.dropZoneNameColumnHeader :
              ''
      );
      const defaultDropZoneDateColumnHeader = (
          this.state.fileUploadProps.dropZoneDateColumnHeader ?
              this.state.fileUploadProps.dropZoneDateColumnHeader :
              ''
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
  }


  render() {
      return (
          <div>
              <FileUploader
                  data={this.state.data}
                  {...this.state.fileUploadProps}
                  dropZoneText=" "
                  dropZoneButtonText={this.state.browseAndAddLabel}
                  dropZoneDateColumnHeader=""
                  fileDownloadIndicator={true}
              />
          </div>
      );
  }
}

export default FileUploaderWrapper;
FileUploaderWrapper.propTypes={
    listItems: PropTypes.array,
    taskId: PropTypes.string,
    ngListValue: PropTypes.array
};