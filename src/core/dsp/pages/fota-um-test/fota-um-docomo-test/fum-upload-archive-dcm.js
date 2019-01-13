import React, { Component } from 'react';
import FUMUploadArchiveDcmTest from '../../fota-um-upload-archive/fota-um-upload-docomo-test/upload-archive';
export class FUMDcmTestUploadArchive extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FUMUploadArchiveDcmTest />
            </div>
        );
    }
}

export default FUMDcmTestUploadArchive;